// Domain 3 — Layer 2 control and security. Lessons in recommended study order.
// Target: FortiOS 7.6 / FortiSwitchOS 7.6 (FortiLink Guide 7.6.1, FortiOS 7.6.1 CLI Reference).
export default [
  {
    id: '3.1-8021x-security-policies',
    topic: '3.1',
    title: '802.1X, MAB and FortiSwitch Security Policies',
    minutes: 22,
    file: '3.1-8021x-security-policies.md',
    objectives: [
      'Build a FortiSwitch 802.1X security policy and apply it to managed switch ports',
      'Choose between port-based and MAC-based 802.1X and enable MAB',
      'Use guest, auth-fail and RADIUS-timeout VLANs and RADIUS dynamic VLAN assignment',
      'Tune global and per-switch 802.1X settings and the FortiOS 7.6 authentication priority',
    ],
  },
  {
    id: '3.1-nac-port-policies-mac',
    topic: '3.1',
    title: 'FortiLink NAC, Dynamic Port Policies and MAC Learning Controls',
    minutes: 20,
    file: '3.1-nac-port-policies-mac.md',
    objectives: [
      'Explain how FortiLink NAC onboards and assigns devices with NAC policies',
      'Configure dynamic port policies and VLAN policies',
      'Limit MAC learning per port and log violations',
      'Use and save sticky (persistent) MAC addresses',
    ],
  },
  {
    id: '3.2-dhcp-snooping-option82',
    topic: '3.2',
    title: 'DHCP Snooping, Trusted Ports, Server Access Lists and Option 82',
    minutes: 20,
    file: '3.2-dhcp-snooping-option82.md',
    objectives: [
      'Enable DHCP snooping per VLAN and set trusted and untrusted ports',
      'Restrict DHCP servers with the DHCP server access list',
      'Insert and override option-82 data',
      'Create DHCP-snooping static entries for static-IP hosts',
    ],
  },
  {
    id: '3.2-dai-ipsg-storm',
    topic: '3.2',
    title: 'Dynamic ARP Inspection, IPv4 Source Guard and Storm Control',
    minutes: 20,
    file: '3.2-dai-ipsg-storm.md',
    objectives: [
      'Enable dynamic ARP inspection and ARP monitor mode on managed switch VLANs',
      'Configure IPv4 source guard with static and dynamic bindings',
      'Recall the defaults and limits of DAI and IPv4 source guard',
      'Configure global and per-port storm control',
    ],
  },
  {
    id: '3.3-acl-quarantine-inspection',
    topic: '3.3',
    title: 'ACLs, Intra-VLAN Blocking, Quarantines, FortiGate Inspection and Secure Fabric',
    minutes: 24,
    file: '3.3-acl-quarantine-inspection.md',
    objectives: [
      'Configure managed-switch ingress ACLs and compare them with standalone ACL stages',
      'Block intra-VLAN traffic and send selected flows through FortiGate inspection',
      'Quarantine and release hosts by VLAN or by redirect',
      'Explain how FortiGate firewall policies and security profiles inspect FortiSwitch VLAN traffic',
      'Configure FortiLink secure fabric authentication and MACsec on ISLs',
    ],
  },
];
