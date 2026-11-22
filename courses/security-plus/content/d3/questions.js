// Domain 3 — Security Architecture. Original questions, written to the SY0-801 objectives and checked against
// NIST SP 800-145, 800-207, 800-82 Rev. 3, 800-34 Rev. 1, 800-88 Rev. 2, 800-188, the NIST CSRC glossary,
// EO 13526, the GDPR, 16 CFR 312, the PCI SSC glossary, CISA backup guidance, Microsoft Learn (gMSA) and the
// RFCs named in lessons.js. Exhibits are hand-written from documentation (see REVIEW-TODO.md).
const L31A = '3.1-architecture-models';
const L31B = '3.1-architecture-considerations';
const L32A = '3.2-infrastructure-zero-trust';
const L32B = '3.2-secure-access-identity';
const L33A = '3.3-data-types-methods';
const L33B = '3.3-data-roles-handling-compliance';
const L34A = '3.4-sites-redundancy-power';
const L34B = '3.4-backups-testing-metrics';

const bank = [
  // ---------- 3.1 ----------
  { topic: '3.1', type: 'single', difficulty: 2, lesson: L31A,
    stem: 'Refer to the exhibit. Contoso is moving its invoice-processing job from a VM to this serverless function. Which responsibility moves from Contoso to the cloud provider as a result?',
    exhibit: `Function:      invoice-parse
Runtime:       python3.12 (provider-managed)
Trigger:       object upload to bucket "invoices-inbound"
Execution role: role-invoice-parse
  - s3:GetObject   on invoices-inbound/*
  - dynamodb:PutItem on table Invoices
Packages:      pdfminer.six 20240706, requests 2.32.3
Secrets:       DB key read from provider secrets manager`,
    options: ['Keeping pdfminer.six and requests free of known vulnerabilities', 'Validating the content of uploaded files before parsing them', 'Patching the operating system and the Python runtime the function runs on', 'Keeping the execution role limited to the two permissions it needs'],
    answer: [2],
    explanation: 'Serverless still runs on servers, but the provider manages them: the host **operating system and the managed language runtime** are patched by the provider, which is the responsibility that moves. The third-party packages bundled with the function are Contoso\'s code and stay Contoso\'s to update. Validating the event data (the uploaded file) is application logic, also Contoso\'s. The execution role is an identity and access configuration in Contoso\'s account; least privilege on it is always the customer\'s job.' },
  { topic: '3.1', type: 'single', difficulty: 2, lesson: L31A,
    stem: 'Four regional hospitals with the same regulatory obligations jointly fund a cloud platform that only their staff can use. A third-party provider operates it in its own data center. Which NIST SP 800-145 deployment model is this?',
    options: ['Public cloud', 'Private cloud', 'Hybrid cloud', 'Community cloud'],
    answer: [3],
    explanation: 'SP 800-145 defines a **community cloud** as infrastructure provisioned for exclusive use by a specific community of consumers from organizations with shared concerns such as security requirements and compliance; it may be operated by a third party and exist off premises. It is not public, because the general public cannot use it. It is not private, because private cloud is for a single organization. It is not hybrid, because there is only one infrastructure, not two or more distinct ones bound together.' },
  { topic: '3.1', type: 'match', difficulty: 2, lesson: L31A,
    stem: 'Match each Contoso scenario with the NIST SP 800-145 cloud deployment model it describes.',
    pairs: [
      ['Contoso runs an OpenStack platform in its own data center, used only by its business units', 'Private'],
      ['Contoso\'s marketing team uses a webmail service anyone can sign up for', 'Public'],
      ['The Contoso-only OpenStack platform bursts batch jobs into a public provider when it runs out of capacity', 'Hybrid'],
      ['Contoso and three partner defense suppliers share a platform built to a common security baseline, for their exclusive use', 'Community'],
    ],
    explanation: 'Exclusive use by one organization, whoever operates it and wherever it is, is **private**. Open use by the general public is **public**. Two distinct infrastructures (the private platform and a public cloud) bound together so work can move between them, which SP 800-145 illustrates with cloud bursting, is **hybrid**. Exclusive use by several organizations with shared concerns, here a common security baseline, is **community**.' },
  { topic: '3.1', type: 'single', difficulty: 2, lesson: L31A,
    stem: 'Refer to the exhibit. This Terraform module is used by 40 application teams to create their web security groups. A review finds SSH open to the internet in every environment. Which action fixes the problem across all 40 deployments and keeps it from returning?',
    exhibit: `# modules/web-sg/main.tf  (shared module, v1.4.0)
resource "aws_security_group" "web" {
  name   = "web-sg"
  vpc_id = var.vpc_id

  ingress {
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }
  ingress {
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }
}`,
    options: ['Remove the SSH rule from each security group in the cloud console', 'Remove the SSH rule from the module, release a new version that teams apply through the pipeline, and add a policy-as-code check that fails any template allowing port 22 from 0.0.0.0/0', 'Put a web application firewall in front of every web server', 'Require MFA for all users of the cloud console'],
    answer: [1],
    explanation: 'With infrastructure as code the source is the source of truth: fixing the **shared module** corrects every deployment when the pipeline applies it, and a **pre-deployment policy check** stops the mistake from coming back. Editing each group in the console creates drift, and the next pipeline run re-applies the module and reopens SSH. A WAF inspects HTTP(S), not SSH on port 22. Console MFA protects administrator sign-ins but does nothing about a rule that exposes port 22 on every server.' },
  { topic: '3.1', type: 'multi', difficulty: 2, lesson: L31A,
    stem: 'Contoso keeps its code-signing systems on an air-gapped network. Which two statements describe limitations of this design? (Choose two.)',
    options: ['An air gap is defined as a firewall that blocks all inbound connections', 'Malware can still cross the gap on removable media or a maintenance laptop', 'A data diode between the networks keeps it an air gap, because traffic flows one way', 'Patches and updates must be carried across manually, so the systems can fall behind', 'An air gap stops a malicious insider who has physical access to the systems'],
    answer: [1, 3],
    explanation: 'The NIST glossary (from RFC 4949) defines an air gap as an interface where systems are not physically connected and any logical connection is not automated: data crosses only manually. So **removable media and visiting laptops** are the remaining path for malware, and **updates must be carried in by hand**, which tends to delay patching. A firewall is a connection, not an air gap. A data diode is an automated (one-way) connection, so it is an alternative to an air gap, not an air gap. An insider with physical access can work on the systems directly; the gap does nothing to stop them.' },
  { topic: '3.1', type: 'single', difficulty: 2, lesson: L31A,
    stem: 'A PLC controlling a chemical dosing process runs firmware with a published vulnerability. The vendor has a patch, but installing it requires stopping the process, and the next planned shutdown is in four months. Which approach is consistent with NIST SP 800-82 Rev. 3?',
    options: ['Install the patch immediately, because confidentiality of OT data is the top priority', 'Run an authenticated vulnerability scan against the PLC every hour until it is patched', 'Connect the PLC directly to the corporate network so central patch management can reach it', 'Restrict and monitor network access to the PLC now, and schedule the vendor-approved patch for the planned shutdown'],
    answer: [3],
    explanation: 'SP 800-82 says OT security objectives typically prioritize integrity and availability, with safety as an overarching concern, and that rebooting or unplanned changes may not be acceptable. **Compensating controls now (segmentation, restricted access, monitoring) and the patch at the planned outage** fit that. Patching immediately ignores the process and safety impact, and confidentiality is not OT\'s top priority. Aggressive active scanning can itself disrupt fragile OT devices. Connecting the PLC to the corporate network enlarges its attack surface, the opposite of OT segmentation guidance.' },
  { topic: '3.1', type: 'single', difficulty: 2, lesson: L31A,
    stem: 'Refer to the exhibit. Which segmentation approach satisfies requirement SR-3?',
    exhibit: `Contoso security requirements, program LABNET
SR-1  LABNET and the corporate network must not exchange any traffic.
SR-2  LABNET hosts must be inventoried and patched monthly.
SR-3  Isolation between LABNET and corporate must hold even if a
      switch is misconfigured or its firmware is compromised.`,
    options: ['Separate VLANs on the existing core switches with no SVI for the LABNET VLAN', 'A separate VRF for LABNET on the core switches', 'Separate switches, cabling and firewall for LABNET with no connection to the corporate network', 'Private VLANs on the existing access switches'],
    answer: [2],
    explanation: 'SR-3 requires isolation that does not depend on the shared switching gear behaving correctly, which only **physical segmentation** provides. VLANs, VRFs and private VLANs are all logical segmentation on the same switches: a misconfiguration (a trunk carrying the wrong VLAN, a route leak between VRFs) or compromised switch firmware could bridge the networks, so none of them meets SR-3, even though each could satisfy SR-1 on its own.' },
  { topic: '3.1', type: 'single', difficulty: 2, lesson: L31A,
    stem: 'Contoso is splitting its monolithic order application into 25 microservices that call each other over internal REST APIs. Which control best addresses the main new security implication of this design?',
    options: ['A larger perimeter firewall at the internet edge', 'A single API key shared by all services for internal calls', 'Disabling internal logging to reduce latency between services', 'Mutual TLS with a distinct identity for each service, and authorization on every service-to-service call'],
    answer: [3],
    explanation: 'Microservices multiply **east-west** API traffic, so the internal attack surface grows. **Per-service identity with mutual TLS and authorization on each call** (often via a service mesh) lets each service accept only the callers it should. The edge firewall never sees internal service-to-service traffic. One shared key means compromising any service lets an attacker impersonate all of them. Removing logging destroys the tracing needed to investigate requests that cross many services.' },
  { topic: '3.1', type: 'fill', difficulty: 1, lesson: L31A,
    stem: 'Enter the one-word NIST SP 800-145 deployment model defined as "a composition of two or more distinct cloud infrastructures (private, community, or public) that remain unique entities, but are bound together by standardized or proprietary technology that enables data and application portability".',
    answer: ['hybrid', 'hybrid cloud'],
    explanation: 'That is SP 800-145\'s definition of the **hybrid** cloud, with cloud bursting as its example. Do not confuse it with **multicloud**, which describes using more than one cloud provider and is not one of the four NIST deployment models.' },
  { topic: '3.1', type: 'single', difficulty: 2, lesson: L31B,
    stem: 'Contoso\'s German subsidiary is told by its regulator that customer records must remain subject only to EU law, and the legal team is concerned that a provider headquartered elsewhere could be compelled by its home government to hand over data. Which business consideration is the legal team raising?',
    options: ['Data sovereignty', 'Scalability', 'Ownership', 'Environmental requirements'],
    answer: [0],
    explanation: '**Data sovereignty** is the principle that data is subject to the laws of the jurisdiction that governs it, which can include the provider\'s home country as well as the country where the data is stored. Scalability is about growing capacity. Ownership is about who owns the infrastructure, the data and the decisions about them, not which laws apply. Environmental requirements are physical conditions such as climate and disaster exposure.' },
  { topic: '3.1', type: 'match', difficulty: 2, lesson: L31B,
    stem: 'Match each statement from Contoso\'s architecture review with the technical consideration it describes.',
    pairs: [
      ['The appliance firmware is closed; only the vendor can audit or patch it', 'Proprietary vs. open source'],
      ['The new GPU rack draws 28 kW, more than the room\'s circuits and cooling can supply', 'Power requirements'],
      ['Stateless containers rebuilt from images in minutes, compared with a day to rebuild the hand-configured database server', 'Ease of recovery'],
      ['The SaaS contract says the provider secures the platform and Contoso manages user accounts and sharing settings', 'Responsibility'],
      ['The portal must be usable 99.99% of the year', 'Availability'],
    ],
    explanation: 'Vendor-only code that cannot be inspected or fixed by the customer is the **proprietary vs. open source** consideration. Electrical draw and cooling capacity are **power requirements**. How quickly and reliably a component can be rebuilt is **ease of recovery**. Who secures which layer under a contract or shared-responsibility model is **responsibility**. A percentage of time the system must be usable is an **availability** target.' },
  { topic: '3.1', type: 'single', difficulty: 3, lesson: L31B,
    stem: 'Refer to the exhibit. Contoso requires that payroll data stay in the EU, that the service survive the loss of any single data center, and that annual cost not exceed $150,000. Which option meets all three requirements?',
    exhibit: `Option  Design                                        Region / sites          Survives loss of     Annual cost
A       On-premises VM cluster                        Frankfurt DC (1 site)   one host             $90,000
B       SaaS payroll, provider-chosen hosting         US and EU               one data center      $70,000
C       PaaS app in 2 availability zones              EU (Frankfurt) region   one data center      $120,000
D       Private cloud in 2 Contoso data centers       Frankfurt + Dublin      one data center      $310,000`,
    options: ['Option A', 'Option B', 'Option C', 'Option D'],
    answer: [2],
    explanation: '**Option C** keeps data in an EU region, spans two availability zones so it survives a data center loss, and costs $120,000. Option A is in the EU and affordable, but a single site does not survive the loss of the data center. Option B is cheapest but the provider may host data in the US, failing the EU requirement. Option D meets residency and resilience but costs $310,000, over budget.' },

  // ---------- 3.2 ----------
  { topic: '3.2', type: 'match', difficulty: 2, lesson: L32A,
    stem: 'Refer to the exhibit. Match each Contoso system with the zone it should be placed in.',
    exhibit: `                 Internet
                     |
                  [fw01]
     +------------+--+---------+-----------+-------------+
     |            |            |           |             |
  Zone DMZ    Zone USERS   Zone DATA   Zone MGMT    Zone GUEST
  (internet-  (staff       (reachable  (admin       (internet
  reachable   endpoints)   only from   access via   access only)
  services)                app tiers)  jump host)`,
    pairs: [
      ['Reverse proxy publishing www.example.com', 'DMZ'],
      ['Customer database server', 'DATA'],
      ['Management interfaces of fw01 and the core switches', 'MGMT'],
      ['Employee laptops', 'USERS'],
      ['Visitors\' phones on the lobby Wi-Fi', 'GUEST'],
    ],
    explanation: 'Put each system in the least trusted zone that lets it do its job. The internet-facing reverse proxy belongs in the **DMZ** (screened subnet). The database holds customer records and should be reachable only from application tiers, so **DATA**. Device management interfaces go in **MGMT**, reachable through a jump host. Staff endpoints belong in **USERS**. Visitors\' devices are untrusted and need internet access only: **GUEST**.' },
  { topic: '3.2', type: 'single', difficulty: 2, lesson: L32A,
    stem: 'Contoso must block exploit attempts against its DMZ web servers before they reach the servers. The security team has one sensor appliance that can run as an IDS or an IPS. Where and how should it be deployed?',
    options: ['As an IDS connected to a SPAN port on the DMZ switch', 'As an IDS on a network TAP on the internal user segment', 'As an IPS inline on the guest Wi-Fi segment', 'As an IPS inline between fw01 and the DMZ web servers'],
    answer: [3],
    explanation: 'Blocking requires the sensor to be **inline**, and it must be on the path to the web servers: **inline between the firewall and the DMZ servers**. An IDS on a SPAN port sees copies of traffic and can only alert. A TAP on the user segment is passive and on the wrong segment. Inline on the guest Wi-Fi blocks nothing aimed at the DMZ from the internet.' },
  { topic: '3.2', type: 'match', difficulty: 3, lesson: L32A,
    stem: 'Match each Contoso component with the failure behavior it should be configured or specified for.',
    pairs: [
      ['Internet edge firewall of the payment network, if its policy engine crashes', 'Fail closed'],
      ['Inline IPS on the link to the hospital patient-monitoring servers; a firewall behind it enforces policy, and the stated priority is uninterrupted availability', 'Fail open'],
      ['Electromagnetic lock on a stairwell door on the building\'s exit route', 'Fail-safe lock (unlocks when power is lost)'],
      ['Electric strike on the data center door, which has mechanical free egress from inside', 'Fail-secure lock (stays locked when power is lost)'],
    ],
    explanation: 'The edge firewall is the enforcement point, so it should **fail closed**; availability comes from an HA pair, not from passing traffic uninspected. For the IPS, the stem states that availability is the priority and another control (the firewall) still enforces policy, which justifies **fail open** (bypass). An exit-route door must let people out during a power failure, so it uses a **fail-safe** lock: life safety wins. The data center door protects assets and people can still leave mechanically, so it uses a **fail-secure** lock.' },
  { topic: '3.2', type: 'multi', difficulty: 2, lesson: L32A,
    stem: 'Refer to the exhibit. Which two statements about this Zero Trust access decision are correct? (Choose two.)',
    exhibit: `2026-11-20 10:02:11 ztna-gw01  request user=alice@example.com dev=ws01 app=hr.example.com sess=7f3a
2026-11-20 10:02:11 pe01       evaluate sess=7f3a idp:mfa=pass role=HR-SelfService
2026-11-20 10:02:11 pe01       evaluate sess=7f3a cdm:ws01 os_patch=current edr=stopped disk_enc=on
2026-11-20 10:02:11 pe01       decision sess=7f3a result=DENY reason=device_health
2026-11-20 10:02:11 pa01       instruct ztna-gw01 action=reject sess=7f3a
2026-11-20 10:02:11 ztna-gw01  sess=7f3a rejected`,
    options: ['ztna-gw01 acts as the policy enforcement point', 'The request was denied because alice failed multifactor authentication', 'pa01 made the decision to deny access', 'The denial was based on the device\'s health reported by the CDM system', 'ztna-gw01 acts as the policy engine'],
    answer: [0, 3],
    explanation: 'In SP 800-207 terms, **ztna-gw01 is the PEP**: it receives the request and carries out the reject. The decision line gives **reason=device_health**, based on the CDM input that EDR is stopped on ws01. MFA passed (idp:mfa=pass), so authentication was not the reason. **pe01** (the policy engine) made and logged the decision; **pa01** (the policy administrator) only executed it by instructing the PEP. The gateway enforces; it is not the policy engine.' },
  { topic: '3.2', type: 'order', difficulty: 2, lesson: L32A,
    stem: 'Put the steps of a Zero Trust access request (NIST SP 800-207 model) in order, from the subject\'s request to the session being established.',
    items: [
      'The subject requests access to a resource and the request reaches the policy enforcement point',
      'The PEP passes the request to the policy administrator and policy engine (the PDP)',
      'The policy engine evaluates the request with its trust algorithm, using identity, device posture and other data sources',
      'The policy engine logs its decision and the policy administrator configures the PEP, issuing session-specific credentials',
      'The PEP allows the session between the subject and the resource',
    ],
    explanation: 'SP 800-207: the PEP communicates with the PA to forward requests; the PE uses enterprise policy and inputs such as CDM and threat intelligence in a trust algorithm and makes and logs the decision; the PA executes it, generating session-specific credentials and configuring the PEP; only then does the PEP enable the session. Monitoring continues afterwards, and a countermanded decision makes the PA tell the PEP to terminate the connection.' },
  { topic: '3.2', type: 'single', difficulty: 2, lesson: L32A,
    stem: 'Under Contoso\'s Zero Trust policy, bob signs in with valid credentials and MFA from a laptop that does not appear in the enterprise device inventory. What should the policy decision be based on?',
    options: ['Allow full access, because the user passed MFA', 'Allow full access, because the laptop is connected to the corporate Wi-Fi', 'Treat the device as unknown: deny access or grant only the limited access that policy defines for unmanaged devices', 'Add the laptop to the inventory automatically and grant full access'],
    answer: [2],
    explanation: 'Zero Trust evaluates the **device as well as the user**. A device missing from inventory cannot have its posture verified, so policy should **deny it or allow only the limited access defined for unmanaged devices**. Passing MFA proves the user, not the device. Being on the corporate network grants nothing under Zero Trust (no trust from location). Auto-enrolling an unknown device and trusting it defeats the purpose of the inventory.' },
  { topic: '3.2', type: 'fill', difficulty: 2, lesson: L32A,
    stem: 'Refer to the exhibit. Enter the ID of the rule that exposes a device management interface to the internet.',
    exhibit: `fw01 policy (evaluated top-down)
ID  From      To      Source          Destination        Service        Action
10  internet  dmz     any             203.0.113.10       HTTPS          allow
14  internet  dmz     any             203.0.113.11       SMTP           allow
17  users     dmz     10.10.0.0/16    203.0.113.10       HTTPS          allow
21  internet  mgmt    any             10.99.0.5 (sw01)   SSH, HTTPS     allow
25  mgmt      any     10.99.0.0/24    any                SSH, SNMPv3    allow
99  any       any     any             any                any            deny log`,
    answer: ['21', 'rule 21', 'id 21'],
    explanation: '**Rule 21** allows anyone on the internet to reach SSH and HTTPS on sw01\'s management address in the mgmt zone. Management interfaces should be reachable only from admin workstations or a jump host. Rules 10 and 14 publish intended public services in the DMZ. Rule 17 lets staff reach the public web server internally. Rule 25 lets the management zone reach devices, which is its purpose. Rule 99 is the default deny.' },
  { topic: '3.2', type: 'single', difficulty: 2, lesson: L32A,
    stem: 'Contoso places an outer firewall from one vendor and an inner firewall from a different vendor between the internet and its data zone. What is the main security benefit of this choice, and its main cost?',
    options: ['Benefit: a single vulnerability in one vendor\'s firewall OS cannot bypass both layers. Cost: two rule languages, consoles and patch streams to maintain', 'Benefit: the rule base only needs to be written once. Cost: higher latency', 'Benefit: removes the need for an IPS. Cost: licensing', 'Benefit: guarantees the firewalls never fail at the same time. Cost: rack space'],
    answer: [0],
    explanation: '**Vendor diversity** means one flaw or bad update is unlikely to affect both layers; the trade-off is **operational complexity**: different syntax, management tools, skills and patch cycles, and complexity causes misconfiguration. Two vendors means writing rules twice, not once. Diversity does not replace other controls such as IPS. It reduces the chance of a common-mode failure but cannot guarantee both never fail together (a power or cabling fault can hit both).' },
  { topic: '3.2', type: 'single', difficulty: 2, lesson: L32B,
    stem: 'Refer to the exhibit. Which VPN configuration does the policy require for Contoso laptops?',
    exhibit: `Contoso Remote Access Standard RA-2 (excerpt)
4.1 All web traffic from company laptops, including traffic to
    internet sites, must be inspected by the corporate web filter
    in the Frankfurt data center.
4.2 Remote access must use the corporate IPsec (IKEv2) client.`,
    options: ['Split tunnel, with only corporate prefixes sent through the VPN', 'Full tunnel, with all traffic sent through the VPN to the data center', 'No VPN; laptops browse directly and connect to internal apps over HTTPS', 'A GRE tunnel from each laptop to the data center'],
    answer: [1],
    explanation: 'Requirement 4.1 says **internet** traffic must pass the corporate web filter, so all traffic must go through the tunnel: **full tunnel**. Split tunnel sends internet traffic directly out of the user\'s local connection, bypassing the filter. No VPN fails both 4.1 and 4.2. GRE is not the IPsec client the standard requires, and it does not encrypt.' },
  { topic: '3.2', type: 'match', difficulty: 2, lesson: L32B,
    stem: 'Match each Contoso requirement with the technology that best fits it.',
    pairs: [
      ['Encrypt traffic between the FortiGate at HQ and the PA-Series firewall at a branch using a standards-based protocol', 'IPsec tunnel mode with IKEv2'],
      ['Carry OSPF and multicast between two routers across an existing encrypted underlay', 'GRE'],
      ['An admin must reach one internal web console through the bastion host, encrypted, without a VPN client', 'SSH local port forwarding'],
      ['Send nightly payroll files to a bank over a single encrypted port with key-based authentication', 'SFTP'],
      ['Staff chat whose content even the messaging provider cannot read', 'End-to-end encrypted messaging'],
    ],
    explanation: 'Interoperable site-to-site encryption between different vendors\' gateways is **IPsec (ESP) in tunnel mode with IKEv2** (RFC 4301, 4303, 7296). **GRE** (RFC 2784) carries multicast and routing protocols but does not encrypt, which is acceptable here because the underlay is already encrypted. **SSH local port forwarding** (RFC 4254) carries one TCP service through the bastion. **SFTP** runs over SSH on TCP 22 and supports key authentication. Only **end-to-end encryption** keeps message content from the provider, which TLS to the provider\'s server does not.' },
  { topic: '3.2', type: 'single', difficulty: 2, lesson: L32B,
    stem: 'During a routing failure, Contoso\'s network team lost SSH access to every firewall and core switch because management traffic used the production network. Which change ensures they can still reach the devices next time?',
    options: ['Enable Telnet on all devices as a backup protocol', 'Move SSH to a non-standard port on the production network', 'Add a second SSH account for each administrator', 'Connect device console ports to console servers on a separate management network with its own internet or cellular connection'],
    answer: [3],
    explanation: '**Out-of-band management** uses a path independent of production: console servers on device console ports, a dedicated management network and a separate circuit or cellular link. Telnet is cleartext and still uses the failed production network. A different port is still in-band, so it fails the same way. Extra accounts do not help when the network path itself is down.' },
  { topic: '3.2', type: 'single', difficulty: 1, lesson: L32B,
    stem: 'Which set of services is usually described as the core of a Security Service Edge (SSE) offering?',
    options: ['Secure web gateway, cloud access security broker and Zero Trust network access', 'SD-WAN, MPLS and WAN optimization', 'SIEM, SOAR and threat intelligence platform', 'Hypervisor, container runtime and orchestration'],
    answer: [0],
    explanation: 'SSE, the category Gartner introduced in 2021, is a cloud-delivered security stack built around **SWG, CASB and ZTNA**, often with FWaaS and DLP. SD-WAN and other WAN networking are what SASE adds on top of SSE (SASE = SSE + networking). SIEM and SOAR are security operations tools, and hypervisors and orchestrators are compute platforms, not SSE services.' },
  { topic: '3.2', type: 'single', difficulty: 2, lesson: L32B,
    stem: 'Refer to the exhibit. Which change best addresses the account risk while keeping the service running on all three servers?',
    exhibit: `Service:     ContosoOrdersAPI (IIS app pool)
Hosts:       srv01, srv02, srv03  (behind Network Load Balancing)
Log on as:   EXAMPLE\\svc-orders  (domain user account)
Password:    set 2019-03-14, "Password never expires" enabled
Known to:    4 administrators; stored in the team wiki
Groups:      Domain Users, Domain Admins`,
    options: ['Convert svc-orders to a standalone Managed Service Account (sMSA) on srv01', 'Run the app pool as Local System on each server', 'Replace svc-orders with a group Managed Service Account limited to srv01-srv03 and grant it only the rights the API needs', 'Keep the account and rotate its password manually once a year'],
    answer: [2],
    explanation: 'A **gMSA** gives one identity that all instances of a load-balanced service can use, with Windows managing and rotating the password automatically (30 days by default) and only the hosts named in PrincipalsAllowedToRetrieveManagedPassword able to retrieve it; nobody knows or stores it. Removing Domain Admins applies least privilege. An sMSA is tied to a single computer, so srv02 and srv03 could not use it. Local System gives each server a different machine identity, not the single principal the farm needs, and is highly privileged locally. Manual annual rotation leaves a human-known, wiki-stored password and the Domain Admins membership in place.' },
  { topic: '3.2', type: 'order', difficulty: 2, lesson: L32B,
    stem: 'Put the steps for moving ContosoOrdersAPI to a group Managed Service Account in order, following Microsoft\'s documented process.',
    items: [
      'Create the KDS root key for the forest, if one does not already exist',
      'Create the gMSA with New-ADServiceAccount, naming the server group in PrincipalsAllowedToRetrieveManagedPassword',
      'On each of srv01, srv02 and srv03, install the gMSA with Install-ADServiceAccount and confirm with Test-ADServiceAccount that the host can use it',
      'Configure the app pool to run as the gMSA and restart it',
    ],
    explanation: 'Microsoft Learn: the KDS root key must exist before any gMSA can be created (it is stored in the forest\'s configuration partition, and domain controllers may wait up to 10 hours for it to replicate before allowing gMSA creation). `New-ADServiceAccount` creates the account and limits who may retrieve its password. Each host then installs and tests the account, and only then is the service switched to it, so a failed test does not take the service down. (Install and test are one step here because Test-ADServiceAccount only checks that the host can use the account, which can be run before or after installing it.)' },
  { topic: '3.2', type: 'fill', difficulty: 1, lesson: L32B,
    stem: 'Refer to the exhibit. Enter the two-word term for the condition this access review reveals.',
    exhibit: `Quarterly access review - user: bob (current role: Finance Analyst, since 2026-02)
Group / entitlement            Granted     Reason recorded
FIN-Reporting-Read             2026-02-03  Finance Analyst role
HelpDesk-PasswordReset         2023-06-12  Help desk technician role (2023-2024)
DEV-Prod-Deploy                2024-09-01  Developer role (2024-2026)
VPN-Contractor-Temp            2025-01-15  "Temporary, remove after project"`,
    answer: ['privilege creep', 'permission creep', 'access creep'],
    explanation: 'bob has kept rights from two previous roles and a "temporary" grant that was never removed: **privilege creep**, the gradual accumulation of access beyond the current role. The fix is to remove the three entitlements not tied to his Finance Analyst role, and to make role changes (the mover process) remove old access when new access is granted.' },
  { topic: '3.2', type: 'multi', difficulty: 1, lesson: L32B,
    stem: 'Which two practices implement least privilege access accounts for Contoso\'s system administrators? (Choose two.)',
    options: ['The team shares one Domain Admins account so activity is easier to track', 'Administrators\' daily accounts are made Domain Admins but protected with MFA', 'Each administrator uses a standard account for email and browsing', 'Privileged accounts are excluded from logging to protect their credentials', 'Each administrator uses a separate privileged account only for administrative tasks'],
    answer: [2, 4],
    explanation: 'Least privilege access accounts separate everyday work from administration: a **standard account** for routine tasks and a **separate privileged account** used only when admin rights are needed, so phishing or a malicious website reaches only the unprivileged account. A shared account destroys individual accountability. MFA on an always-privileged daily account still exposes admin rights to every email and web page. Privileged activity should be logged more, not less.' },

  // ---------- 3.3 ----------
  { topic: '3.3', type: 'match', difficulty: 2, lesson: L33A,
    stem: 'Match each Contoso data-protection scenario with the method it uses.',
    pairs: [
      ['Call-center screens show card numbers as ****-****-****-4821', 'Masking'],
      ['Card numbers are replaced with random values; only a separate vault can map them back', 'Tokenization'],
      ['User passwords are stored so they can be verified but never recovered', 'Hashing'],
      ['Laptop drives are unreadable without a key held in the TPM', 'Encryption'],
      ['A DLP rule strips the salary column from reports leaving the HR system', 'Filtering'],
      ['Names and employee IDs are removed from a survey data set so responses no longer link to individuals', 'Deidentification'],
    ],
    explanation: 'Showing only part of a value is **masking**. A random substitute reversible only through a vault is **tokenization**. One-way storage that can be checked but not reversed is **hashing** (salted and slow for passwords). A key-dependent reversible transformation is **encryption**. Removing a data element from what leaves a system is **filtering**. Removing the association between the data and the people it describes is **deidentification**.' },
  { topic: '3.3', type: 'single', difficulty: 2, lesson: L33A,
    stem: 'An attacker steals a copy of Contoso\'s order database, in which card numbers were replaced by randomly generated tokens issued by the payment provider\'s token vault. The vault is not in the stolen copy. Which statement is correct?',
    options: ['The attacker can recover the card numbers by brute-forcing the token algorithm\'s key', 'The tokens have no mathematical relationship to the card numbers; without access to the vault they cannot be turned back into card numbers', 'The tokens are hashes of the card numbers, so the attacker can compute them for every possible card number', 'The tokens are masked card numbers, so the first twelve digits are visible'],
    answer: [1],
    explanation: 'With random (vault-based) tokens, the **mapping lives only in the vault**; (the PCI SSC tokenization guidelines also allow cryptographic token generation, which is why the stem states the tokens are random) a stolen token is useless without it. There is no key to brute-force in the stolen data, which is the difference from encryption. Tokens are not hashes (a hash of a card number could be computed for every candidate number, which is why unsalted hashing of small input spaces is weak). Masking hides part of a real value; a token contains no part of it unless a format-preserving scheme deliberately keeps the last digits.' },
  { topic: '3.3', type: 'single', difficulty: 2, lesson: L33A,
    stem: 'Contoso replaces customer names in its analytics data with random customer IDs. The table linking IDs to names is kept by the privacy team on a separate, access-controlled server. Under the GDPR, how is the analytics data set classified?',
    options: ['Anonymous data, outside the GDPR\'s scope', 'Encrypted data, exempt from breach notification', 'Pseudonymized data, which is still personal data', 'Public data, because names were removed'],
    answer: [2],
    explanation: 'This matches the GDPR definition of **pseudonymisation** (Article 4(5)): data that can no longer be attributed to a person without additional information kept separately and protected. Recital 26 says such data, which can be attributed with that information, is still **personal data**. It is not anonymous, because the linking table exists. It is not encryption: no cipher or key was applied. Removing names does not make data public; classification is a separate decision.' },
  { topic: '3.3', type: 'single', difficulty: 2, lesson: L33A,
    stem: 'Which example best illustrates the data transpose method of securing data?',
    options: ['Rearranging the characters of each value according to a secret permutation, so the original order is needed to read it', 'Replacing a card number with a random value stored in a vault', 'Replacing the first twelve digits of a card number with asterisks', 'Computing a SHA-256 digest of each value'],
    answer: [0],
    explanation: 'Transposition protects data by **changing the order or position of its elements** rather than substituting them, as in a transposition cipher or swapping values between records; anyone who knows the pattern can reverse it, so on its own it is weak. A random vault-backed substitute is tokenization. Asterisks over part of a value are masking. A digest is hashing.' },
  { topic: '3.3', type: 'single', difficulty: 1, lesson: L33A,
    stem: 'Refer to the exhibit. A shared folder contains patients\' laboratory results. Which classification applies under Contoso\'s standard?',
    exhibit: `Contoso Data Classification Standard DCS-2 (excerpt)
Public        Approved for release; no harm if disclosed.
Sensitive     Internal use; limited harm if disclosed (procedures, org charts).
Confidential  Serious harm if disclosed; need-to-know (customer PII, contracts).
Restricted    Severe harm or regulatory penalties if disclosed; named
              individuals only (cardholder data, health records, M&A plans).
Critical      Applied in addition to the above when loss of availability or
              integrity would halt operations.`,
    options: ['Sensitive', 'Confidential', 'Critical', 'Restricted'],
    answer: [3],
    explanation: 'Laboratory results are health records, which DCS-2 lists under **Restricted** (severe harm or regulatory penalties). Confidential covers customer PII in general, but the standard places health records explicitly in the higher level. Sensitive is for internal documents with limited harm. Critical is an availability and integrity label applied in addition to a secrecy level, not instead of one, and the stem gives no operational dependency.' },
  { topic: '3.3', type: 'single', difficulty: 2, lesson: L33A,
    stem: 'Contoso wants to protect customer records while an analytics application is processing them, including from an administrator of the cloud host. Which control addresses this data state?',
    options: ['TLS 1.3 between the application and its users', 'Running the application in a hardware trusted execution environment (confidential computing) that keeps its memory encrypted and isolated from the host', 'Full-disk encryption of the server\'s volumes', 'Tokenizing the records in the nightly backup'],
    answer: [1],
    explanation: 'Data being processed is **data in use**; **confidential computing** with a hardware TEE (secure enclave) protects it in memory, even from the host OS and hypervisor. TLS protects data in transit. Full-disk encryption protects data at rest; once the volume is mounted, a host administrator can read the data. Tokenizing backups protects stored copies, not the live processing.' },
  { topic: '3.3', type: 'match', difficulty: 2, lesson: L33B,
    stem: 'Match each person or organization with its data protection role.',
    pairs: [
      ['Contoso\'s VP of Sales, who decides the CRM data\'s classification and approves who may access it', 'Data owner'],
      ['The database administrator who configures encryption, access controls and backups for the CRM', 'Data custodian'],
      ['The data governance analyst who maintains field definitions and quality rules and checks that handling follows policy', 'Data steward'],
      ['Contoso as the company that decides why and how its customers\' personal data is processed', 'Data controller'],
      ['The email-delivery service that Contoso\'s payroll provider uses, with Contoso\'s authorization, to send payslips', 'Data subprocessor'],
    ],
    explanation: 'The **owner** is accountable and decides classification and access. The **custodian** implements the technical protections. The **steward** governs meaning, quality and policy compliance. Under the GDPR, the **controller** determines the purposes and means of processing. The payroll provider is Contoso\'s processor; a service it engages for part of the processing is "another processor" under Article 28(2) and (4), commonly called a **subprocessor**.' },
  { topic: '3.3', type: 'order', difficulty: 1, lesson: L33B,
    stem: 'Put these events in the life of a Contoso customer contract in data-management life-cycle order.',
    items: [
      'The contract is drafted and labeled Confidential, with Legal as owner',
      'It is stored in the document system with access controls and nightly backups',
      'A signed copy is sent to the customer through the encrypted sharing portal',
      'It is kept for seven years after expiry under the retention schedule',
      'The file and its backups are purged and a certificate of sanitization is recorded',
    ],
    explanation: 'The stages are **creation** (classify and label at creation), **management** (storage, access control, backup), **distribution** (controlled sharing), **retention** (kept for the required period) and **disposal** (sanitized per SP 800-88 and documented).' },
  { topic: '3.3', type: 'single', difficulty: 2, lesson: L33B,
    stem: 'Contoso\'s HR application must be usable only by employees located in the countries where Contoso operates. Which data handling control addresses this requirement most directly?',
    options: ['Marking and labeling', 'Data placement', 'Endpoint encryption', 'Geofencing'],
    answer: [3],
    explanation: '**Geofencing** applies policy based on the user\'s or device\'s location, for example conditional access that allows the HR app only from approved countries. Labels tell systems how to handle data but not where users may be. Data placement decides where data is stored, not where users connect from. Endpoint encryption protects data on a lost device regardless of location.' },
  { topic: '3.3', type: 'match', difficulty: 2, lesson: L33B,
    stem: 'Match each Contoso data set with the compliance category that most specifically describes it.',
    pairs: [
      ['Patients\' laboratory results in the clinic portal', 'Health data'],
      ['Full primary account numbers captured by the web shop', 'Financial'],
      ['Unreleased chip design files', 'Intellectual property'],
      ['Profiles of 11-year-old players on Contoso\'s game site', 'Child/minor data'],
      ['Email threads placed under a litigation hold', 'Legal data'],
    ],
    explanation: 'Lab results are **health data** (HIPAA PHI in the U.S., GDPR data concerning health). PANs are cardholder data governed by PCI DSS: **financial**. Unreleased designs are **intellectual property**. Personal data of an 11-year-old falls under COPPA (children under 13) and GDPR Article 8: **child/minor data**. Records under a litigation hold are **legal data** that must be preserved. Several of these are also personal information, but each has a more specific category.' },
  { topic: '3.3', type: 'single', difficulty: 2, lesson: L33B,
    stem: 'Refer to the exhibit. Which sanitization action is appropriate before the drives leave Contoso?',
    exhibit: `Asset disposal ticket DSP-0931
Assets:          12 x NVMe SSD (removed from srv01-srv03)
Data:            Restricted (cardholder data)
Destination:     Resale through an IT asset broker (drives must remain usable)
Requested by:    alice`,
    options: ['A single-pass overwrite with zeros using the operating system\'s standard write commands', 'Degaussing each drive', 'A purge technique such as the drive\'s sanitize command or cryptographic erase, verified and documented with a certificate of sanitization', 'Deleting the partitions and reformatting the drives'],
    answer: [2],
    explanation: 'SP 800-88 Rev. 2: for flash media with overprovisioning, standard overwriting gives little confidentiality protection; use **purge** (dedicated sanitize commands, including **cryptographic erase**) or destroy. Because the drives must stay usable for resale, purge is the choice, and the result is documented. A standard overwrite cannot reach spare cells on an SSD. Degaussing does not work on SSDs (non-magnetic) and the guide says it should not be used for them. Reformatting leaves the data recoverable.' },
  { topic: '3.3', type: 'multi', difficulty: 2, lesson: L33B,
    stem: 'Contoso wants its email gateway and endpoint DLP agents to apply the correct handling to documents automatically. Which two measures support this? (Choose two.)',
    options: ['Store all documents in a single share with the same permissions', 'Apply classification labels as document metadata when documents are created', 'Rely on users to remember each document\'s classification', 'Remove headers and footers that show classification, to reduce clutter', 'Train DLP policies to act on those labels (for example, block external email of Restricted files)'],
    answer: [1, 4],
    explanation: '**Labeling** puts the classification into the data as metadata that systems can read, and **DLP policies that act on labels** turn the label into enforcement. One share with uniform permissions ignores classification. Users\' memory cannot be read by a gateway. Visible markings help people handle documents correctly; removing them weakens handling rather than enabling automation.' },
  { topic: '3.3', type: 'single', difficulty: 1, lesson: L33A,
    stem: 'Which Contoso data is unstructured and therefore hardest to discover and classify automatically by schema?',
    options: ['The orders table in the ERP database', 'A CSV export with defined column headers', 'Firewall logs parsed into named fields in the SIEM', 'Scanned PDF contracts and chat messages in a collaboration tool'],
    answer: [3],
    explanation: '**Scanned documents and chat messages** have no predefined data model; finding sensitive content in them requires content inspection (pattern matching, OCR, fingerprinting). The ERP table, a CSV with headers and parsed log fields all follow a schema, so a field such as `card_number` identifies sensitive data directly.' },

  // ---------- 3.4 ----------
  { topic: '3.4', type: 'fill', difficulty: 2, lesson: L34B,
    stem: 'Refer to the exhibit. srv01 failed at 17:45 and is restored from the most recent successful backup. How many hours of data were lost? Enter the number of hours as a decimal.',
    exhibit: `Backup job log - srv01 (2026-11-19)
00:00  job 4411  full        status=success
06:00  job 4412  incremental status=success
12:00  job 4413  incremental status=success
17:45  srv01 storage controller failure (host down)
18:00  job 4414  incremental status=failed (host unreachable)`,
    answer: ['5.75', '5.75 hours', '5.75 h', '5.75h', '5.75 hrs', '5.75 hr'],
    explanation: 'The most recent successful backup is the 12:00 incremental. Everything written from 12:00 to the failure at 17:45 is lost: **5 hours 45 minutes = 5.75 hours**. The 18:00 job ran after the failure and failed, so it adds nothing. With backups every 6 hours the worst-case loss is just under 6 hours, so this schedule cannot meet an RPO shorter than 6 hours.' },
  { topic: '3.4', type: 'fill', difficulty: 2, lesson: L34B,
    stem: 'Refer to the exhibit. Using availability = MTBF / (MTBF + MTTR), enter the availability of one fw01 cluster member as a percentage rounded to two decimal places.',
    exhibit: `Reliability record - fw01 cluster members (2026)
Member     Operating hours   Failures   Total repair hours
fw01-a     8,760             3          15
fw01-b     8,760             3          15
Totals     17,520            6          30`,
    answer: ['99.83', '99.83%', '99.83 %', '99.83 percent'],
    explanation: 'MTBF = operating hours / failures = 17,520 / 6 = **2,920 hours**. MTTR = repair hours / repairs = 30 / 6 = **5 hours**. Availability = 2,920 / (2,920 + 5) = 2,920 / 2,925 = 0.99829, which rounds to **99.83%**. Running the two members as an HA cluster makes the service far more available than a single member, because both must be down at the same time for an outage.' },
  { topic: '3.4', type: 'fill', difficulty: 1, lesson: L34B,
    stem: 'Refer to the exhibit. Enter the MTTR for the core switches, in hours.',
    exhibit: `Incident log - core switches sw01/sw02, 2026
INC-201  2026-02-11  sw01 PSU fault        down 02:10  restored 04:10
INC-245  2026-05-03  sw02 line card fault  down 13:00  restored 17:00
INC-310  2026-09-27  sw01 supervisor fault down 21:30  restored 03:30 (next day)`,
    answer: ['4', '4 hours', '4 h', '4.0', '4h', '4 hrs', '4 hr', '4.0 hours'],
    explanation: 'Repair times: INC-201 2 hours, INC-245 4 hours, INC-310 6 hours (21:30 to 03:30 crosses midnight). MTTR = total repair time / number of repairs = (2 + 4 + 6) / 3 = **4 hours**. MTBF would need operating time between failures, which the log does not give.' },
  { topic: '3.4', type: 'single', difficulty: 2, lesson: L34B,
    stem: 'Refer to the exhibit. srv02 fails on Thursday at 10:00. What is the minimum set of backups needed to restore it to the latest possible point?',
    exhibit: `srv02 backup schedule (all jobs at 01:00)
Sun  full
Mon  differential
Tue  differential
Wed  differential
Thu  differential
Fri  differential
Sat  differential`,
    options: ['Sunday full only', 'Sunday full and Thursday differential', 'Sunday full and the Monday, Tuesday, Wednesday and Thursday differentials, in order', 'Thursday differential only'],
    answer: [1],
    explanation: 'A **differential** contains every change since the last full backup, so the restore needs **Sunday\'s full plus only the latest differential (Thursday 01:00)**. Sunday alone loses Monday to Thursday morning. Applying every differential is unnecessary, because Thursday\'s already includes Monday\'s to Wednesday\'s changes (that chain is what incremental backups need). A differential without its full backup is incomplete. Changes between 01:00 and 10:00 Thursday are lost either way.' },
  { topic: '3.4', type: 'order', difficulty: 2, lesson: L34B,
    stem: 'srv03 is backed up with a full backup on Sunday and incremental backups Monday to Saturday, all jobs running at 01:00. It fails on Wednesday afternoon. Put the restore steps in order.',
    items: [
      'Restore Sunday\'s full backup to the replacement server',
      'Apply Monday\'s incremental backup',
      'Apply Tuesday\'s incremental backup',
      'Apply Wednesday\'s incremental backup',
      'Verify the restored data and services before returning srv03 to production',
    ],
    explanation: 'An **incremental** contains only the changes since the previous backup of any type, so the chain is the full backup and then **every incremental in sequence**; skipping or reordering one breaks the chain. Verification comes last, before users are switched back.' },
  { topic: '3.4', type: 'single', difficulty: 2, lesson: L34A,
    stem: 'Refer to the exhibit. Which alternate site type is the lowest-cost choice that meets the RTO for the archive system?',
    exhibit: `Business impact analysis - excerpt
System           MTD        RTO        Notes
Order portal     4 hours    2 hours    revenue-critical
Payroll          5 days     3 days     runs weekly
Document archive 6 weeks    4 weeks    read-only historical records`,
    options: ['Cold site', 'Warm site', 'Hot site', 'Mirrored site'],
    answer: [0],
    explanation: 'SP 800-34 describes the **cold site** as the least expensive option, with space, power and environmental controls but no equipment; recovery can take days to weeks while equipment is acquired and installed. A 4-week RTO allows that. A warm site (equipment but no current data, recovery in hours to days) also meets it but costs more; a hot site and a mirrored site cost the most and are justified only for short RTOs like the order portal\'s.' },
  { topic: '3.4', type: 'match', difficulty: 2, lesson: L34B,
    stem: 'Match each Contoso test activity with its type.',
    pairs: [
      ['The DR team works through a staged ransomware outage in an isolated test environment, carrying out their recovery roles; production is untouched', 'Simulation'],
      ['The DR site processes a copy of today\'s transactions while the primary keeps running, and the outputs are compared', 'Parallel processing'],
      ['Production traffic is moved to the DR site during a maintenance window and later moved back', 'Failover'],
      ['Last night\'s backup of srv01 is restored to an isolated host and its database is mounted and checked', 'Restoration testing'],
    ],
    explanation: 'A **simulation** stages a realistic scenario and has teams perform their roles without switching production. **Parallel processing** runs the alternate system alongside the primary on real or copied workloads, then compares results. A **failover** test actually moves production and is the most disruptive. **Restoration testing** proves a backup can be restored and used.' },
  { topic: '3.4', type: 'single', difficulty: 1, lesson: L34A,
    stem: 'Refer to the exhibit. Which component kept the equipment running between 14:02:03 and 14:02:15?',
    exhibit: `Facility power log - Contoso DC1
14:02:03  Utility feed lost
14:02:03  UPS-A, UPS-B on battery (load 41%)
14:02:05  Generator GEN-1 start signal
14:02:13  GEN-1 voltage/frequency stable
14:02:15  ATS transferred load to GEN-1
14:02:15  UPS-A, UPS-B on line (charging)`,
    options: ['The surge protectors', 'The redundant power supplies in each server', 'The uninterruptible power supplies', 'The generator'],
    answer: [2],
    explanation: 'The UPS units went **on battery** at the moment the utility feed was lost and carried the load for the 12 seconds until the automatic transfer switch moved it to the generator. That bridging role is exactly what a **UPS** is for. The generator was not stable until 14:02:13 and took the load only at 14:02:15. Surge protectors only clamp spikes and supply no power. Redundant power supplies protect against a failed supply or circuit, but both still need a power source.' },
  { topic: '3.4', type: 'multi', difficulty: 2, lesson: L34B,
    stem: 'Ransomware operators used a stolen administrator account to delete Contoso\'s backups on a network share before encrypting servers. Which two changes most directly prevent this from destroying all restore points next time? (Choose two.)',
    options: ['Keep a copy of backups in immutable storage (object lock or WORM) with a retention period administrators cannot shorten', 'Convert the backup share to RAID 1', 'Take hourly snapshots on the same file server', 'Keep at least one backup copy offline or offsite, outside the reach of domain credentials', 'Replicate the backup share synchronously to a second array on the same domain'],
    answer: [0, 3],
    explanation: '**Immutable** backups cannot be deleted or changed until retention expires, even with admin credentials, and an **offline or offsite copy** (the "1" in 3-2-1) is out of reach of the compromised domain. RAID 1 protects against disk failure, not deletion. Snapshots on the same server can be deleted by the same administrator. Synchronous replication copies the deletion to the second array immediately.' },
  { topic: '3.4', type: 'order', difficulty: 3, lesson: L34B,
    stem: 'Refer to the exhibit. Put the steps of Contoso\'s failover to the warm site in the order the DR plan requires.',
    exhibit: `Contoso DR Plan DRP-3, section 5 (excerpt)
5.1 Only the incident commander may declare a disaster.
5.2 Systems at the warm site are restored from the latest verified
    immutable backup.
5.3 No user traffic is redirected until restored systems pass
    integrity and functional checks.
5.4 Fail back only after the primary site is repaired and resynchronized.`,
    items: [
      'The incident commander declares a disaster and activates the DR plan',
      'Restore systems at the warm site from the latest verified immutable backup',
      'Run integrity and functional checks on the restored systems',
      'Redirect users to the warm site (DNS and VPN changes)',
      'Repair and resynchronize the primary site, then fail back',
    ],
    explanation: 'Section 5.1 makes the declaration the trigger. A warm site has equipment but not current data, so systems are restored first (5.2). Section 5.3 forbids redirecting users before checks pass. Fail-back comes last and only after the primary is repaired and resynchronized (5.4).' },
  { topic: '3.4', type: 'match', difficulty: 2, lesson: L34A,
    stem: 'Match each Contoso requirement with the redundancy solution that meets it.',
    pairs: [
      ['Spread web requests across six identical servers and stop sending to any that fails a health check', 'Load balancing'],
      ['Two database nodes share a quorum; the standby takes over the database service if the active node fails', 'Clustering'],
      ['Add web instances automatically during the Black Friday peak and remove them afterwards', 'Autoscaling'],
      ['Each core switch keeps running if one of its power supplies or circuits fails', 'Redundant power supplies on A and B feeds'],
      ['The service must keep running even if one cloud provider has a platform-wide outage', 'Multicloud systems'],
    ],
    explanation: '**Load balancing** distributes requests and removes unhealthy members. **Clustering** makes nodes act as one system with failover (here active-passive with quorum). **Autoscaling** changes the number of instances with demand. **Redundant power supplies** fed from separate circuits survive one supply or circuit failing. Only **multicloud** removes dependence on a single provider.' },
  { topic: '3.4', type: 'single', difficulty: 2, lesson: L34B,
    stem: 'The business impact analysis states that the order database may lose no more than 15 minutes of transactions and must be back online within 2 hours. Which pair of metrics does this define?',
    options: ['RPO of 15 minutes and RTO of 2 hours', 'RTO of 15 minutes and RPO of 2 hours', 'MTTR of 15 minutes and MTBF of 2 hours', 'MTBF of 15 minutes and MTTR of 2 hours'],
    answer: [0],
    explanation: 'Maximum tolerable **data loss** is the **RPO** (15 minutes); maximum tolerable **downtime** of the system before unacceptable impact is the **RTO** (2 hours). Swapping them reverses the definitions. MTTR and MTBF are measurements of actual repair time and time between failures, not business targets.' },
  { topic: '3.4', type: 'single', difficulty: 2, lesson: L34A,
    stem: 'Contoso keeps its DR site 3 km from headquarters, on the same river flood plain and the same utility substation. Which site consideration does this design neglect?',
    options: ['Capacity planning for the DR site\'s servers', 'Environmental: geographic separation from shared regional hazards', 'Platform diversity of the virtualization layer', 'Backup retention'],
    answer: [1],
    explanation: 'A site that shares the primary\'s flood plain and power substation can be lost in the **same disaster**; environmental site considerations call for enough geographic separation to avoid shared hazards. Capacity planning concerns whether the DR site can carry the load. Platform diversity is about avoiding common-mode technical failures. Retention concerns how long backups are kept. None of these addresses a flood taking out both sites.' },
  { topic: '3.4', type: 'single', difficulty: 2, lesson: L34A,
    stem: 'During a DR test, Contoso\'s DR site failed under real load because it had been sized for half of production, and only one engineer knew the restore procedure. Which discipline addresses both problems?',
    options: ['Capacity planning for technology and people', 'Data classification', 'Change management of firewall rules', 'Platform diversity'],
    answer: [0],
    explanation: '**Capacity planning** ensures enough resources for normal and crisis demand, covering technology and infrastructure (a DR site that can carry full production load) and people (cross-trained staff rather than a single expert). Data classification determines handling requirements. Firewall change management controls rule changes. Platform diversity reduces common-mode failures but does not size the site or train staff.' },

  // ---------- added in review (rule 7 performance-based share) ----------
  { topic: '3.4', type: 'fill', difficulty: 2, lesson: L34B,
    stem: 'Refer to the exhibit. Following NIST SP 800-34 Rev. 1, the time needed to reprocess data after a restore must fit inside the MTD together with the system\'s recovery time. Enter the maximum RTO for the billing system, in hours.',
    exhibit: `Business impact analysis - Contoso (excerpt)
System      MTD        Reprocessing after restore   Notes
Billing     12 hours   3 hours                      month-end critical
Intranet    72 hours   0 hours                      static content
Ticketing   24 hours   4 hours                      customer-facing`,
    answer: ['9', '9 hours', '9 h', '9h', '9 hrs', '9 hr', '9.0', '9.0 hours'],
    explanation: 'SP 800-34 Rev. 1 says the RTO must normally be shorter than the MTD because reprocessing time has to be added to the RTO to stay within the MTD. For billing: 12 hours (MTD) - 3 hours (reprocessing) = **9 hours**. Using the full 12 hours ignores reprocessing and would overrun the MTD. The intranet (72 hours) and ticketing (24 - 4 = 20 hours) rows are for other systems.' },
  { topic: '3.2', type: 'match', difficulty: 2, lesson: L32B,
    stem: 'Contoso is buying a Security Service Edge (SSE) service. Match each requirement with the SSE component that meets it.',
    pairs: [
      ['Filter URLs and scan downloads for malware on remote staff\'s web browsing, wherever they connect from', 'Secure web gateway (SWG)'],
      ['Connect to the sanctioned SaaS tenant through the provider\'s API and find files that are shared publicly', 'Cloud access security broker (CASB)'],
      ['Give a contractor access to one internal web application without placing the contractor\'s device on the network', 'Zero Trust network access (ZTNA)'],
      ['Enforce port- and protocol-based firewall policy on a branch office\'s traffic from the cloud, with no firewall appliance on site', 'Firewall as a service (FWaaS)'],
    ],
    explanation: 'Vendor descriptions of SSE (Zscaler, Fortinet, Palo Alto Networks) agree on its components. A **SWG** filters and inspects web traffic (URL filtering, malware scanning). A **CASB** gives visibility and control over SaaS use, including API connections to sanctioned SaaS tenants to find risky sharing and data. **ZTNA** grants per-application access to private apps instead of network-level access. **FWaaS** delivers firewall policy from the cloud instead of an on-site appliance.' },
];

export default bank.map((item, i) => ({ id: `d3-${String(i + 1).padStart(3, '0')}`, ...item }));
