// Domain 2 — Threats, Vulnerabilities, and Attacks. Original flashcards (sources as in lessons.js).
let n = 0;
const c = (topic, front, back) => ({ id: `d2-f${String(++n).padStart(3, '0')}`, topic, front, back });

export default [
  // 2.1
  c('2.1', 'Threat vs vulnerability vs risk?', 'Threat: what could cause harm. Vulnerability: the weakness it exploits. Risk: likelihood that a threat exploits a vulnerability combined with the impact.'),
  c('2.1', 'Likelihood for an adversarial threat (NIST SP 800-30)?', 'Based on the adversary\'s **intent, capability and targeting**; overall likelihood combines likelihood of initiation and likelihood of adverse impact.'),
  c('2.1', 'Indicator (NIST SP 800-150)?', 'A technical artifact or observable suggesting an attack is imminent, underway or has happened: IP, domain, URL, file hash, email subject.'),
  c('2.1', 'STIX vs TAXII?', 'STIX: format for describing threat information. TAXII: protocol for exchanging it (CISA AIS uses TAXII 2.1).'),
  c('2.1', 'TLP 2.0 labels?', '`TLP:RED` named recipients; `TLP:AMBER` org + clients need-to-know (`AMBER+STRICT` org only); `TLP:GREEN` community; `TLP:CLEAR` unlimited (replaced WHITE).'),
  c('2.1', 'Threat intelligence life cycle?', 'Planning/direction (requirements), collection, processing, analysis, dissemination, feedback.'),
  c('2.1', 'CVE vs CWE vs CVSS?', 'CVE = which vulnerability (ID). CWE = what kind of weakness. CVSS = how severe (0.0-10.0).'),
  c('2.1', 'CVE ID format and who assigns it?', '`CVE-YYYY-NNNN` with a 4-19 digit sequence number; assigned by CVE Numbering Authorities (CNAs). Record states: Reserved, Published, Rejected.'),
  c('2.1', 'CVSS severity bands?', 'None 0.0, Low 0.1-3.9, Medium 4.0-6.9, High 7.0-8.9, Critical 9.0-10.0 (v3.1 and v4.0).'),
  c('2.1', 'CVSS v4.0 metric groups?', 'Base, Threat (was Temporal), Environmental, Supplemental. Supplemental never changes the score. Labels: CVSS-B, -BT, -BE, -BTE.'),
  c('2.1', 'What did CVSS v4.0 replace Scope with?', 'Separate impacts on the **vulnerable system** (VC/VI/VA) and **subsequent systems** (SC/SI/SA). It also added Attack Requirements (AT).'),
  c('2.1', 'Does CVSS measure risk?', 'No. FIRST: CVSS measures **severity**; Base scores should not be used alone to assess risk.'),
  c('2.1', 'KEV and EPSS?', 'KEV: CISA list of CVEs with reliable evidence of exploitation and a remediation action. EPSS: FIRST\'s daily probability (0-1) of exploitation in the next 30 days.'),
  // 2.2
  c('2.2', 'The eight threat actors?', 'Organized crime, terrorist, unskilled attacker, hacktivist, insider, accidental/unintentional, competitor, state-sponsored.'),
  c('2.2', 'Three actor attributes?', 'Internal/external; resources/funding; level of sophistication/capability.'),
  c('2.2', 'Insider vs accidental actor?', 'Both internal. Insider deliberately misuses legitimate access; accidental/unintentional causes harm by mistake, with no intent.'),
  c('2.2', 'Extortion vs financial?', 'Extortion is the specific mechanism: pay or we harm you (encrypt, leak, DDoS). Financial is the broader goal of money.'),
  // 2.3
  c('2.3', 'APT?', 'Advanced persistent threat: a sophisticated, well-resourced adversary (usually state-sponsored) that keeps long-term stealthy access and returns if evicted.'),
  c('2.3', 'Message-based vectors?', 'Email, SMS, RCS, instant messaging, collaboration tools. Name the vector by the channel.'),
  c('2.3', 'Fake CAPTCHA ("ClickFix")?', 'A page that tells the user to "verify" by pasting a command into the Run dialog or terminal. ATT&CK: User Execution: Malicious Copy and Paste.'),
  c('2.3', 'Living-off-the-land tools?', 'Built-in, often signed OS utilities (PowerShell, WMI, `certutil`, `rundll32`, `mshta`) used instead of dropping new malware.'),
  c('2.3', 'Supply chain sources in the objectives?', 'Third-party providers, managed service providers, logistic providers, SaaS providers.'),
  c('2.3', 'Default ports: RDP, VNC, IPsec VPN?', 'RDP TCP/UDP 3389; VNC (RFB) TCP 5900; IPsec IKE UDP 500 and NAT-T UDP 4500; TLS VPNs usually TCP 443.'),
  c('2.3', 'Access vestibule?', 'Two interlocked doors; the second opens only when the first is closed. Defeats tailgating when it admits one person at a time.'),
  c('2.3', 'Bluejacking vs bluesnarfing (NIST SP 800-121)?', 'Bluejacking: unsolicited messages to Bluetooth devices. Bluesnarfing: exploiting firmware flaws to force a connection and read stored data.'),
  // 2.4
  c('2.4', 'Unsupported vs unpatched vs zero-day?', 'Unsupported: no patch will ever come. Unpatched: patch exists, not applied. Zero-day: exploited while no patch exists.'),
  c('2.4', 'TOC/TOU (CWE-367)?', 'A resource is checked, then changes before it is used, invalidating the check (e.g. file swapped for a symlink). Fix: atomic check-and-use.'),
  c('2.4', 'Unsafe exception handling?', 'Errors that leak details (CWE-209) or make code fall back to a less secure state, failing open (CWE-636). OWASP A10:2025.'),
  c('2.4', 'Rogue device vs shadow IT?', 'Rogue device: unauthorized node on the network (NIST). Shadow IT: hardware, software or services used without IT approval, usually to get work done.'),
  c('2.4', 'Why is an identity provider high-value attack surface?', 'Every federated app trusts it. A stolen token-signing key or an attacker-added federation trust lets an attacker sign in as anyone.'),
  c('2.4', 'Public object storage risk?', 'Buckets or containers readable (or writable) by anyone through a policy like `"Principal": "*"`. A customer misconfiguration.'),
  // 2.5
  c('2.5', 'Virus vs worm vs Trojan?', 'Virus infects host files and needs them run. Worm self-propagates across networks. Trojan disguises a hidden malicious function; it does not replicate.'),
  c('2.5', 'Logic bomb vs time bomb?', 'A logic bomb runs when a condition is met (NIST). A time bomb is a logic bomb whose condition is a date or time.'),
  c('2.5', 'Rootkit levels?', 'User mode, kernel mode, bootkit (boot sector/MBR/VBR), hypervisor, firmware. The lower, the harder for the OS to detect.'),
  c('2.5', 'Fileless malware?', 'Runs in memory and through built-in tools (PowerShell, WMI, reflective loading), persisting in registry, WMI or scheduled tasks rather than files.'),
  c('2.5', 'Smishing, vishing, quishing, whaling?', 'SMS/text; voice; QR code; spear phishing aimed at senior executives.'),
  c('2.5', 'On-path?', 'Current term for man-in-the-middle (ATT&CK: adversary-in-the-middle). Reached by ARP poisoning, DHCP spoofing, evil twins; enables sniffing, alteration, replay.'),
  c('2.5', 'DNS cache poisoning vs domain hijacking vs typosquatting?', 'Poisoning: forged records in a resolver\'s cache. Hijacking: control of the registration/NS at the registrar. Typosquatting: lookalike domain registered.'),
  c('2.5', 'Password spraying vs brute force vs credential stuffing?', 'Spraying: few passwords, many accounts. Brute force: many passwords, one account. Stuffing: breached username/password pairs reused.'),
  c('2.5', 'Replay vs session hijacking?', 'Replay re-sends a captured message or credential unchanged. Session hijacking takes over an established session (stolen cookie/token) to send new requests.'),
  c('2.5', 'CSRF vs SSRF?', 'CSRF: victim\'s browser sends an unwanted request to a site where they are logged in. SSRF: the server is made to request attacker-chosen (often internal) URLs.'),
  c('2.5', 'Windows events: 4625, 4740, 1102?', '4625 failed logon (sub-status `0xC0000064` bad user, `0xC000006A` bad password); 4740 account locked out; 1102 audit log cleared.'),
  c('2.5', 'Impossible travel vs concurrent sessions?', 'Impossible travel: sign-ins too far apart for the time between them. Concurrent sessions: the same account active in several places at once.'),
  // 2.6
  c('2.6', 'Poisoning vs evasion vs model manipulation?', 'Poisoning: corrupt training data. Evasion: adversarial inputs at inference, model untouched. Model manipulation: alter the model or its configuration directly.'),
  c('2.6', 'Direct vs indirect prompt injection?', 'Direct: the user\'s own prompt. Indirect: instructions hidden in third-party content the model reads (web page, email, RAG document).'),
  c('2.6', 'Jailbreak (NIST AI 100-2e2025)?', 'A direct prompting attack intended to circumvent restrictions on model outputs, such as refusal behavior, to enable misuse.'),
  c('2.6', 'AI code execution risk (OWASP LLM05/LLM06)?', 'Model output passed to a shell, `eval` or tools without validation; agents with excessive permissions. Sandbox, allow-list, least privilege, human approval.'),
  c('2.6', 'NIST\'s three categories of AI bias?', 'Systemic; computational and statistical; human-cognitive. All can occur without intent to discriminate.'),
];
