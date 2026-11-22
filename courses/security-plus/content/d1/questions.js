// Domain 1 — General Security Concepts. Original questions, written to the SY0-801 objectives and checked
// against the NIST CSRC glossary, SP 800-53 Rev. 5 (CM-3, CM-4), SP 800-207, SP 800-57 Part 1 Rev. 5,
// SP 800-131A Rev. 2, SP 800-63B-4, FIPS 180-4, 186-5, 197, 198-1, 203-205, RFC 2986, 5280, 6066, 6151,
// 6960, 7465, 8446, 8996, 9525 and the CA/Browser Forum TLS Baseline Requirements.
// Command output in exhibits is hand-written from documentation (see REVIEW-TODO.md).
const L11 = '1.1-security-concepts-controls';
const L12 = '1.2-change-management';
const L13A = '1.3-pki-certificates';
const L13B = '1.3-encryption-hashing';

const bank = [
  // ---------- 1.1 ----------
  { topic: '1.1', type: 'single', difficulty: 1, lesson: L11,
    stem: 'Refer to the exhibit. Contoso displays this text before the login prompt on fw01 and every switch. The security plan says its purpose is to discourage unauthorized people from attempting to log in. Which control type is it?',
    exhibit: `**********************************************************
* WARNING: Access to this device is restricted to        *
* authorized Contoso staff. All activity is logged and   *
* unauthorized use will be prosecuted.                   *
**********************************************************
fw01 login:`,
    options: ['Deterring', 'Preventive', 'Corrective', 'Compensating'],
    answer: [0],
    explanation: 'A warning banner works on the would-be attacker\'s motivation: it discourages an attempt but cannot stop one, which makes it a **deterring** control (it can also be read as directive, but the stem states the purpose as discouraging). It is not preventive: the password prompt after it is what actually blocks access. It is not corrective, because it does nothing to restore systems after an event. It is not compensating, because it does not stand in for another required control that could not be implemented.' },
  { topic: '1.1', type: 'single', difficulty: 2, lesson: L11,
    stem: 'Contoso\'s purchasing system must let an auditor prove to an outside party that bob, and not another member of the finance team or a server administrator, approved a purchase order. Which mechanism provides this?',
    options: ['An HMAC-SHA256 computed over the approval with a key shared between bob\'s client and the server', 'Sending the approval to the server over TLS 1.3', 'Storing a SHA-256 hash of each approval in the database', 'Bob signing the approval with a private key held on his smart card'],
    answer: [3],
    explanation: 'Only a **digital signature** with a private key that only bob controls gives non-repudiation: anyone can verify it with his public key, and nobody else could have produced it (FIPS 186-5 defines non-repudiation this way). An HMAC proves integrity and that the sender knew the shared key, but the server also holds that key, so it could have created the MAC itself. TLS protects the approval in transit and authenticates the server, not bob, and leaves no lasting proof. A stored hash shows whether the record changed later, but anyone, including an administrator, can compute a hash of a forged approval.' },
  { topic: '1.1', type: 'multi', difficulty: 1, lesson: L11,
    stem: 'Refer to the exhibit. Which two elements of the CIA triad did the incident affect? (Choose two.)',
    exhibit: `Incident INC-0412 summary (Contoso web store)
02:10  Attacker uses a stolen admin session to change prices of 40 products to $0.01
02:55  Prices restored from the catalog backup
03:05  DDoS against www.example.com begins; store unreachable for 2 h 20 min
Forensics: no customer or payment records were read or exported`,
    options: ['Confidentiality', 'Integrity', 'Availability', 'Non-repudiation', 'Authorization'],
    answer: [1, 2],
    explanation: 'Changing prices without authorization is an **integrity** failure, and the DDoS that made the store unreachable is an **availability** failure. Confidentiality was not affected, since forensics found no records were read or exported. Non-repudiation and authorization are not elements of the CIA triad (authorization is part of AAA), even though the stolen admin session points to an authentication weakness.' },
  { topic: '1.1', type: 'single', difficulty: 2, lesson: L11,
    stem: 'Which statement is consistent with the Zero Trust tenets in NIST SP 800-207?',
    options: ['A laptop on the corporate LAN is trusted for the rest of the day after its first successful 802.1X authentication', 'Access to each resource is granted per session, based on dynamic policy that includes the identity and the observed security posture of the device', 'Once a user\'s VPN tunnel is up, the user may reach any internal subnet, because the tunnel is encrypted', 'Personally owned devices are out of scope, because the enterprise does not own them'],
    answer: [1],
    explanation: 'SP 800-207 tenets 3 and 4 say access is granted **per session** and decided by **dynamic policy**, including the observable state of the client and other behavioral and environmental attributes. Trust for a whole day after one 802.1X authentication is exactly the implicit, location-based trust Zero Trust removes (tenets 2 and 6 require strict, dynamic authentication and authorization). An encrypted VPN tunnel secures the channel but grants network-wide access, the opposite of least privilege per resource. Tenet 1 lets an enterprise classify personally owned devices that can access enterprise resources as resources, and tenet 5 applies posture monitoring to "associated" assets such as personally owned devices, so they are not out of scope.' },
  { topic: '1.1', type: 'match', difficulty: 2, lesson: L11,
    stem: 'Match each Contoso control with the control type it primarily represents.',
    pairs: [
      ['Sign at the car park entrance: "Premises under CCTV surveillance; trespassers will be prosecuted"', 'Deterring'],
      ['Firewall rule on fw01 denying inbound RDP from the internet', 'Preventive'],
      ['IDS alert raised when a host scans 500 ports in one minute', 'Detective'],
      ['Reimaging ws01 and restoring its data after a malware infection', 'Corrective'],
      ['Policy requiring staff to lock their screens when leaving their desks', 'Directive'],
      ['Isolating an unpatchable legacy server on its own VLAN until it is replaced', 'Compensating'],
    ],
    explanation: 'The warning sign discourages intruders but cannot stop them (**deterring**). The deny rule blocks the connection (**preventive**). The IDS identifies an event in progress without stopping it (**detective**). Reimaging and restoring returns the system to normal after the event (**corrective**). A policy statement tells people what to do (**directive**). Isolation is used *instead of* the required patching, which cannot be done, so it is **compensating** (it works preventively, but the reason it exists is the constraint).' },
  { topic: '1.1', type: 'match', difficulty: 2, lesson: L11,
    stem: 'Match each control with its control category as named in the SY0-801 objectives.',
    pairs: [
      ['Bollards and a perimeter fence around the data center', 'Physical/environmental'],
      ['A board-approved risk management policy', 'Managerial/administrative'],
      ['Full-disk encryption on all laptops', 'Technical/logical'],
      ['Quarterly security awareness sessions delivered by the security team', 'Operational'],
    ],
    explanation: 'Category describes how a control is implemented. Bollards and fences protect the physical site (**physical/environmental**). A policy set by leadership to direct the security program is **managerial/administrative**. Encryption is enforced by software (**technical/logical**). Training sessions are carried out by people as part of day-to-day security operations (**operational**).' },
  { topic: '1.1', type: 'fill', difficulty: 2, lesson: L11,
    stem: 'Refer to the exhibit. Enter the one-word control type, as named in the SY0-801 objectives, that belongs in the blank field.',
    exhibit: `Contoso risk register - entry R-114
Asset:        HMI-07 (line 3 operator console; vendor support for its OS ended)
Requirement:  Monthly OS patching (standard STD-04)
Constraint:   Vendor will not certify patches; console cannot be replaced until 2027
Control:      Moved to isolated VLAN 340, reachable only from jump host srv01;
              EDR in monitor mode; USB storage disabled
Control type: ____________`,
    answer: ['compensating', 'compensating control'],
    explanation: 'The required control (patching) cannot be implemented because of a documented constraint, so isolation, restricted access and monitoring are put in place **instead**. NIST\'s glossary defines compensating controls as controls employed in lieu of baseline controls that provide equivalent or comparable protection. The individual measures also have preventive and detective effects, but the reason they are recorded against this requirement is that they compensate for the missing patching.' },
  { topic: '1.1', type: 'fill', difficulty: 1, lesson: L11,
    stem: 'Refer to the exhibit. The RADIUS server recorded how long alice was connected to the VPN and how much data she transferred. Which "A" of AAA does this record represent? Enter one word.',
    exhibit: `Sat Nov 21 22:14:07 2026
        Acct-Status-Type = Stop
        User-Name = "alice"
        NAS-IP-Address = 10.0.0.1
        Acct-Session-Id = "4F2A19C0"
        Acct-Session-Time = 3605
        Acct-Input-Octets = 1048576
        Acct-Output-Octets = 52428800
        Acct-Terminate-Cause = User-Request`,
    answer: ['accounting'],
    explanation: 'Session duration, byte counts and the stop reason are **accounting** data: a record of what an authenticated user did. Authentication (proving alice is alice) and authorization (deciding what she may reach, such as a VPN group or VLAN) happen before the session; the RADIUS Acct-* attributes record usage afterwards.' },
  { topic: '1.1', type: 'single', difficulty: 2, lesson: L11,
    stem: 'Refer to the exhibit. The svc-backup account runs the nightly job that copies three file shares to the backup server. Which change best applies the principle of least privilege?',
    exhibit: `Account:        svc-backup
Member of:      Domain Admins, Domain Users
Used by:        BackupAgent on srv04 (nightly 01:00)
Needs:          Read access to \\\\srv01\\finance, \\\\srv01\\hr, \\\\srv02\\projects
Last password change: 2023-02-14`,
    options: ['Enable MFA on svc-backup and keep its current group memberships', 'Rename the account so attackers cannot guess that it is a backup account', 'Remove svc-backup from Domain Admins and grant it only read access to the three shares it backs up', 'Rotate the account\'s password every 30 days'],
    answer: [2],
    explanation: 'Least privilege means granting the **minimum** authorizations the entity needs. The job only reads three shares, so the account should have exactly that, not Domain Admins. MFA is usually impractical for a non-interactive service account and, even if possible, would leave it with domain-wide rights. Renaming is obscurity, not privilege reduction. Password rotation is good hygiene (the 2023 date is a separate finding; a group managed service account would automate it), but a rotated password still unlocks a Domain Admin account.' },
  { topic: '1.1', type: 'single', difficulty: 2, lesson: L11,
    stem: 'The server room door at Contoso carries a sign reading "Authorized personnel only. Badge required beyond this point", and a badge reader controls the door lock. Which option classifies the two controls correctly by type?',
    options: ['Sign: preventive; badge reader: detective', 'Sign: compensating; badge reader: preventive', 'Sign: directive; badge reader: preventive', 'Sign: corrective; badge reader: deterring'],
    answer: [2],
    explanation: 'The sign tells people what they must do, so it is **directive**; the badge-controlled lock physically stops people without a valid badge, so it is **preventive** (its log is also detective, but its main job is blocking entry). A sign cannot prevent entry, and it does not replace another control (compensating) or restore anything after an event (corrective). The badge reader does more than deter: it actually blocks the door.' },
  { topic: '1.1', type: 'multi', difficulty: 2, lesson: L11,
    stem: 'Which two statements about control categories and control types are true? (Choose two.)',
    options: ['Physical controls can only be preventive', 'Category describes how a control is implemented, while type describes what the control does', 'A compensating control must be a technical control', 'Detective controls stop an attack while it is in progress', 'One control can have more than one type; visible CCTV, for example, is both deterring and detective'],
    answer: [1, 4],
    explanation: 'Category (technical, managerial, operational, physical) is about *how* a control is implemented; type (preventive, deterring, detective, corrective, compensating, directive) is about *what it does*, and a single control can serve several types, as visible CCTV deters and records. Physical controls include detective (CCTV), deterring (signs, lighting) and corrective (fire suppression) examples, not just preventive ones. A compensating control can be in any category, for example extra management review where separation of duties is impossible. Detective controls identify and record events; stopping them is what preventive controls do.' },
  { topic: '1.1', type: 'order', difficulty: 3, lesson: L11,
    stem: 'In the NIST SP 800-207 Zero Trust model, alice on ws01 opens an internal application. Put the steps in order.',
    items: ['The request from ws01 reaches the policy enforcement point (PEP) in front of the application', 'The PEP passes the request to the policy decision point', 'The policy engine evaluates alice\'s identity, ws01\'s security posture and policy, and decides to grant access', 'The policy administrator instructs the PEP to open a communication path for this session', 'alice uses the application through the PEP for this session only, and the session can be ended if conditions change'],
    explanation: 'In SP 800-207 the PEP is the component a subject meets first; it enables, monitors and terminates connections. It relies on the policy decision point, which is split into the **policy engine** (makes the grant or deny decision using policy plus inputs such as device state and threat intelligence) and the **policy administrator** (establishes or shuts down the communication path by commanding the PEP). Access is per session (tenet 3), and authorization is re-evaluated dynamically (tenet 6), so the path can be closed if posture or behavior changes.' },

  // ---------- 1.2 ----------
  { topic: '1.2', type: 'order', difficulty: 2, lesson: L12,
    stem: 'An engineer needs to add a new site-to-site VPN on fw01. Put the change management steps in order.',
    items: ['The change owner submits a request with scope, affected stakeholders, implementation steps and a backout plan', 'Once the request is logged, the change is tested in the lab and the impact analysis and test results are attached to it', 'The CAB reviews the evidence and approves the change for a maintenance window', 'The engineer implements the change in the maintenance window, following the SOP and staying within the approved scope', 'The engineer validates the tunnel, updates the network diagram and commits the new configuration to version control'],
    explanation: 'A change starts with a request owned by one accountable person that already includes the backout plan. Impact analysis and testing produce the evidence that the CAB needs, so they come before approval (NIST CM-3 requires approval with explicit consideration of security impact analyses; CM-4 covers the analysis). Implementation happens only after approval, inside the agreed window and scope. Validation, documentation updates and version control close the change.' },
  { topic: '1.2', type: 'single', difficulty: 3, lesson: L12,
    stem: 'Refer to the exhibit. It is 02:20 and the maintenance window ends at 04:00. What should the change team do?',
    exhibit: `CHG-3105  Firmware upgrade fw01, version 8.2 -> 9.0   Window: 00:00-04:00
Backout plan:  Not possible after step 4. Vendor: the configuration is converted
               to the 9.0 format and downgrading is unsupported. Approved by CAB
               on the basis of a fix-forward plan (vendor hotfix 9.0.1 on hand).
00:40  Step 4 complete, configuration converted
01:55  Post-check FAILED: 2 of 14 IPsec tunnels down
02:15  Vendor TAC: known issue in 9.0, fixed in 9.0.1`,
    options: ['Reinstall firmware 8.2 from the backup image, as for any failed change', 'Apply the vendor hotfix 9.0.1 under the approved fail-forward plan, then repeat the post-checks', 'Close the change as successful, because the firmware itself upgraded without errors', 'Leave the two tunnels down and submit a new normal change request to the next weekly CAB'],
    answer: [1],
    explanation: 'The record says backout is impossible after step 4 and that the CAB approved the change with a **fail-forward** plan, so the team should complete the fix (hotfix 9.0.1) and re-validate inside the window. Reinstalling 8.2 is exactly what the vendor says is unsupported once the configuration is converted. A change whose post-checks failed is not successful. Waiting a week leaves an outage that the approved plan already covers.' },
  { topic: '1.2', type: 'single', difficulty: 2, lesson: L12,
    stem: 'Refer to the exhibit. According to Contoso\'s change policy, which item prevents the CAB from approving the request as submitted?',
    exhibit: `Policy CM-POL-2: a normal change requires a named owner, impact analysis,
test results from staging, a backout plan and an approved maintenance window.

CHG-3121  Replace TLS certificate and enable TLS 1.3 on srv01 (web portal)
Owner:            alice
Impact analysis:  Portal unavailable ~2 min during service restart; legacy
                  kiosk clients to be checked
Test results:     Not run (staging certificate not yet issued)
Backout plan:     Restore previous certificate and TLS settings from backup
Window:           Sat 22:00-23:00 (approved)`,
    options: ['The impact analysis does not include a downtime estimate', 'No change owner is named', 'The backout plan is missing', 'No test results from staging have been provided'],
    answer: [3],
    explanation: 'The policy requires test results from staging, and the request says the tests were not run. Every other required element is present: alice is the owner, the impact analysis estimates about two minutes of downtime and flags the legacy kiosks, the backout plan restores the previous certificate and settings, and the window is approved.' },
  { topic: '1.2', type: 'single', difficulty: 2, lesson: L12,
    stem: 'Refer to the exhibit. An approved change upgraded the backup agent on srv01 overnight. This morning the agent will not start. What did the change plan miss?',
    exhibit: `2026-11-22 01:12:09 srv01 EDR  Application control: BLOCKED
  Path:      C:\\Program Files\\BackupAgent\\agent.exe
  Version:   6.4.0 (previously 6.2.3)
  Reason:    File hash not in allow list "Servers-Approved-Apps"
  Action:    Execution prevented`,
    options: ['A reboot of srv01 after the upgrade so the agent service can load', 'A backout plan to reinstall the previous agent version', 'Disabling application control on srv01 for the duration of the backup job', 'Updating the application allow list to approve the new agent version (for example by its publisher signature or new hash)'],
    answer: [3],
    explanation: 'The EDR log shows application allow-listing blocking the new binary because its hash is not approved. Updating allow and deny lists is a technical implication that the impact analysis should have caught, and the update should be as narrow as possible (the publisher\'s signature or the specific new hash). A reboot would not change the allow list decision. Reinstalling the old version backs out the change instead of completing it, and the stem asks what the plan missed. Disabling application control removes a preventive control and is not an approved activity.' },
  { topic: '1.2', type: 'multi', difficulty: 2, lesson: L12,
    stem: 'An approved change updated a shared TLS library on srv01. The package installed without errors, and a vulnerability scanner that checks package versions now reports srv01 as fixed. Which two statements are true? (Choose two.)',
    options: ['Because the package is installed, no further action is needed', 'Services that loaded the old library before the update keep using it in memory until they are restarted', 'The version-based scan proves that every running process now uses the patched library', 'The change plan should have included restarting the dependent services and applications and verifying them', 'Restarting services is a restricted activity that a change may never include'],
    answer: [1, 3],
    explanation: 'A running process keeps the library version it loaded, so the fix is not effective until the **dependent services and applications restart**, and the plan should include those restarts (with their downtime) and verification. A scanner that compares package versions sees the new package on disk and can report "fixed" while vulnerable code is still running, so neither "no further action" nor "the scan proves it" holds. Restarts are a normal, plannable part of a change; restricted activities are actions outside the approved scope.' },
  { topic: '1.2', type: 'single', difficulty: 1, lesson: L12,
    stem: 'While implementing an approved change that adds one firewall rule, an engineer notices an unrelated rule that looks unused and deletes it "while he is in there". Which change management element did he disregard?',
    options: ['Restricted activities: work outside the approved scope is not authorized', 'Fail forward', 'Version control', 'Maintenance window'],
    answer: [0],
    explanation: 'An approved change authorizes specific work. Deleting an unrelated rule is an activity outside that scope, so it has had no impact analysis, testing or approval, however harmless it seems; it needs its own change. Fail forward is about completing a failed change instead of reverting it. Version control would record the deletion but does not authorize it. The work was done inside the window, so the window was respected.' },
  { topic: '1.2', type: 'match', difficulty: 1, lesson: L12,
    stem: 'Match each change management term with its description.',
    pairs: [
      ['Change advisory board (CAB)', 'Group that reviews proposed changes and approves, rejects or defers them'],
      ['Impact analysis', 'Assessment of what a change affects and what could go wrong, including security side effects'],
      ['Backout plan', 'Documented steps to return to the previous known-good state'],
      ['Fail forward', 'Correcting a failed change in place because reverting is impossible or riskier'],
      ['Maintenance window', 'Pre-agreed period when changes and their disruption are allowed'],
      ['Standard operating procedure (SOP)', 'Step-by-step instructions for performing a routine task the same way every time'],
    ],
    explanation: 'The CAB is the approval body. Impact analysis (NIST CM-4) feeds its decision. A backout plan restores the old state, while fail forward pushes on to a working new state when the old one cannot be restored safely. The maintenance window limits when disruption may occur, and SOPs make routine work repeatable and reviewable.' },
  { topic: '1.2', type: 'single', difficulty: 1, lesson: L12,
    stem: 'Refer to the exhibit. Which change management practice does it show?',
    exhibit: `$ git log --oneline -2 -- configs/fw01.conf
3f9c2e1 CHG-3140 allow HTTPS from DMZ proxy to srv01 (alice)
a17d0b4 CHG-3105 baseline after firmware upgrade (bob)
$ git diff a17d0b4 3f9c2e1 -- configs/fw01.conf
+    rule 120 permit tcp from 192.168.50.10 to 10.10.20.11 port 443`,
    options: ['Version control', 'Impact analysis', 'Maintenance window scheduling', 'Stakeholder notification'],
    answer: [0],
    explanation: 'Keeping configurations in a version control system ties each commit to a change ticket and an author, and `git diff` shows exactly what changed between two versions; the earlier commit can also serve as a backout point. Impact analysis happens before approval and assesses effects; it is not a configuration history. The exhibit contains no scheduling or notification information.' },
  { topic: '1.2', type: 'single', difficulty: 2, lesson: L12,
    stem: 'A change approved by the CAB added a new DMZ VLAN behind fw01, was tested and passed validation. Three months later, incident responders tracing an intrusion did not know the VLAN existed and missed a compromised host on it. Which step of the change was skipped?',
    options: ['Backout planning', 'Updating the network diagrams', 'Obtaining CAB approval', 'Testing the change before implementation'],
    answer: [1],
    explanation: 'Responders work from documentation; a VLAN that never made it onto the network diagrams is invisible to them. The stem says the change was approved, tested and validated, so approval and testing were done. A backout plan matters only if the change fails, and this one succeeded.' },

  // ---------- 1.3 PKI and certificates ----------
  { topic: '1.3', type: 'single', difficulty: 2, lesson: L13A,
    stem: 'Refer to the exhibit. The certificate is installed on the load balancer that serves all of the names below. Users report a certificate name-mismatch warning on exactly one of them. Which one?',
    exhibit: `Subject: O = Contoso, CN = *.example.com
X509v3 Subject Alternative Name:
    DNS:*.example.com
Validity
    Not Before: Oct  1 00:00:00 2026 GMT
    Not After : Apr 10 23:59:59 2027 GMT`,
    options: ['https://www.example.com', 'https://vpn.example.com', 'https://example.com', 'https://mail.example.com'],
    answer: [2],
    explanation: 'A wildcard in the left-most label matches **exactly one label** (RFC 9525), so `*.example.com` covers www, vpn and mail but not the bare apex `example.com`, which has no label for the `*` to match. The apex must be listed as its own SAN entry. The validity period (about 192 days) is within the 200-day maximum that the CA/Browser Forum set for public TLS certificates from March 15, 2026.' },
  { topic: '1.3', type: 'single', difficulty: 2, lesson: L13A,
    stem: 'Refer to the exhibit. What should the administrator of www.example.com conclude?',
    exhibit: `$ openssl ocsp -issuer issuing-ca.pem -cert www.pem \\
      -url http://ocsp.example.net -resp_text
...
Response verify OK
www.pem: revoked
        This Update: Nov 22 08:00:00 2026 GMT
        Next Update: Nov 22 20:00:00 2026 GMT
        Reason: keyCompromise
        Revocation Time: Nov 21 23:41:10 2026 GMT`,
    options: ['The certificate was revoked because its private key was reported compromised, so the server needs a new key pair and a new certificate', 'The certificate expired at the revocation time and only needs to be renewed with the same key', 'The responder could not determine the status, so clients should fall back to the CRL', 'The certificate is temporarily on hold and will be reinstated at the Next Update time'],
    answer: [0],
    explanation: 'The OCSP responder signed a **revoked** status with reason **keyCompromise**. Reusing the same key would be pointless, because the key itself is untrusted, so a new key pair, a new CSR and a new certificate are needed (and the cause of the compromise must be found). Revocation is not expiry. "Unknown" is a separate OCSP status (RFC 6960 defines good, revoked and unknown). A temporary hold would show the reason certificateHold, and Next Update is when the responder\'s answer should be refreshed, not a reinstatement time.' },
  { topic: '1.3', type: 'single', difficulty: 2, lesson: L13A,
    stem: 'Contoso wants browsers to receive fresh revocation status for its web certificates during the TLS handshake without contacting the CA themselves, both for user privacy and so that a slow responder does not delay connections. What should be enabled on the web servers?',
    options: ['Publishing delta CRLs every hour', 'OCSP stapling', 'A wildcard certificate', 'Key escrow for the server private keys'],
    answer: [1],
    explanation: 'With **OCSP stapling** (the TLS status_request extension, RFC 6066; carried in the certificate entry in TLS 1.3), the server fetches a signed, time-limited OCSP response for its own certificate and sends it in the handshake, so the client never contacts the responder. Delta CRLs make CRLs fresher but clients still download them from the CA. A wildcard certificate changes which names are covered, not how status is delivered. Key escrow is about recovering keys and is unrelated to revocation checking.' },
  { topic: '1.3', type: 'order', difficulty: 2, lesson: L13A,
    stem: 'Contoso orders a publicly trusted TLS certificate for www.example.com through a commercial CA\'s web portal, which asks for the CSR when the order is placed. Put the steps in order.',
    items: ['Generate a key pair on the web server', 'Create a CSR containing the subject name, requested SANs and the public key, signed with the private key', 'Place the order on the CA\'s portal and paste in the CSR', 'The CA validates control of the domain, for example with a DNS TXT record', 'The CA signs and issues the certificate', 'Install the certificate and the intermediate CA certificate on the server, next to the private key'],
    explanation: 'The key pair must exist before the CSR, because the CSR carries the public key and is signed with the private key to prove possession (RFC 2986). In this portal workflow the CA validates only after it has the order, and it issues only after validation. (With ACME, RFC 8555, domain validation can happen before the CSR is sent at the finalize step, which is why the stem specifies a portal that asks for the CSR first.) Finally the certificate is installed together with its intermediate chain; the private key never leaves the server.' },
  { topic: '1.3', type: 'order', difficulty: 2, lesson: L13A,
    stem: 'Refer to the exhibit. A client validates the certificate presented by www.example.com. Put the certificates in order from the root of trust down to the end-entity certificate.',
    exhibit: `Cert A  Subject: CN = Example Trust Issuing CA 2
        Issuer:  CN = Example Trust Policy CA
        Basic Constraints: CA:TRUE
Cert B  Subject: CN = www.example.com
        Issuer:  CN = Example Trust Issuing CA 2
        Basic Constraints: CA:FALSE
Cert C  Subject: CN = Example Trust Root R1
        Issuer:  CN = Example Trust Root R1
        Basic Constraints: CA:TRUE
Cert D  Subject: CN = Example Trust Policy CA
        Issuer:  CN = Example Trust Root R1
        Basic Constraints: CA:TRUE`,
    items: ['Cert C (Example Trust Root R1)', 'Cert D (Example Trust Policy CA)', 'Cert A (Example Trust Issuing CA 2)', 'Cert B (www.example.com)'],
    explanation: 'Follow the issuer names. Cert C is self-signed (subject equals issuer) and is the root, the trust anchor in the client\'s store. It issued Cert D, the policy intermediate, which issued Cert A, the issuing CA, which issued the end-entity Cert B (CA:FALSE). The client verifies each signature with the public key of the certificate above it until it reaches the trusted root.' },
  { topic: '1.3', type: 'multi', difficulty: 2, lesson: L13A,
    stem: 'Which two items does a PKCS #10 certificate signing request contain? (Choose two.)',
    options: ['The requester\'s private key, encrypted with the CA\'s public key', 'The requester\'s public key', 'The CA\'s signature over the requester\'s name', 'A signature made with the requester\'s private key', 'The serial number that the certificate will carry'],
    answer: [1, 3],
    explanation: 'RFC 2986 defines a CSR as the certification request information (the subject\'s distinguished name, its **public key** and attributes) plus a **signature over it made with the subject\'s private key**, which proves possession of that key. The private key is never sent to the CA in any form. The CA\'s signature and the serial number appear only in the issued certificate.' },
  { topic: '1.3', type: 'single', difficulty: 3, lesson: L13A,
    stem: 'Contoso policy says encrypted email must remain readable after an employee leaves, and signed email must provide non-repudiation. Which key management approach meets both requirements?',
    options: ['Issue each user one key pair for both signing and encryption, and escrow it', 'Escrow each user\'s public keys with a key recovery agent', 'Replace signatures with HMACs, whose keys can safely be escrowed', 'Issue separate key pairs, escrowing the encryption private keys while signing private keys stay only with their owners'],
    answer: [3],
    explanation: 'Escrowing the **encryption** private keys lets authorized recovery agents decrypt old mail (key recovery), while keeping **signing** private keys only with their owners preserves non-repudiation; SP 800-57 notes that backing up a private signature key puts non-repudiation in question. A single escrowed dual-use key would let the escrow holder forge signatures. Public keys are not secret and recovering them decrypts nothing. HMAC keys are shared, so HMACs cannot provide non-repudiation at all.' },
  { topic: '1.3', type: 'single', difficulty: 3, lesson: L13A,
    stem: 'Contoso needs TLS certificates for 300 internal servers that are reached only by domain-joined laptops. Users must not see warnings, every server must have its own key pair, and policy forbids disclosing internal host names outside the company. Which approach meets all of these requirements?',
    options: ['A self-signed certificate on each server', 'One wildcard certificate from a public CA installed on all 300 servers', 'Certificates from an internal CA whose root certificate is deployed to the laptops by Group Policy', 'A separate public CA certificate for each server name'],
    answer: [2],
    explanation: 'An **internal CA** issues per-server certificates without warnings once its root is in the laptops\' trust stores, and nothing is published outside the company. Self-signed certificates cause warnings unless each one is trusted individually. A single wildcard shares one private key across all 300 servers, which breaks the per-server key requirement. Publicly trusted certificates are recorded in public Certificate Transparency logs (browsers require it), so 300 named certificates would disclose every internal host name.' },
  { topic: '1.3', type: 'single', difficulty: 2, lesson: L13A,
    stem: 'Refer to the exhibit. Some clients connect to www.example.com without errors and others report an untrusted certificate. The Example Trust root is in every client\'s trust store. What is the most likely fix?',
    exhibit: `$ openssl s_client -connect www.example.com:443 -servername www.example.com
CONNECTED(00000003)
depth=0 CN = www.example.com
verify error:num=20:unable to get local issuer certificate
verify return:1
depth=0 CN = www.example.com
verify error:num=21:unable to verify the first certificate
verify return:1
---
Certificate chain
 0 s:CN = www.example.com
   i:O = Example Trust, CN = Example Trust TLS Issuing CA 2
   a:PKEY: rsaEncryption, 2048 (bit); sigalg: RSA-SHA256
   v:NotBefore: Oct  1 00:00:00 2026 GMT; NotAfter: Apr 10 23:59:59 2027 GMT
---`,
    options: ['Replace the certificate with a self-signed one', 'Revoke the certificate and publish a new CRL', 'Configure the server to send the intermediate certificate (Example Trust TLS Issuing CA 2) with its leaf certificate', 'Escrow the server\'s private key with the CA'],
    answer: [2],
    explanation: 'The server sends only its leaf (one entry, depth 0), so clients cannot build a path to the root unless they already have the intermediate cached, which is why only some clients fail. Serving the **full chain** fixes it. A self-signed certificate would fail on every client. Nothing indicates compromise, so revocation would only cause an outage. Key escrow has nothing to do with chain building.' },
  { topic: '1.3', type: 'fill', difficulty: 1, lesson: L13A,
    stem: 'Refer to the exhibit. Instead of downloading this entire list, a client could ask a responder about just one certificate. Enter the acronym of that protocol.',
    exhibit: `Certificate Revocation List (CRL):
        Version 2 (0x1)
        Signature Algorithm: sha256WithRSAEncryption
        Issuer: O = Contoso, CN = Contoso Issuing CA 1
        Last Update: Nov 22 06:00:00 2026 GMT
        Next Update: Nov 29 06:00:00 2026 GMT
Revoked Certificates:
    Serial Number: 5A1C0F73E2
        Revocation Date: Nov 20 14:12:44 2026 GMT
        CRL entry extensions:
            X509v3 CRL Reason Code:
                Key Compromise
    ... (2,814 more entries)`,
    answer: ['OCSP', 'Online Certificate Status Protocol'],
    explanation: 'The **Online Certificate Status Protocol** (RFC 6960) returns a signed good, revoked or unknown status for one certificate. A CRL (RFC 5280) lists every revoked serial number from the CA and is only as fresh as its last publication; this one promises its successor by Next Update, a week after Last Update (RFC 5280 allows the next CRL to be issued earlier, but not later), so a certificate revoked on Nov 23 might not appear in a published CRL until Nov 29.' },

  // ---------- 1.3 encryption, hashing and signatures ----------
  { topic: '1.3', type: 'fill', difficulty: 2, lesson: L13B,
    stem: 'Refer to the exhibit, taken from NIST SP 800-57 Part 1 comparable-strength guidance. Enter the RSA modulus size, in bits, that belongs in the blank.',
    exhibit: `Security strength | Symmetric | RSA modulus (k) | ECC key (f)
------------------+-----------+-----------------+------------
112 bits          | (3TDEA)   | 2048            | 224-255
128 bits          | AES-128   | ______          | 256-383
192 bits          | AES-192   | 7680            | 384-511
256 bits          | AES-256   | 15360           | 512+`,
    answer: ['3072', '3072 bits', '3072-bit', '3,072'],
    explanation: 'SP 800-57 Part 1 Rev. 5, Table 2, lists RSA k = **3072** as comparable to AES-128 and a 256-383-bit elliptic curve key (such as P-256). It is why a P-256 ECDSA certificate and an RSA-3072 certificate are considered roughly equal in strength, and why RSA-2048 provides only 112 bits.' },
  { topic: '1.3', type: 'fill', difficulty: 2, lesson: L13B,
    stem: 'Refer to the exhibit. Because the session key was agreed with an ephemeral X25519 key, a recording of this session cannot be decrypted later even if the server\'s certificate private key is stolen. Enter the name of this property.',
    exhibit: `$ openssl s_client -connect www.example.com:443 -tls1_3     (excerpt)
Server certificate
subject=CN = www.example.com
issuer=O = Example Trust, CN = Example Trust TLS Issuing CA 2
---
Peer signing digest: SHA256
Peer signature type: ECDSA
Server Temp Key: X25519, 253 bits
---
New, TLSv1.3, Cipher is TLS_AES_256_GCM_SHA384
Verify return code: 0 (ok)`,
    answer: ['forward secrecy', 'perfect forward secrecy', 'PFS', 'FS'],
    explanation: '**Forward secrecy** (often "perfect forward secrecy") means compromising a long-term key does not expose past session keys, because each session used fresh ephemeral Diffie-Hellman values that were discarded. "Server Temp Key: X25519" shows the ephemeral ECDH key; the certificate\'s ECDSA key only signs the handshake. RFC 9846 (which obsoleted RFC 8446) removed static RSA and static DH from TLS 1.3, so all of its public-key key exchanges provide forward secrecy.' },
  { topic: '1.3', type: 'match', difficulty: 2, lesson: L13B,
    stem: 'Match each requirement with the encryption level that meets it most directly.',
    pairs: [
      ['A laptop stolen while powered off must not reveal any data, including the OS, swap and free space', 'Full disk'],
      ['A spreadsheet must stay encrypted when it is emailed or copied to a USB drive', 'File'],
      ['Stolen database backup files must be unreadable, without changing the application', 'Database (transparent data encryption)'],
      ['Only the card-number field is encrypted, by the application, so that DBAs cannot read it', 'Record (field-level)'],
      ['A container file mounted as drive X: holds a team\'s project data and is locked when dismounted', 'Volume'],
    ],
    explanation: 'Full-disk encryption covers everything on the drive while it is locked. File encryption travels with the file. Transparent data encryption protects the database files and backups at rest but is invisible to the application and to DBAs. Record or field-level encryption protects individual values even from people with database access. An encrypted container mounted as a drive is a volume.' },
  { topic: '1.3', type: 'match', difficulty: 2, lesson: L13B,
    stem: 'Match each algorithm with what it is.',
    pairs: [
      ['AES-256-GCM', 'Symmetric authenticated encryption'],
      ['RSA-3072', 'Asymmetric algorithm for encryption and signatures'],
      ['SHA-256', 'Cryptographic hash function'],
      ['HMAC-SHA256', 'Message authentication code using a shared secret key'],
      ['ECDHE', 'Ephemeral elliptic-curve key agreement'],
      ['Argon2id', 'Memory-hard password hashing (key stretching)'],
    ],
    explanation: 'AES is the symmetric block cipher (FIPS 197); GCM adds authentication. RSA is asymmetric and used for signatures and key transport. SHA-256 is a keyless one-way hash (FIPS 180-4). HMAC (FIPS 198-1) combines a hash with a shared key for integrity and authenticity, without non-repudiation. ECDHE agrees a session key with ephemeral keys, giving forward secrecy. Argon2id (RFC 9106) is a deliberately slow, memory-hard password-hashing function.' },
  { topic: '1.3', type: 'single', difficulty: 2, lesson: L13B,
    stem: 'Refer to the exhibit, an extract from a breached application database. Which change best addresses the weakness it shows?',
    exhibit: `user   password_hash (SHA-256, single pass)
alice  5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8
bob    c4bbcb1fbec99d65bf59d85c8cb62ee2db963f0fe106f483d9afa73bd4e39a8a
carol  5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8`,
    options: ['Switch the hash function to SHA-512', 'Encrypt the password_hash column with AES-256', 'Store passwords with a unique random salt per user in a slow password-hashing scheme such as Argon2id or PBKDF2, re-hashing at each user\'s next login', 'Add one site-wide salt value to every password before hashing it with SHA-256'],
    answer: [2],
    explanation: 'Alice and carol have identical hashes, so the hashes are **unsalted**, and a single fast SHA-256 pass lets attackers test billions of guesses per second (this digest is in fact SHA-256 of "password"). A **per-user salt** (at least 32 bits under SP 800-63B-4) defeats precomputed tables and hides identical passwords, and a **key-stretching** scheme with a cost factor makes each guess expensive. SHA-512 is just as fast and still unsalted. Encrypting the column adds a key that lives on the same compromised server and still leaves identical values. A single site-wide salt still gives users with the same password the same hash, and one table can be built for it.' },
  { topic: '1.3', type: 'multi', difficulty: 2, lesson: L13B,
    stem: 'Which two statements about salting password hashes are true? (Choose two.)',
    options: ['A unique salt per password makes precomputed (rainbow) tables ineffective', 'Salts must be kept secret, like encryption keys', 'Salting prevents an attacker from cracking a weak password such as Summer2026!', 'Two users with the same password end up with different stored hashes', 'Salting makes the stored hash reversible, so the password can be recovered if a user forgets it'],
    answer: [0, 3],
    explanation: 'A salt is a random, non-secret value stored with each hash; it forces an attacker to attack each hash separately (no precomputed tables) and makes identical passwords hash differently. It is not secret (a secret value stored separately is a pepper). An attacker with the database can still guess a weak password against each account\'s salt, so salting does not make weak passwords safe; length and key stretching do the heavy lifting. Hashing, salted or not, is one-way, not encryption.' },
  { topic: '1.3', type: 'single', difficulty: 1, lesson: L13B,
    stem: 'Contoso is designing a new code-signing workflow. Which hash algorithm is appropriate for the signatures under current NIST guidance?',
    options: ['MD5', 'SHA-256', 'SHA-1', 'CRC-32'],
    answer: [1],
    explanation: '**SHA-256** (FIPS 180-4) is approved and is the usual choice for signatures. MD5 has had published collisions since 2004 and RFC 6151 says it is not acceptable where collision resistance is required. SHA-1 has practical and chosen-prefix collisions; SP 800-131A Rev. 2 disallows it for generating digital signatures, and NIST plans to retire it entirely by December 31, 2030. CRC-32 is an error-detecting checksum, not a cryptographic hash; collisions are trivial to create.' },
  { topic: '1.3', type: 'multi', difficulty: 2, lesson: L13B,
    stem: 'Refer to the exhibit, listing the TLS 1.2 cipher suites srv01 offers. Which two suites should be removed because they use a cipher that is disallowed or prohibited? (Choose two.)',
    exhibit: `srv01:443  TLSv1.2 cipher suites offered (server order)
  TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384
  TLS_ECDHE_RSA_WITH_AES_128_GCM_SHA256
  TLS_ECDHE_RSA_WITH_CHACHA20_POLY1305_SHA256
  TLS_RSA_WITH_3DES_EDE_CBC_SHA
  TLS_RSA_WITH_RC4_128_SHA`,
    options: ['TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384', 'TLS_RSA_WITH_3DES_EDE_CBC_SHA', 'TLS_ECDHE_RSA_WITH_AES_128_GCM_SHA256', 'TLS_ECDHE_RSA_WITH_CHACHA20_POLY1305_SHA256', 'TLS_RSA_WITH_RC4_128_SHA'],
    answer: [1, 4],
    explanation: '**RC4** is prohibited in TLS by RFC 7465, and **3DES** (three-key TDEA) has been disallowed for encryption since the end of 2023 under SP 800-131A Rev. 2; both of these suites also use static RSA key transport, so they lack forward secrecy. The three ECDHE suites use AEAD ciphers (AES-GCM, ChaCha20-Poly1305) with ephemeral key exchange and are the suites to keep.' },
  { topic: '1.3', type: 'single', difficulty: 1, lesson: L13B,
    stem: 'Bob receives a contract that alice digitally signed. Which key does bob use to verify the signature?',
    options: ['Bob\'s private key', 'Alice\'s private key', 'Bob\'s public key', 'Alice\'s public key'],
    answer: [3],
    explanation: 'Alice signs with **her private key**, which only she holds, and anyone verifies with **her public key**, usually taken from her certificate. Bob\'s keys play no part in verifying alice\'s signature (bob\'s public key would be used to *encrypt* something for him). Bob never has alice\'s private key; if he did, the signature would prove nothing.' },
  { topic: '1.3', type: 'single', difficulty: 2, lesson: L13B,
    stem: 'An auditor warns that if the private key of Contoso\'s web server leaks, an attacker who has recorded past HTTPS sessions could decrypt them. The server negotiates TLS_RSA_WITH_AES_256_CBC_SHA with most clients. Which change addresses the auditor\'s concern?',
    options: ['Replace the 2048-bit RSA key with a 4096-bit RSA key', 'Allow only ECDHE key exchange (TLS 1.2 ECDHE suites, or TLS 1.3)', 'Switch the bulk cipher from AES-256-CBC to AES-128-GCM while keeping RSA key transport', 'Enable OCSP stapling'],
    answer: [1],
    explanation: 'With RSA key transport, the session key is encrypted with the server\'s long-term public key, so whoever later gets the private key can decrypt every recording. **Ephemeral ECDHE** agrees a fresh key per session that the long-term key only signs, giving forward secrecy; every TLS 1.3 certificate-based handshake uses (EC)DHE, because RFC 9846 (which obsoleted RFC 8446) removed static RSA key transport. A longer RSA key is harder to break but, once stolen, still decrypts all recordings. Changing the bulk cipher leaves the key exchange unchanged. OCSP stapling delivers revocation status and has no effect on session keys.' },
  { topic: '1.3', type: 'single', difficulty: 2, lesson: L13B,
    stem: 'Contoso\'s two issuing CA servers must share one signing key that is generated and used inside a dedicated, tamper-resistant device and can never be exported in plaintext. Which tool meets the requirement?',
    options: ['A hardware security module (HSM)', 'The TPM on one of the CA servers', 'A password-protected PFX file on a shared drive', 'The secure enclave on the PKI administrator\'s phone'],
    answer: [0],
    explanation: 'An **HSM** is a dedicated, tamper-resistant device (network appliance or card) that generates keys and performs signing inside itself, and a network HSM can serve several CA servers. A TPM is bound to one motherboard, so the other server could not use the key. A PFX file is a software key store that can be copied and attacked offline. A phone\'s secure enclave protects that phone\'s own keys and is not a CA signing service.' },
  { topic: '1.3', type: 'single', difficulty: 1, lesson: L13B,
    stem: 'During an investigation, analysts find that image files sent out by ws01 are larger than their resolution would explain, and a tool extracts a hidden archive from the unused bits of the pixel data. Which technique did the insider use?',
    options: ['Salting', 'Key stretching', 'Steganography', 'Hashing'],
    answer: [2],
    explanation: '**Steganography** hides the existence of data inside other data, such as the low-order bits of an image; it is a form of obfuscation, not encryption, and once found the data is readable unless it was also encrypted. Salting and key stretching strengthen password hashes. Hashing produces a fixed-length digest and cannot carry a recoverable archive.' },

  // ---------- added in review: performance-based items ----------
  { topic: '1.2', type: 'match', difficulty: 2, lesson: L12,
    stem: 'Match each problem found while planning or reviewing a Contoso change with the technical implication it illustrates.',
    pairs: [
      ['After the web server is hardened, a factory-floor client that only supports TLS 1.0 can no longer connect', 'Legacy application'],
      ['The upgraded backup agent will not run because application control has not approved its new hash', 'Allow list/deny list'],
      ['A patched daemon keeps running the old vulnerable code until it is stopped and started again', 'Service restart'],
      ['The payroll application fails because the DNS server it uses to find its database was replaced in the same change', 'Dependency'],
      ['Customers cannot reach the portal for two minutes while the change is applied', 'Downtime'],
      ['The approved change states that the implementer may not disable EDR on the server while working', 'Restricted activity'],
    ],
    explanation: 'Old software that cannot use current protocols is a **legacy application** concern, usually handled with a compensating control or an exception rather than by abandoning the change. Application control blocking an unapproved binary is an **allow list/deny list** update the plan must include. A daemon keeps the code it loaded until a **service restart**, which must be scheduled and verified. Another system relying on the changed component is a **dependency** that impact analysis should map. A planned outage is **downtime** that stakeholders must be told about and that should fit the maintenance window. Limits on what the implementer may do during the work are **restricted activities**.' },
  { topic: '1.3', type: 'order', difficulty: 2, lesson: L13B,
    stem: 'alice sends bob a contract signed with RSA (or ECDSA). Put the steps of creating and verifying the signature in order.',
    items: ['alice computes a hash of the contract, for example with SHA-256', 'alice signs the hash with her private key', 'alice sends bob the contract, the signature and her certificate', 'bob computes the hash of the contract he received', 'bob checks the signature against that hash using the public key in alice\'s certificate'],
    explanation: 'With RSA and ECDSA the signer hashes the message first and signs the digest with the **private key**; the signature can only be sent once it exists. The verifier recomputes the hash of what actually arrived and checks the signature with the signer\'s **public key**: if the contract changed in transit, the hashes differ and verification fails. (EdDSA and ML-DSA hash the message inside the algorithm, which is why the stem names RSA or ECDSA.)' },
  { topic: '1.1', type: 'fill', difficulty: 1, lesson: L11,
    stem: 'Refer to the exhibit. The SIEM rule that produced this record raises an alert and opens a ticket; it does not block the source or lock the account. Enter the one-word control type, as named in the SY0-801 objectives, that this rule represents.',
    exhibit: `2026-11-22T03:14:52Z siem01 rule=AUTH-BRUTE-05 severity=high
  src=203.0.113.45 dst=srv01 user=alice event=logon_failure
  count=20 window=5m action=alert_only
  ticket=SOC-8812 assigned=bob status=open`,
    answer: ['detective', 'detective control'],
    explanation: 'The rule identifies and records an event while it is happening and hands it to an analyst, which makes it a **detective** control (technical category). It is not preventive, because action=alert_only means nothing is blocked; not corrective, because nothing is restored or repaired; and not deterring, because the attacker never sees it. If the rule also blocked the source address, it would add a preventive function.' },
];

export default bank.map((item, i) => ({ id: `d1-${String(i + 1).padStart(3, '0')}`, ...item }));
