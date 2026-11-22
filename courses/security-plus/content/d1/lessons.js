// Domain 1 — General Security Concepts. Original content, checked against the NIST CSRC glossary
// (defense in depth, least privilege, non-repudiation, compensating controls, key escrow, key recovery, salt),
// NIST SP 800-53 Rev. 5 (control families, CM-3), SP 800-207 (Zero Trust tenets), SP 800-57 Part 1 Rev. 5,
// SP 800-131A Rev. 2, SP 800-63B-4, NIST IR 8547 (final, October 2026), FIPS 186-5, FIPS 203/204/205, RFC 5280, 6960, 6066,
// 2986, 8446, 8996, 7465, 9525, 6151, 8018, 7914, 9106 and the CA/Browser Forum TLS Baseline Requirements.
export default [
  { id: '1.1-security-concepts-controls', topic: '1.1', title: 'Security Concepts and Controls: CIA, AAA, Zero Trust, Control Categories and Types', minutes: 11, file: '1.1-security-concepts-controls.md',
    objectives: ['Explain defense in depth and relate CIA, AAA, non-repudiation and least privilege to it', 'Summarize the Zero Trust principles in NIST SP 800-207', 'Classify a control by category: technical/logical, managerial/administrative, physical/environmental, operational', 'Classify a control by type: preventive, deterring, detective, corrective, compensating, directive', 'Recognize that one control can have several types'] },
  { id: '1.2-change-management', topic: '1.2', title: 'Change Management and Its Impact on Security', minutes: 10, file: '1.2-change-management.md',
    objectives: ['Walk a change through the CAB approval process with owner and stakeholders', 'Use impact analysis, test results and a maintenance window to reduce change risk', 'Choose between backout and fail forward', 'Anticipate technical impacts: allow/deny lists, restricted activities, downtime, restarts, legacy apps, dependencies', 'Keep diagrams, policies, procedures and version control current'] },
  { id: '1.3-pki-certificates', topic: '1.3', title: 'Cryptography 1: PKI, Certificates, Revocation and Key Escrow', minutes: 11, file: '1.3-pki-certificates.md',
    objectives: ['Explain public and private keys and what each is used for', 'Describe CAs, the chain of trust and the root of trust', 'Generate a CSR and know what it contains', 'Compare CRLs, OCSP and OCSP stapling', 'Choose between self-signed, internal and third-party certificates, and use wildcards correctly', 'Distinguish key escrow from key recovery'] },
  { id: '1.3-encryption-hashing', topic: '1.3', title: 'Cryptography 2: Encryption, Key Exchange, Hashing, Salting and Signatures', minutes: 12, file: '1.3-encryption-hashing.md',
    objectives: ['Compare symmetric and asymmetric encryption, algorithms and key lengths', 'Explain key exchange and forward secrecy in transport encryption', 'Pick the right encryption level: full disk, partition, volume, file, database, record', 'Explain digital signatures, hashing algorithms, salting and key stretching', 'Describe obfuscation and the hardware and software crypto tools'] },
];
