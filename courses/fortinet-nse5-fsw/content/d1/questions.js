// Domain 1 — FortiSwitch concepts question bank (original, exam-style).
// FortiSwitchOS 7.6 / FortiOS 7.6. Facts checked against the FortiLink Guide 7.6.1, the FortiSwitchOS 7.6.1
// Administration Guide and the FortiOS 7.6.1 CLI Reference (docs.fortinet.com, 2026-10-29/30).
export default [
  // ---------------------------------------------------------------- 1.1 VLANs
  {
    id: 'd1-001',
    topic: '1.1',
    type: 'single',
    difficulty: 2,
    stem: 'Refer to the exhibit. A host connected to port5 of FSW-Access1 sends a frame tagged with VLAN 30 (the VLAN ID of vlan30-guest). What does the switch do with the frame?',
    exhibit: `FGT-HQ # show switch-controller managed-switch S248EPTF18000101
config switch-controller managed-switch
    edit "S248EPTF18000101"
        set name "FSW-Access1"
        config ports
            edit "port5"
                set vlan "vlan10-data"
                set allowed-vlans "vlan20-voice"
                set untagged-vlans "vlan20-voice"
            next
        end
    next
end`,
    options: [
      'It removes the tag and forwards the frame in vlan10-data, the native VLAN',
      'It drops the frame, because VLAN 30 is neither the native VLAN nor in the allowed VLAN list',
      'It forwards the frame in vlan30-guest, because tagged frames are accepted for any VLAN defined on the FortiGate',
      'It forwards the frame in vlan20-voice, because that VLAN is in the untagged VLAN list',
    ],
    answer: [1],
    explanation: 'On ingress, a **tagged** frame is accepted only if its tag matches the port\'s native VLAN or a VLAN in the allowed list. port5 has native `vlan10-data` and allows only `vlan20-voice`, so a VLAN 30 frame is dropped. Tagged frames are never re-tagged into the native VLAN (only untagged frames get the native VLAN). The untagged list only controls egress tagging, and being defined on the FortiGate is not enough — the VLAN must be allowed on the port.',
    lesson: '1.1-vlan-port-model',
  },
  {
    id: 'd1-002',
    topic: '1.1',
    type: 'single',
    difficulty: 2,
    stem: 'Refer to the exhibit. How are frames belonging to vlan10-data and vlan20-voice sent out of port5?',
    exhibit: `config switch-controller managed-switch
    edit "S248EPTF18000101"
        config ports
            edit "port5"
                set vlan "vlan10-data"
                set allowed-vlans "vlan20-voice"
                set untagged-vlans "vlan20-voice"
            next
        end
    next
end`,
    options: [
      'vlan10-data untagged and vlan20-voice tagged',
      'vlan10-data tagged and vlan20-voice untagged',
      'Both untagged',
      'Both tagged, because untagged-vlans applies only to ingress traffic',
    ],
    answer: [2],
    explanation: 'On egress, a frame whose VLAN is the port\'s **native VLAN** or is in the **untagged VLAN list** leaves without a tag. vlan10-data is native and vlan20-voice is in `untagged-vlans`, so both leave untagged. The untagged list applies **only** to egress, not ingress. Unlike Cisco, a FortiSwitch port can send more than one VLAN untagged.',
    lesson: '1.1-vlan-port-model',
  },
  {
    id: 'd1-003',
    topic: '1.1',
    type: 'multi',
    difficulty: 2,
    stem: 'Which two statements describe how a FortiSwitch port processes frames on ingress? (Choose two.)',
    options: [
      'An untagged frame is assigned the port\'s native VLAN, and the allowed VLAN list is ignored for it',
      'A tagged frame whose tag equals the port\'s native VLAN is accepted',
      'A tagged frame whose VLAN is in the untagged VLAN list is always dropped',
      'An untagged frame is dropped unless the native VLAN also appears in the allowed VLAN list',
      'A tagged frame for a VLAN that is not allowed is re-tagged with the native VLAN',
    ],
    answer: [0, 1],
    explanation: 'Untagged frames are tagged with the native VLAN and accepted; the allowed list is not consulted. Tagged frames must match the native VLAN **or** an allowed VLAN, so a tag equal to the native VLAN is accepted. The untagged list is an egress-only setting (and its VLANs must also be allowed). The native VLAN is implicitly allowed. Tagged frames for disallowed VLANs are dropped, never re-tagged.',
    lesson: '1.1-vlan-port-model',
  },
  {
    id: 'd1-004',
    topic: '1.1',
    type: 'fill',
    difficulty: 1,
    stem: 'What is the default value of switch-controller-reserved-network under config system global on a FortiGate? (Enter it in CIDR form.)',
    answer: ['10.255.0.0/16', '10.255.0.0 255.255.0.0', '10.255.0.0/255.255.0.0'],
    explanation: 'The switch-controller reserved network defaults to **10.255.0.0/16**. Auto-IP VLAN interface templates take unused /24s from it, and the default template addresses (quarantine 10.255.11.1/24, RSPAN 10.255.12.1/24, NAC segment 10.255.13.1/24) are inside it. Change it before authorizing switches if it overlaps a production network.',
    lesson: '1.1-fortilink-vlans-templates',
  },
  {
    id: 'd1-005',
    topic: '1.1',
    type: 'single',
    difficulty: 2,
    stem: 'An administrator wants new FortiSwitch units to receive a voice VLAN with ID 20 and a quarantine VLAN with ID 4093 by using VLAN interface templates. Two switches are already authorized on FGT-HQ. What is true?',
    options: [
      'The templates are applied the next time each authorized switch reboots',
      'The templates can be created only while the FortiGate has not authorized any FortiSwitch unit',
      'The templates are created per FortiSwitch model, so existing models are unaffected',
      'The templates must be pushed with diagnose switch-controller trigger config-sync',
    ],
    answer: [1],
    explanation: 'The FortiLink Guide states that VLAN interface templates can only be created when the FortiGate has **not authorized any FortiSwitch units yet**, which is why Fortinet recommends completing them before physically connecting switches. Templates are per VDOM, not per model, and they define the auto-created VLAN interfaces — they are not pushed by a config sync or applied at reboot.',
    lesson: '1.1-fortilink-vlans-templates',
  },
  {
    id: 'd1-006',
    topic: '1.1',
    type: 'match',
    difficulty: 2,
    stem: 'Match each FortiLink item with its default value.',
    pairs: [
      ['quarantine VLAN template IP', '10.255.11.1/24'],
      ['rspan VLAN template IP', '10.255.12.1/24'],
      ['nac-segment VLAN template IP', '10.255.13.1/24'],
      ['switch-controller-mgmt-vlan', 'VLAN 4094'],
    ],
    explanation: 'Default template addresses come from the reserved network 10.255.0.0/16: quarantine **.11**, RSPAN **.12**, NAC segment **.13**, all /24. The default-vlan, voice, video and nac templates have no default IP. The FortiLink management VLAN (`switch-controller-mgmt-vlan`) defaults to **4094** (range 1–4094).',
    lesson: '1.1-fortilink-vlans-templates',
  },
  {
    id: 'd1-007',
    topic: '1.1',
    type: 'single',
    difficulty: 2,
    stem: 'Refer to the exhibit. FGT-HQ has VDOMs enabled. The same templates are used in the root VDOM and in the tenant-a VDOM. In tenant-a, the auto-created quarantine VLAN interface receives SNMP index 29. What is that interface called?',
    exhibit: `config switch-controller initial-config template
    edit "quarantine"
        set vlanid 4093
        set dhcp-server enable
    next
end
config switch-controller initial-config vlans
    set quarantine "quarantine"
end`,
    options: [
      'quarantine',
      'tenant-a.quarantine',
      'quarantine.29',
      'quarantine-4093',
    ],
    answer: [2],
    explanation: 'To keep names unique, the root VDOM uses the template name as the interface name, while **other VDOMs** append the interface\'s SNMP index: template `quarantine` with SNMP index 29 becomes **quarantine.29**. That is why exhibits from multi-VDOM FortiGates show names such as `_default.39`. The VLAN ID and VDOM name are not part of the generated name.',
    lesson: '1.1-fortilink-vlans-templates',
  },
  {
    id: 'd1-008',
    topic: '1.1',
    type: 'single',
    difficulty: 2,
    stem: 'Refer to the exhibit. The administrator wants the voice VLAN interface created from this template to use 10.10.20.1/24, but the ip setting cannot be configured. What must the administrator do first?',
    exhibit: `FGT-HQ # config switch-controller initial-config template
FGT-HQ (template) # edit "voice"
FGT-HQ (voice) # set vlanid 20
FGT-HQ (voice) # set dhcp-server enable
FGT-HQ (voice) # show
config switch-controller initial-config template
    edit "voice"
        set vlanid 20
        set dhcp-server enable
    next
end`,
    options: [
      'Disable dhcp-server, because a template with a DHCP server must take its address from the reserved network',
      'Disable auto-ip, which is enabled by default and makes the switch controller pick a subnet from the reserved network',
      'Change switch-controller-reserved-network to 10.10.0.0/16',
      'Set allowaccess before setting ip',
    ],
    answer: [1],
    explanation: '`auto-ip` is **enabled by default** in a template; the switch controller then picks an unused /24 from the reserved network, and `ip` can only be configured when `auto-ip` is disabled. The DHCP server setting is independent of how the address is chosen. Moving the reserved network would still let auto-IP pick the subnet, and `allowaccess` has no effect on whether `ip` is available.',
    lesson: '1.1-fortilink-vlans-templates',
  },
  {
    id: 'd1-009',
    topic: '1.1',
    type: 'single',
    difficulty: 2,
    stem: 'Refer to the exhibit from a standalone FortiSwitch. Which devices can the host on port7 communicate with at Layer 2?',
    exhibit: `config switch vlan
    edit 1000
        set private-vlan enable
        set isolated-vlan 101
        set community-vlans 200-210
    next
end
config switch interface
    edit "port2"
        set private-vlan promiscuous
        set primary-vlan 1000
    next
    edit "port3"
        set private-vlan sub-vlan
        set primary-vlan 1000
        set sub-vlan 200
    next
    edit "port4"
        set private-vlan sub-vlan
        set primary-vlan 1000
        set sub-vlan 200
    next
    edit "port7"
        set private-vlan sub-vlan
        set primary-vlan 1000
        set sub-vlan 101
    next
    edit "port8"
        set private-vlan sub-vlan
        set primary-vlan 1000
        set sub-vlan 101
    next
end`,
    options: [
      'Only the device on port2',
      'The devices on port2 and port8',
      'The devices on port2, port3 and port4',
      'All other ports in primary VLAN 1000',
    ],
    answer: [0],
    explanation: 'port7 is in sub-VLAN 101, which is the **isolated** VLAN. Isolated ports communicate only with **promiscuous** ports (port2) — not with other isolated hosts (port8) and not with community ports (port3, port4 in community VLAN 200). port3 and port4 could reach each other and port2.',
    lesson: '1.1-pvlan-qinq-mac-vlans',
  },
  {
    id: 'd1-010',
    topic: '1.1',
    type: 'multi',
    difficulty: 2,
    stem: 'Which two statements about private VLANs on FortiSwitch are true? (Choose two.)',
    options: [
      'A PVLAN domain can have only one isolated VLAN but several community VLANs',
      'Hosts in the same community VLAN can communicate with each other and with promiscuous ports',
      'Each secondary VLAN must use a different IP subnet from the primary VLAN',
      'Hosts in the same isolated VLAN can communicate with each other but not with community VLANs',
      'A promiscuous port can communicate only with the primary VLAN, not with secondary VLANs',
    ],
    answer: [0, 1],
    explanation: 'A PVLAN keeps **one subnet** and splits the broadcast domain: one **isolated** VLAN per PVLAN domain and any number of **community** VLANs. Community hosts reach each other and promiscuous ports; isolated hosts reach only promiscuous ports, not each other. Promiscuous ports (gateway, firewall) talk to the primary and every secondary VLAN.',
    lesson: '1.1-pvlan-qinq-mac-vlans',
  },
  {
    id: 'd1-011',
    topic: '1.1',
    type: 'single',
    difficulty: 3,
    stem: 'Refer to the exhibit. Which statement about traffic received from the customer on port1 is true?',
    exhibit: `FSW-Core1 # show switch interface port1
config switch interface
    edit "port1"
        set native-vlan 3000
        config qnq
            set status enable
            set native-c-vlan 1
            set allowed-c-vlan 10,20
        end
    next
end`,
    options: [
      'Customer frames tagged with VLAN 10 are carried inside service VLAN 3000, and untagged customer frames get inner tag 1',
      'Customer frames tagged with VLAN 10 are re-tagged as VLAN 3000 and the customer tag is discarded',
      'native-c-vlan 1 is the outer tag added to every frame, and 3000 is the inner tag',
      'allowed-c-vlan 10,20 means only VLANs 10 and 20 can be used as service VLANs on port1',
    ],
    answer: [0],
    explanation: 'Settings under `config qnq` describe **C-VLANs** (customer, inner tags); `native-vlan`, `allowed-vlans` and `vlan-tpid` on the interface describe **S-VLANs** (service, outer tags). So customer VLANs 10 and 20 are allowed and carried in S-VLAN 3000 with their inner tag intact, and `native-c-vlan 1` adds inner tag 1 to untagged customer frames (removed again on egress). QinQ stacks tags; it does not discard the customer tag.',
    lesson: '1.1-pvlan-qinq-mac-vlans',
  },
  {
    id: 'd1-012',
    topic: '1.1',
    type: 'multi',
    difficulty: 2,
    stem: 'According to the FortiSwitchOS documentation, which two features are not supported with VLAN stacking (QinQ)? (Choose two.)',
    options: [
      'DHCP snooping',
      'STP',
      'VLAN mapping entries',
      'VLAN TPID profiles',
      'A native customer VLAN (native-c-vlan)',
    ],
    answer: [0, 1],
    explanation: 'The FortiSwitchOS guide lists DHCP relay, DHCP snooping, IGMP snooping, IP source guard, PVLAN and **STP** as not supported with VLAN stacking. VLAN mapping, TPID profiles and `native-c-vlan` are part of the QinQ feature itself, configured on the same interface.',
    lesson: '1.1-pvlan-qinq-mac-vlans',
  },
  {
    id: 'd1-013',
    topic: '1.1',
    type: 'single',
    difficulty: 3,
    stem: 'Refer to the exhibit. A desk phone that is not VLAN-aware (MAC 00:21:cc:3a:10:20) is connected to port10. A PC connected behind the phone must stay in the port\'s native VLAN 1. The phone\'s frames are correctly placed in VLAN 20, but the phone never receives replies. What should the administrator change?',
    exhibit: `config switch vlan
    edit 20
        config member-by-mac
            edit 1
                set mac 00:21:cc:3a:10:20
                set description "deskphone-114"
            next
        end
    next
end
config switch interface
    edit "port10"
        set native-vlan 1
        set allowed-vlans 20
    next
end`,
    options: [
      'Add VLAN 20 to the untagged VLAN list of port10',
      'Change the native VLAN of port10 to 20',
      'Replace member-by-mac with member-by-ipv4',
      'Remove VLAN 20 from the allowed VLAN list, because MAC-based assignment does not need it',
    ],
    answer: [0],
    explanation: 'When a MAC/IP/protocol-based VLAN is assigned on a port, egress frames of that VLAN are **tagged by default**. A host that is not VLAN-aware ignores tagged frames, so add the VLAN to `untagged-vlans`. Changing the native VLAN would move all untagged traffic (including a PC behind the phone) into VLAN 20. The VLAN must stay allowed on the ingress port — that is a prerequisite. Switching to IP-based assignment does not change egress tagging.',
    lesson: '1.1-pvlan-qinq-mac-vlans',
  },
  {
    id: 'd1-014',
    topic: '1.1',
    type: 'single',
    difficulty: 2,
    stem: 'Refer to the exhibit. FGT-HQ runs FortiOS 7.6.1 and manages FortiSwitchOS 7.6.1 switches. The administrator wants automatically formed ISL trunks to carry only the VLANs that are needed on the path between destinations. Which change achieves this?',
    exhibit: `FGT-HQ # show switch-controller global
config switch-controller global
    set mac-aging-interval 300
    set vlan-all-mode defined
    set vlan-optimization configured
end`,
    options: [
      'set vlan-optimization prune',
      'set vlan-all-mode all',
      'set vlan-optimization enable',
      'set vlan-optimization none',
    ],
    answer: [0],
    explanation: 'FortiOS 7.6.1 adds **VLAN pruning**, enabled with `set vlan-optimization prune`. The default `configured` limits ISLs to VLANs created on the FortiLink interface, not to the VLANs actually needed on a path. `enable` was the pre-7.6.1 keyword for what is now `configured`. `vlan-all-mode all` widens what `allowed-vlans-all` means (and cannot be combined with `configured`), and `none` disables optimization.',
    lesson: '1.1-vlan-port-model',
  },
  {
    id: 'd1-015',
    topic: '1.1',
    type: 'fill',
    difficulty: 2,
    stem: 'Under config switch-controller global, which vlan-all-mode value (the default) makes set allowed-vlans-all enable on a managed-switch port include only the user-defined FortiLink VLANs?',
    answer: ['defined'],
    explanation: '`vlan-all-mode defined` (default) makes `allowed-vlans-all` mean all **user-defined** VLANs; `vlan-all-mode all` means all possible VLAN IDs. `vlan-all-mode all` cannot be combined with `vlan-optimization configured`.',
    lesson: '1.1-vlan-port-model',
  },
  {
    id: 'd1-016',
    topic: '1.1',
    type: 'order',
    difficulty: 2,
    stem: 'An untagged frame arrives on a FortiSwitch port and must leave, tagged, on an uplink. Put the switch\'s processing steps in order.',
    items: [
      'The untagged frame is received on the ingress port',
      'The frame is tagged with the ingress port\'s native VLAN and accepted',
      'The switch selects egress ports that carry that VLAN (native or allowed)',
      'On the uplink, the VLAN is checked against its native, untagged and allowed lists',
      'The VLAN is in the uplink\'s allowed list only, so the frame is sent with its tag',
    ],
    explanation: 'Ingress normalises everything to a tagged frame (untagged → native VLAN). Forwarding only considers ports that can carry that VLAN. At each egress port the tag is stripped for the native VLAN or untagged-list VLANs, kept for other allowed VLANs, and the frame is dropped otherwise.',
    lesson: '1.1-vlan-port-model',
  },

  // ---------------------------------------------------------------- 1.2 QoS and LLDP-MED
  {
    id: 'd1-017',
    topic: '1.2',
    type: 'single',
    difficulty: 3,
    stem: 'Refer to the exhibit. port5 uses qos-policy campus-qos. An untagged IP packet marked DSCP 46 arrives on port5. Which egress queue does the switch use for it?',
    exhibit: `config switch-controller qos dot1p-map
    edit "campus-dot1p"
        set priority-0 queue-0
        set priority-3 queue-2
        set priority-5 queue-5
    next
end
config switch-controller qos qos-policy
    edit "campus-qos"
        set default-cos 3
        set trust-dot1p-map "campus-dot1p"
        set queue-policy "campus-egress"
    next
end`,
    options: [
      'queue-0',
      'queue-2',
      'queue-5',
      'queue-7',
    ],
    answer: [1],
    explanation: 'The policy trusts only 802.1p. A packet with a DSCP value but **no CoS** on a port that trusts 802.1p and not DSCP is looked up in the dot1p map using the **default CoS** (3 here), which maps to queue-2. DSCP 46 is ignored because no DSCP map is trusted. queue-0 would apply only if nothing were trusted; queue-5 would need CoS 5.',
    lesson: '1.2-fortiswitch-qos',
  },
  {
    id: 'd1-018',
    topic: '1.2',
    type: 'single',
    difficulty: 3,
    stem: 'Refer to the exhibit. A tagged frame with CoS 5 carrying an IP packet marked DSCP 34 arrives on a port that uses qos-policy both-trust. Which queue is used?',
    exhibit: `config switch-controller qos dot1p-map
    edit "map-cos"
        set priority-5 queue-1
    next
end
config switch-controller qos ip-dscp-map
    edit "map-dscp"
        config map
            edit "video"
                set cos-queue 3
                set value 34
            next
        end
    next
end
config switch-controller qos qos-policy
    edit "both-trust"
        set trust-dot1p-map "map-cos"
        set trust-ip-dscp-map "map-dscp"
        set queue-policy "campus-egress"
    next
end`,
    options: [
      'queue-1, because 802.1p is evaluated before DSCP',
      'queue-3, because DSCP is used when both are trusted and the packet has a DSCP value',
      'queue-0, because trusting both maps on one port is invalid and disables trust',
      'queue-5, because the queue equals the CoS value',
    ],
    answer: [1],
    explanation: 'Fortinet recommends trusting only one of 802.1p or DSCP, but if both are trusted the switch uses the **DSCP** value (and DSCP map) whenever the packet has one; it falls back to the dot1p map only for packets without DSCP. DSCP 34 maps to queue 3. The configuration is not invalid, and the queue is whatever the map says, not the raw CoS value.',
    lesson: '1.2-fortiswitch-qos',
  },
  {
    id: 'd1-019',
    topic: '1.2',
    type: 'single',
    difficulty: 1,
    stem: 'A FortiSwitch egress queue policy uses schedule strict. Which queue is served first when all eight queues have packets waiting?',
    options: [
      'queue-0',
      'queue-1',
      'queue-7',
      'The queue with the highest weight',
    ],
    answer: [2],
    explanation: 'With strict scheduling the queues are served in descending order of queue number: **queue-7 is the highest priority** and queue-0 the lowest. Weights apply only to weighted round robin. Note that FortiSwitch uses queue-7 for network control and critical management traffic, so do not oversubscribe it with data.',
    lesson: '1.2-fortiswitch-qos',
  },
  {
    id: 'd1-020',
    topic: '1.2',
    type: 'single',
    difficulty: 2,
    stem: 'Refer to the exhibit, which shows the predefined voice egress policy. How is queue-1 serviced?',
    exhibit: `config switch-controller qos queue-policy
    edit "voice-egress"
        set schedule weighted
        set rate-by kbps
        config cos-queue
            edit "queue-0"
            next
            edit "queue-1"
                set weight 0
            next
            edit "queue-2"
                set weight 6
            next
            edit "queue-3"
                set weight 37
            next
            edit "queue-4"
                set weight 12
            next
        end
    next
end`,
    options: [
      'It is never serviced, because a weight of 0 gives it no bandwidth',
      'It is serviced with strict priority, ahead of all queues that have a non-zero weight',
      'It receives an equal share with queue-0, because both use the default weight',
      'It is serviced last, after all weighted queues are empty',
    ],
    answer: [1],
    explanation: 'In a weighted policy, a queue with **weight 0 follows strict scheduling** and takes priority over all non-zero-weight queues (among several weight-0 queues, the higher-numbered wins). The voice policy uses this to put VoIP media (DSCP 46 → queue 1) in a strict-priority queue while the rest share bandwidth by WRR — similar to a Cisco priority queue plus CBWFQ.',
    lesson: '1.2-fortiswitch-qos',
  },
  {
    id: 'd1-021',
    topic: '1.2',
    type: 'multi',
    difficulty: 2,
    stem: 'Which two statements about QoS on managed FortiSwitch units are true? (Choose two.)',
    options: [
      'Each switch port has eight egress queues',
      'CoS values not listed in a dot1p map are mapped to queue 0',
      'An ACL that remarks DSCP also changes the egress queue chosen on the same switch',
      'An egress max-rate configured on a trunk is shared as one aggregate rate across all members',
      'The FortiGate applies the same QoS policies to its own hardware switch ports',
    ],
    answer: [0, 1],
    explanation: 'FortiSwitch provides **eight egress queues** per port, and priorities missing from a dot1p map follow the default mapping to **queue 0**. Remarking with an ACL does not change queuing on that switch (queuing still uses the original values and trust maps). A rate on a trunk applies to **each member port**; there is no aggregate trunk rate. The FortiGate does not support QoS for its hardware or software switch ports.',
    lesson: '1.2-fortiswitch-qos',
  },
  {
    id: 'd1-022',
    topic: '1.2',
    type: 'single',
    difficulty: 3,
    stem: 'Refer to the exhibit. port1 trusts dot1p map m1, which maps priority-2 to queue-1 and priority-4 to queue-4. A frame with CoS 2 arrives on port1 and is forwarded out of port20 on the same switch, where its VLAN is sent tagged. Which queue does it use on port20, and with which CoS does it leave?',
    exhibit: `config switch acl ingress
    edit 10
        config classifier
            set cos 2
        end
        config action
            set remark-cos 4
            set count enable
        end
        set ingress-interface "port1"
        set status active
    next
end`,
    options: [
      'queue-1, leaving with CoS 4',
      'queue-4, leaving with CoS 4',
      'queue-1, leaving with CoS 2',
      'queue-4, leaving with CoS 2',
    ],
    answer: [0],
    explanation: 'The ACL remarks the frame to CoS 4, so it leaves with CoS 4 and the next hop sees the new value. But on this switch the egress queue is still chosen from the trust maps and the **original** value: CoS 2 → queue-1. Remarking affects downstream devices, not local queuing.',
    lesson: '1.2-fortiswitch-qos',
  },
  {
    id: 'd1-023',
    topic: '1.2',
    type: 'single',
    difficulty: 2,
    stem: 'Refer to the exhibit. qos-policy uplink-qos references queue-policy limit-100m and is applied to trunk srv-lag1 with members port21 and port22. What is the maximum egress rate of queue-0 traffic on the trunk?',
    exhibit: `config switch-controller qos queue-policy
    edit "limit-100m"
        set schedule round-robin
        set rate-by kbps
        config cos-queue
            edit "queue-0"
                set max-rate 100000
            next
        end
    next
end`,
    options: [
      '100 Mbps in total, shared by port21 and port22',
      '100 Mbps on each member port, so up to 200 Mbps for the trunk',
      '50 Mbps on each member port',
      'No limit, because rate limits cannot be applied to trunks',
    ],
    answer: [1],
    explanation: 'When an egress QoS policy with rate control is applied to a trunk, the rate is applied to **each port** in the trunk; FortiSwitch does not support an aggregate value for the whole trunk. 100,000 kbps per member gives up to 200 Mbps across two members.',
    lesson: '1.2-fortiswitch-qos',
  },
  {
    id: 'd1-024',
    topic: '1.2',
    type: 'fill',
    difficulty: 1,
    stem: 'What is the name of the predefined FortiOS switch-controller QoS policy that references voice-dot1p, voice-dscp and voice-egress?',
    answer: ['voice-qos'],
    explanation: 'The predefined **voice-qos** policy trusts the `voice-dot1p` and `voice-dscp` maps and uses the `voice-egress` queue policy (DSCP 46 → queue 1 with weight 0). It is the QoS policy normally used with the `fortivoice.fortilink` LLDP profile in dynamic port policies for phones.',
    lesson: '1.2-fortiswitch-qos',
  },
  {
    id: 'd1-025',
    topic: '1.2',
    type: 'fill',
    difficulty: 2,
    stem: 'Refer to the exhibit. What TTL, in seconds, do the managed switches advertise in their LLDPDUs? (Enter a number.)',
    exhibit: `config switch-controller lldp-settings
    set tx-hold 5
    set tx-interval 20
    set fast-start-interval 2
end`,
    answer: ['100'],
    explanation: 'The LLDP TTL is `tx-hold` × `tx-interval` = 5 × 20 = **100 seconds**. The defaults are 4 and 30 (TTL 120 s). Even when an auto-ISL profile overrides the transmit frequency with `auto-isl-hello-timer`, the TTL is still calculated from these two values.',
    lesson: '1.2-lldp-med-voice',
  },
  {
    id: 'd1-026',
    topic: '1.2',
    type: 'single',
    difficulty: 3,
    stem: 'Refer to the exhibit. Phones on ports that use LLDP profile phones do not learn their voice VLAN. vlan20-voice is allowed on those ports. What is the cause?',
    exhibit: `config switch-controller lldp-profile
    edit "phones"
        set med-tlvs inventory-management location-identification
        config med-network-policy
            edit "voice"
                set status enable
                set vlan-intf "vlan20-voice"
                set priority 5
                set dscp 46
            next
        end
    next
end`,
    options: [
      'med-tlvs does not include network-policy, so the network policy TLV is not transmitted',
      'The voice policy must be created with a custom name, because the built-in voice entry cannot be modified',
      'priority 5 conflicts with DSCP 46, so the policy is rejected',
      'LLDP-MED requires CDP to be enabled on the port',
    ],
    answer: [0],
    explanation: 'To use an LLDP-MED network policy, `med-tlvs` must include **network-policy** and the policy entry must be enabled. Here only inventory-management and location-identification TLVs are sent. The network-policy list is fixed: you cannot add custom-named entries, you enable and configure the built-in ones such as `voice`. Priority 5 with DSCP 46 is a normal voice combination, and CDP is independent of LLDP-MED.',
    lesson: '1.2-lldp-med-voice',
  },
  {
    id: 'd1-027',
    topic: '1.2',
    type: 'multi',
    difficulty: 2,
    stem: 'Which two statements about LLDP-MED network policies on FortiSwitch are true? (Choose two.)',
    options: [
      'The set of network policy types is fixed; policies can be enabled and configured but not added or deleted',
      'A policy is advertised only if its VLAN is the native VLAN or an allowed VLAN on the port',
      'The VLAN in a network policy is always advertised as tagged',
      'Network policies are configured per port, not in an LLDP profile',
      'A FortiSwitch port supports a single LLDP neighbor',
    ],
    answer: [0, 1],
    explanation: 'LLDP-MED network policies (voice, voice-signaling, guest-voice, guest-voice-signaling, softphone-voice, video-conferencing, streaming-video, video-signaling) cannot be added or deleted. Their VLAN is cross-checked against the interface: the TLV is sent only if the VLAN is native or allowed, and it is marked **untagged** if the VLAN is native or in the untagged list. Policies live in the LLDP **profile**, and a port supports up to 16 LLDP neighbors.',
    lesson: '1.2-lldp-med-voice',
  },
  {
    id: 'd1-028',
    topic: '1.2',
    type: 'order',
    difficulty: 2,
    stem: 'Put the steps for automatically configuring FortiFone ports with voice device detection in order.',
    items: [
      'Create or choose the LLDP profile, QoS policy and VLAN policy for phones',
      'Create a dynamic port policy that matches the FortiFone device family and applies those three actions',
      'Set the switch port to access-mode dynamic and assign the dynamic port policy',
      'The phone is connected and sends LLDP, which the switch passes to the FortiGate',
      'The FortiGate matches the device and applies the policy actions to the port',
    ],
    explanation: 'The actions (for example `fortivoice.fortilink`, `voice-qos` and a VLAN policy) must exist before the dynamic port policy can reference them, and the port must be in dynamic access mode with the policy assigned before the phone connects. FortiSwitchOS parses the phone\'s LLDP and passes it to the FortiGate for device detection; the matching policy is then applied. Check with `diagnose switch-controller mac-device dynamic`.',
    lesson: '1.2-lldp-med-voice',
  },
  {
    id: 'd1-029',
    topic: '1.2',
    type: 'match',
    difficulty: 2,
    stem: 'Match each LLDP profile with its purpose.',
    pairs: [
      ['default-auto-isl', 'Always has auto-ISL enabled for switch-to-switch links'],
      ['default-auto-mclag-icl', 'Assigned to ports that should form an MCLAG ICL'],
      ['fortivoice.fortilink', 'Predefined profile for FortiFone voice ports'],
      ['default', 'Built-in general-purpose profile whose MED TLVs include inventory-management and network-policy'],
    ],
    explanation: '`default-auto-isl` always has auto-ISL enabled and rejects attempts to disable it. `default-auto-mclag-icl` is assigned to the ICL ports on both peers when building an MCLAG from the FortiGate. `fortivoice.fortilink` is the predefined voice profile used with dynamic port policies. `default` is the other built-in profile (its `get switch lldp profile` output lists MED TLVs inventory-management and network-policy); both built-ins can be modified but not deleted.',
    lesson: '1.2-lldp-med-voice',
  },

  // ---------------------------------------------------------------- 1.3 Stack ports
  {
    id: 'd1-030',
    topic: '1.3',
    type: 'single',
    difficulty: 1,
    stem: 'Which statement about the FortiLink split interface is true?',
    options: [
      'It is enabled by default, and the aggregate must contain exactly two ports, one to each FortiSwitch, with only one link active',
      'It is disabled by default and load-balances traffic across two FortiSwitch units',
      'It lets the aggregate contain up to eight ports spread across any number of switches',
      'It is required whenever all aggregate members connect to the same FortiSwitch',
    ],
    answer: [0],
    explanation: 'The FortiLink split interface is **enabled by default**. The aggregate contains **exactly two** physical ports, one per FortiSwitch, and **only one link is active**; the other is standby. If all members go to the same switch you must **disable** it. Active/active use of both links comes from an MCLAG, not from the split interface.',
    lesson: '1.3-isl-split-mclag',
  },
  {
    id: 'd1-031',
    topic: '1.3',
    type: 'single',
    difficulty: 2,
    stem: 'Refer to the exhibit. port9 and port10 of FGT-HQ are both cabled to FSW-Core1 (a single switch, no MCLAG). The administrator expects 20 Gbps of FortiLink bandwidth, but only one link carries traffic. What should be changed?',
    exhibit: `config system interface
    edit "fortilink"
        set type aggregate
        set member "port9" "port10"
        set fortilink enable
        set lacp-mode active
        set fortilink-split-interface enable
    next
end`,
    options: [
      'set lacp-mode static',
      'set fortilink-split-interface disable',
      'set fortilink-neighbor-detect fortilink',
      'Convert the FortiLink interface to a hardware switch',
    ],
    answer: [1],
    explanation: 'With the split interface enabled, only one aggregate member is active. The FortiLink Guide states that if the members of the aggregate connect to the **same** FortiSwitch, `fortilink-split-interface` must be disabled; LACP then bundles both links. LACP should stay active, the neighbor detection method does not make both links forward, and a hardware switch is not a LAG.',
    lesson: '1.3-isl-split-mclag',
  },
  {
    id: 'd1-032',
    topic: '1.3',
    type: 'order',
    difficulty: 3,
    stem: 'FGT-HQ connects to FSW-Core1 and FSW-Core2 through a FortiLink split interface. Put the steps to convert this into a FortiLink MCLAG in order.',
    items: [
      'Confirm the FortiLink split interface is enabled and both switches are managed',
      'Assign the LLDP profile default-auto-mclag-icl to the ICL ports on FSW-Core1 and FSW-Core2',
      'Disable fortilink-split-interface on the FortiLink aggregate',
      'Make sure lacp-mode active is set on the FortiLink aggregate',
      'Verify the LAG with diagnose netlink aggregate name fortilink',
    ],
    explanation: 'The split interface must be enabled **before** MCLAG is enabled. The ICL is formed by assigning `default-auto-mclag-icl` to the ICL ports on both peers (from the FortiGate CLI or with the GUI "Create MC-LAG pair"). Only then is the split interface disabled so both FortiLink links become active, with LACP active on the aggregate. Finally verify the aggregate and the ICL.',
    lesson: '1.3-isl-split-mclag',
  },
  {
    id: 'd1-033',
    topic: '1.3',
    type: 'multi',
    difficulty: 2,
    stem: 'Which two statements are MCLAG requirements or rules on FortiSwitch? (Choose two.)',
    options: [
      'An MCLAG peer group contains a maximum of two FortiSwitch units',
      'The MCLAG trunk must have the same name on both peer switches',
      'A single ICL link is recommended to avoid loops between the peers',
      'STP must be disabled on ICL trunks',
      'The peer switches must use the same port numbers for each MCLAG trunk',
    ],
    answer: [0, 1],
    explanation: 'An MCLAG has at most **two** peers, and the trunk **name** must match on both (member port numbers can differ). Fortinet recommends **at least two** links for ICL redundancy. `mclag-stp-aware` must be enabled and STP **enabled** on all ICL trunks (both are defaults). Same model and firmware are recommended; mismatches might work but are unsupported.',
    lesson: '1.3-isl-split-mclag',
  },
  {
    id: 'd1-034',
    topic: '1.3',
    type: 'single',
    difficulty: 2,
    stem: 'Refer to the exhibit. The ICL between FSW-Core1 and FSW-Core2 fails while both switches keep running. What happens?',
    exhibit: `FSW-Core1 # show switch global
config switch global
    set mclag-split-brain-detect enable
    set mclag-split-brain-priority 50
end

FSW-Core2 # show switch global
config switch global
    set mclag-split-brain-detect enable
    set mclag-split-brain-priority 30
end`,
    options: [
      'FSW-Core1 goes dormant, because it has the higher priority value',
      'FSW-Core2 goes dormant, because the peer with the lowest priority value goes dormant',
      'Both switches keep forwarding, because split-brain detection only logs the event',
      'The switch with the lowest MAC address goes dormant, because priority is only used for STP',
    ],
    answer: [1],
    explanation: 'With split-brain detection enabled on both peers, the peer with the **lowest** `mclag-split-brain-priority` value (0–100, default 50) goes dormant while the other keeps forwarding; it returns when the ICL recovers. MAC address is only the tie-breaker (lowest MAC goes dormant). Detection does stop one peer forwarding; it is not log-only.',
    lesson: '1.3-isl-split-mclag',
  },
  {
    id: 'd1-035',
    topic: '1.3',
    type: 'single',
    difficulty: 3,
    stem: 'Refer to the exhibit. Both MCLAG peers have split-brain detection enabled with the default priority. If the ICL fails while both switches are up, which switch goes dormant?',
    exhibit: `FSW-Core1  burn-in MAC: 70:4c:a5:1a:20:10
FSW-Core2  burn-in MAC: 70:4c:a5:1a:1f:e8

Both switches:
config switch global
    set mclag-split-brain-detect enable
end`,
    options: [
      'FSW-Core1, because it has the higher MAC address',
      'FSW-Core2, because it has the lower MAC address',
      'Neither, because detection requires a priority to be set explicitly',
      'Both, because equal priorities shut down both peers',
    ],
    answer: [1],
    explanation: 'Both use the default priority 50. On a tie, the switch with the **lowest numerical MAC address** goes dormant. 70:4c:a5:1a:1f:e8 is lower than 70:4c:a5:1a:20:10, so FSW-Core2 goes dormant. A priority does not have to be configured explicitly.',
    lesson: '1.3-isl-split-mclag',
  },
  {
    id: 'd1-036',
    topic: '1.3',
    type: 'single',
    difficulty: 2,
    stem: 'After all FortiSwitch units are discovered, the network team wants to make sure that automatically created ISLs and ICLs cannot be accidentally removed. What should they use?',
    options: [
      'Lockdown ISL (static ISL trunks)',
      'set fortilink-split-interface enable',
      'The default-auto-isl LLDP profile on every port',
      'set vlan-optimization configured',
    ],
    answer: [0],
    explanation: 'Static ISLs (`config switch trunk` → `set static-isl enable`), or **Lockdown ISL** in the FortiLink Interface GUI, lock the topology after auto-discovery so automatically created ISLs and ICLs are not accidentally deleted; it is also a Security Rating recommendation. `default-auto-isl` does the opposite (keeps auto-ISL on). The split interface and VLAN optimization are unrelated.',
    lesson: '1.3-isl-split-mclag',
  },
  {
    id: 'd1-037',
    topic: '1.3',
    type: 'single',
    difficulty: 1,
    stem: 'A FortiSwitch running FortiSwitchOS 7.6 in its factory-default configuration is connected to an existing managed switch. Which ports of the new switch can be used for FortiLink auto-discovery?',
    options: [
      'Only the last four ports',
      'Only the SFP uplink ports',
      'All ports',
      'Only port1, which must be configured as a FortiLink port on the switch first',
    ],
    answer: [2],
    explanation: 'Starting with FortiSwitchOS 7.2.0, **all ports are enabled for auto-discovery** by default. Older releases used a model-specific set (typically the last few ports). Once a switch is discovered, connecting another FortiSwitch to any of its ports forms an ISL automatically.',
    lesson: '1.3-isl-split-mclag',
  },
  {
    id: 'd1-038',
    topic: '1.3',
    type: 'fill',
    difficulty: 2,
    stem: 'From the FortiGate CLI, which LLDP profile do you assign to the ports of two core FortiSwitch units so that those ports form the MCLAG ICL?',
    answer: ['default-auto-mclag-icl'],
    explanation: 'Assign `set lldp-profile default-auto-mclag-icl` to the intended ICL ports on both peers (`config switch-controller managed-switch` → `config ports`). The port numbers can differ between the two switches. Then disable the FortiLink split interface.',
    lesson: '1.3-isl-split-mclag',
  },
  {
    id: 'd1-039',
    topic: '1.3',
    type: 'single',
    difficulty: 3,
    stem: 'FGT-HQ runs FortiOS 7.6.1 with default FortiLink neighbor detection and a FortiLink split interface toward FSW-Core1 and FSW-Core2. What is the state of the standby member link?',
    options: [
      'Physically down',
      'Up, with LACP inactive',
      'Up and forwarding as part of an LACP bundle',
      'Administratively disabled until the active link fails',
    ],
    answer: [1],
    explanation: 'From FortiOS 7.6.1 the default `fortilink-neighbor-detect` is **lldp**. With the split interface and LLDP detection, the standby link is **up but LACP is inactive** on it. With `fortilink` detection the standby link is down. Only one link forwards in either case.',
    lesson: '1.3-isl-split-mclag',
  },
  {
    id: 'd1-040',
    topic: '1.3',
    type: 'single',
    difficulty: 2,
    stem: 'Refer to the exhibit. A server is dual-homed to FSW-Core1 port10 and FSW-Core2 port10 with an LACP bond, but the MCLAG does not form. The ICL is up. What is the problem?',
    exhibit: `FSW-Core1 # show switch trunk srv1-mclag
config switch trunk
    edit "srv1-mclag"
        set mode lacp-active
        set mclag enable
        set members "port10"
    next
end

FSW-Core2 # show switch trunk srv1_mclag
config switch trunk
    edit "srv1_mclag"
        set mode lacp-active
        set mclag enable
        set members "port10"
    next
end`,
    options: [
      'The trunk names differ; an MCLAG trunk must have the same name on both peers',
      'An MCLAG trunk needs at least two members on each peer',
      'mode must be static on MCLAG trunks',
      'The members must use different port numbers on the two peers',
    ],
    answer: [0],
    explanation: 'When forming an MCLAG, the trunk **name must be the same** on each peer switch (`srv1-mclag` vs `srv1_mclag` here). Member port numbers may be the same or different, a single member per peer is valid, and LACP active is the normal mode.',
    lesson: '1.3-isl-split-mclag',
  },
  {
    id: 'd1-041',
    topic: '1.3',
    type: 'multi',
    difficulty: 2,
    stem: 'Which two statements about MCLAG split-brain detection are true? (Choose two.)',
    options: [
      'It is disabled by default',
      'It must be enabled on both MCLAG peer switches',
      'The peer with the highest mclag-split-brain-priority goes dormant',
      'It prevents either MCLAG peer from ever going down',
      'The dormant peer stays dormant after the ICL recovers until it is rebooted',
    ],
    answer: [0, 1],
    explanation: 'Split-brain detection is **off by default** and must be enabled with `mclag-split-brain-detect enable` on **both** peers. The **lowest** priority goes dormant. Fortinet notes that enabling it does not prevent either peer from going down; it makes one peer dormant so both do not forward independently. When ICL communication is re-established, the dormant peer becomes active again.',
    lesson: '1.3-isl-split-mclag',
  },
  {
    id: 'd1-042',
    topic: '1.3',
    type: 'single',
    difficulty: 2,
    stem: 'An administrator removes the MCLAG ICL between the two core switches that FGT-HQ connects to with its FortiLink aggregate. What else must be done on FGT-HQ?',
    options: [
      'Enable fortilink-split-interface on the FortiLink interface',
      'Set lacp-mode static on the FortiLink interface',
      'Delete and recreate the FortiLink interface',
      'Nothing; the FortiLink aggregate adapts automatically',
    ],
    answer: [0],
    explanation: 'The FortiLink Guide notes that if you disable the MCLAG ICL you need to **enable the FortiLink split interface** again. Without an MCLAG, the two core switches cannot form one LACP bundle with the FortiGate, so the split interface must keep one link active and the other standby.',
    lesson: '1.3-isl-split-mclag',
  },

  // ---------------------------------------------------------------- 1.4 Switching and routing
  {
    id: 'd1-043',
    topic: '1.4',
    type: 'single',
    difficulty: 2,
    stem: 'Refer to the exhibit. What is the effect of this configuration on managed FortiSwitch units?',
    exhibit: `config switch-controller global
    set mac-aging-interval 0
end`,
    options: [
      'Learned MAC addresses are aged out immediately, so all unicast traffic is flooded',
      'MAC address aging is disabled, so learned MAC addresses are not aged out',
      'The default aging time of 300 seconds is used',
      'MAC learning is disabled on all ports',
    ],
    answer: [1],
    explanation: '`mac-aging-interval` ranges from 10 to 1,000,000 seconds (default **300**); **0 disables aging**, so learned entries stay until they are removed for another reason. It does not disable learning itself (that is `l2-learning` on FortiSwitchOS physical ports).',
    lesson: '1.4-switching-routing',
  },
  {
    id: 'd1-044',
    topic: '1.4',
    type: 'single',
    difficulty: 2,
    stem: 'Refer to the exhibit. Two static MAC entries already exist for port3. How many additional MAC addresses can FSW-Access1 learn dynamically on port3?',
    exhibit: `config switch-controller managed-switch
    edit "S248EPTF18000101"
        config ports
            edit "port3"
                set learning-limit 10
            next
        end
    next
end`,
    options: [
      '8',
      '10',
      '12',
      '128',
    ],
    answer: [1],
    explanation: 'Static MAC addresses are **not counted** in the learning limit; the limit refers only to learned (dynamic) addresses. So 10 dynamic addresses can be learned on port3 in addition to the two static entries. The limit range is 1–128, with 0 meaning no limit.',
    lesson: '1.4-switching-routing',
  },
  {
    id: 'd1-045',
    topic: '1.4',
    type: 'single',
    difficulty: 2,
    stem: 'Sticky MAC is enabled on port7 of a managed switch. The learned MAC addresses survive the port going down and up, but they disappear after the switch reboots. What did the administrator miss?',
    options: [
      'Saving the persistent entries with execute switch-controller switch-action sticky-mac save',
      'Setting learning-limit 1 on the port',
      'Enabling mac-event-logging under switch-controller global',
      'Setting mac-aging-interval 0',
    ],
    answer: [0],
    explanation: 'Sticky MACs persist across link status changes, but by default they are **lost when the switch reboots**. To keep them, save them to the switch configuration with `execute switch-controller switch-action sticky-mac save {all | interface} <serial> [<port>]` (or delete unsaved ones with `delete-unsaved`). Learning limits, logging and aging do not make entries survive a reboot.',
    lesson: '1.4-switching-routing',
  },
  {
    id: 'd1-046',
    topic: '1.4',
    type: 'single',
    difficulty: 3,
    stem: 'Refer to the exhibit. port21 and port22 negotiate 1 Gbps and port23 negotiates 10 Gbps. Which ports actively carry traffic in the trunk?',
    exhibit: `config switch-controller managed-switch
    edit "S524DF4K15000104"
        config ports
            edit "srv-lag1"
                set type trunk
                set mode lacp-active
                set aggregator-mode bandwidth
                set members "port21" "port22" "port23"
            next
        end
    next
end`,
    options: [
      'port21, port22 and port23',
      'port21 and port22 only',
      'port23 only',
      'None, because LACP rejects members with different speeds',
    ],
    answer: [2],
    explanation: 'In LACP mode, ports with the same negotiated speed form an aggregator, and only **one** aggregator is used. With `aggregator-mode bandwidth` (the default) the aggregator with the **largest bandwidth** wins: port23 alone (10 Gbps) beats port21+port22 (2 Gbps). With `aggregator-mode count`, the two 1G ports would win.',
    lesson: '1.4-switching-routing',
  },
  {
    id: 'd1-047',
    topic: '1.4',
    type: 'multi',
    difficulty: 3,
    stem: 'Which two statements about LACP fallback mode on FortiSwitch trunks are true? (Choose two.)',
    options: [
      'The trunk must use lacp-active mode',
      'With lacp-speed fast, fallback starts 30 seconds after LACPDUs stop arriving',
      'On an MCLAG, fallback should be configured on both peer switches',
      'Fallback mode can be combined with min-bundle and max-bundle',
      'In fallback mode, all member ports forward until LACPDUs are received',
    ],
    answer: [0, 1],
    explanation: 'LACP fallback requires **lacp-active**; it starts after **30 s** without LACPDUs with `lacp-speed fast` (90 s with slow). Only the selected `fallback-port` stays up and all other members are blocked. Configure it on only **one** MCLAG peer (on both, `peer-consistency-check` reports a mismatch), and it cannot be used with min/max bundle or during an MCLAG split brain.',
    lesson: '1.4-switching-routing',
  },
  {
    id: 'd1-048',
    topic: '1.4',
    type: 'single',
    difficulty: 2,
    stem: 'Refer to the exhibit from a standalone FortiSwitch. Which statement about port2 is true?',
    exhibit: `config system interface
    edit "rvi-wan"
        set ip 192.0.2.2 255.255.255.252
        set allowaccess ping
        set type physical
        set l2-interface "port2"
    next
end`,
    options: [
      'port2 is a routed VLAN interface, so Layer 2 features such as DHCP snooping and 802.1X are not available on it',
      'port2 is a switch virtual interface for VLAN 4095 and still switches traffic for its native VLAN',
      'port2 stays up for routing even when the physical port is administratively down',
      'port2 can be added to an MCLAG trunk to provide redundant routing',
    ],
    answer: [0],
    explanation: '`set type physical` with `set l2-interface` creates a **routed VLAN interface (RVI)** — a routed port. Most Layer 2 features are disabled on RVIs, including 802.1X, DHCP snooping, DAI, IGMP snooping, STP guards, edge port, QinQ and MCLAG. All RVIs internally share VLAN 4095, but the port no longer switches a native VLAN, and the RVI goes down when its port is administratively down.',
    lesson: '1.4-switching-routing',
  },
  {
    id: 'd1-049',
    topic: '1.4',
    type: 'single',
    difficulty: 3,
    stem: 'Refer to the exhibit from a standalone FortiSwitch. The static route is not usable. Why?',
    exhibit: `config system interface
    edit "vlan10"
        set ip 10.10.10.2 255.255.255.0
        set vlanid 10
        set interface "internal"
    next
end
config router static
    edit 1
        set dst 0.0.0.0 0.0.0.0
        set gateway 10.10.99.1
        set device "vlan10"
    next
end`,
    options: [
      'The gateway is not in the same subnet as the device vlan10',
      'A default route cannot be configured on a FortiSwitch',
      'Static routes on FortiSwitch require an advanced features license',
      'device must be mgmt for any static route',
    ],
    answer: [0],
    explanation: 'When you configure a static route with a gateway, the **gateway must be in the same IP subnet as the device**. 10.10.99.1 is outside 10.10.10.0/24. Default routes are allowed (the mgmt example uses one), static routing does not need the advanced license (OSPF does), and `mgmt` is only one possible device.',
    lesson: '1.4-switching-routing',
  },
  {
    id: 'd1-050',
    topic: '1.4',
    type: 'single',
    difficulty: 2,
    stem: 'Hosts in vlan10-data and vlan20-voice are connected to the same managed FortiSwitch. Both VLAN interfaces are on FGT-HQ, and no routing offload is configured. The hosts cannot reach each other although ARP to their gateways works. What is the most likely cause?',
    options: [
      'There is no firewall policy on FGT-HQ allowing traffic between vlan10-data and vlan20-voice',
      'The FortiSwitch needs an SVI in each VLAN to route between them',
      'Inter-VLAN traffic requires an MCLAG',
      'STP is blocking the FortiLink port',
    ],
    answer: [0],
    explanation: 'In FortiLink mode the gateway of each VLAN is the **FortiGate VLAN interface**, so inter-VLAN traffic goes up the FortiLink, is routed by the FortiGate and must match a **firewall policy**. The switch does not need its own SVIs (that is only for routing offload or standalone mode). STP is not run between FortiGate and FortiSwitch in FortiLink mode.',
    lesson: '1.4-switching-routing',
  },
  {
    id: 'd1-051',
    topic: '1.4',
    type: 'multi',
    difficulty: 3,
    stem: 'Which two statements about inter-VLAN routing offload to managed FortiSwitch units are true? (Choose two.)',
    options: [
      'It requires an advanced features license',
      'Offloaded traffic between the VLANs is not inspected by the FortiGate',
      'switch-controller-offload-gw must be enabled on every offloaded VLAN interface',
      'It is applied to the supported FortiSwitch farthest from the FortiGate',
      'It is available starting in FortiOS 6.4.0',
    ],
    answer: [0, 1],
    explanation: 'Routing offload (FortiOS 7.4.1 with FortiSwitchOS 7.4.1) needs an **advanced features license** and is meant for **trusted** traffic that does not need FortiGate inspection. `switch-controller-offload-gw` is enabled on a **single** VLAN interface, whose FortiGate address becomes the switch\'s default route in vrf1. Offload is applied on the supported switch **closest** to the FortiGate.',
    lesson: '1.4-switching-routing',
  },
  {
    id: 'd1-052',
    topic: '1.4',
    type: 'single',
    difficulty: 2,
    stem: 'Refer to the exhibit. IGMP snooping is enabled on vlan10-data. A camera sends a multicast stream to a group that no host has joined. Where is the stream forwarded within the VLAN?',
    exhibit: `FGT-HQ # show switch-controller igmp-snooping
config switch-controller igmp-snooping
    set aging-time 300
    set flood-unknown-multicast disable
    set query-interval 125
end`,
    options: [
      'Only to mrouter ports',
      'To all ports in the VLAN',
      'Nowhere; it is dropped at the ingress port',
      'Only to the FortiLink port',
    ],
    answer: [0],
    explanation: 'With `flood-unknown-multicast disable` (the default), unregistered multicast is forwarded **only to mrouter ports**. Enabling it would flood unregistered multicast to all ports in the VLAN. `aging-time` (300 s) must be greater than `query-interval` (125 s).',
    lesson: '1.4-switching-routing',
  },
  {
    id: 'd1-053',
    topic: '1.4',
    type: 'fill',
    difficulty: 1,
    stem: 'What is the default MAC address aging interval, in seconds, on managed FortiSwitch units? (Enter a number.)',
    answer: ['300'],
    explanation: '`mac-aging-interval` defaults to **300 seconds** (range 10–1,000,000; 0 disables aging), under `config switch-controller global` on the FortiGate or `config switch global` on FortiSwitchOS. Cisco engineers will recognise the same default as `mac address-table aging-time`.',
    lesson: '1.4-switching-routing',
  },
  {
    id: 'd1-054',
    topic: '1.4',
    type: 'single',
    difficulty: 1,
    stem: 'An administrator wants to run OSPF on a standalone FortiSwitch. What is required besides a model that supports it?',
    options: [
      'An advanced features license',
      'FortiLink mode with a FortiGate acting as the ABR',
      'An MCLAG peer',
      'A FortiGuard routing subscription',
    ],
    answer: [0],
    explanation: 'The FortiSwitchOS guide states that an **advanced features license** is required to use OSPF routing. Standalone routing does not depend on FortiLink, MCLAG or a FortiGuard subscription. (Inter-VLAN routing offload in FortiLink mode also needs the advanced features license.)',
    lesson: '1.4-switching-routing',
  },
  {
    id: 'd1-055',
    topic: '1.4',
    type: 'match',
    difficulty: 2,
    stem: 'Match each trunk setting with its behaviour.',
    pairs: [
      ['mode static', 'No LACPDUs are sent and received LACPDUs are ignored'],
      ['mode lacp-active', 'Actively initiates LACP negotiation'],
      ['aggregator-mode bandwidth', 'Uses the aggregator with the largest total bandwidth'],
      ['aggregator-mode count', 'Uses the aggregator with the most member ports'],
      ['lacp-speed fast', 'Sends LACPDUs every second'],
    ],
    explanation: '`static` aggregates without LACP; `lacp-passive` responds to LACP; `lacp-active` initiates it. When members negotiate different speeds, `aggregator-mode` picks the aggregator by bandwidth (default) or port count. `lacp-speed` is `slow` (every 30 s, default) or `fast` (every second).',
    lesson: '1.4-switching-routing',
  },

  // ---------------------------------------------------------------- 1.5 STP
  {
    id: 'd1-056',
    topic: '1.5',
    type: 'single',
    difficulty: 3,
    stem: 'Refer to the exhibit. FSW-Access3 is cabled to two third-party distribution switches through port49 and port50. Why is port50 discarding?',
    exhibit: `FGT-HQ # diagnose switch-controller switch-info stp S124EN5918000103 0
MST Instance Information, primary-Channel:
Instance ID :   0
Switch Priority : 32768
Root MAC Address :    704ca5e10001
Root Priority:    4096
Root Pathcost:    2000
Regional Root MAC Address :   704ca5e10001
Regional Root Priority:   4096
Regional Root Path Cost:  2000
Remaining Hops:       19
This Bridge MAC Address :    704ca5e10377
Port               Speed   Cost       Priority   Role         State       Edge  STP-Status  Loop Protection
________________   ______  _________  _________  ___________  __________  ____  __________  ________
port1              1G      20000      128        DESIGNATED   FORWARDING   YES    ENABLED        NO
port2              1G      20000      128        DESIGNATED   FORWARDING   YES    ENABLED        NO
port49             10G     2000       128        ROOT         FORWARDING   NO     ENABLED        NO
port50             10G     2000       128        ALTERNATE    DISCARDING   NO     ENABLED        NO
(output truncated)`,
    options: [
      'port50 is an alternate path to the root bridge; port49 was selected as the root port',
      'BPDU guard has shut port50 because it received a BPDU',
      'Root guard blocked port50 because it received a superior BPDU',
      'port50 is a backup port because port49 and port50 connect to the same segment',
    ],
    answer: [0],
    explanation: 'FSW-Access3 is not the root (root priority 4096, different root MAC). It has two equal-cost paths to the root; port49 won the root-port election and port50 is an **alternate** port, which is discarding — normal RSTP/MSTP behaviour. BPDU guard only acts on edge ports (both uplinks show Edge NO). Root guard is not shown, and a backup role is for two ports of the same switch on one segment; here they go to two different switches.',
    lesson: '1.5-stp-loop-protection',
  },
  {
    id: 'd1-057',
    topic: '1.5',
    type: 'single',
    difficulty: 2,
    stem: 'Refer to the exhibit. A user connects a small switch that sends BPDUs to port12, but port12 is not shut down. Why?',
    exhibit: `config switch-controller managed-switch
    edit "S248EPTF18000102"
        config ports
            edit "port12"
                set stp-state enabled
                set edge-port disable
                set stp-bpdu-guard enabled
                set stp-bpdu-guard-timeout 10
            next
        end
    next
end`,
    options: [
      'BPDU guard only works on edge ports, and port12 is not an edge port',
      'stp-bpdu-guard-timeout must be 0 for the port to shut down',
      'STP must be disabled on the port for BPDU guard to act',
      'Root guard must also be enabled',
    ],
    answer: [0],
    explanation: 'BPDU guard has two prerequisites: the port must be an **edge port** and **STP must be enabled** on it. With `edge-port disable`, BPDUs are processed normally. The timeout only sets how long the port stays down (default 5 minutes, max 120). Root guard is a separate feature.',
    lesson: '1.5-stp-loop-protection',
  },
  {
    id: 'd1-058',
    topic: '1.5',
    type: 'single',
    difficulty: 2,
    stem: 'STP root guard is enabled on port48 of FSW-Access2. A newly connected switch on port48 advertises a better bridge priority than the current root. What happens?',
    options: [
      'The superior BPDUs are ignored or dropped, so port48 cannot become the path to the root',
      'port48 is shut down for five minutes',
      'The new switch becomes root, and port48 becomes the root port',
      'FortiLink goes down until the new switch is authorized',
    ],
    answer: [0],
    explanation: 'Root guard protects the port from becoming the path to root: **superior BPDUs received on it are ignored or dropped**. It does not shut the port down like BPDU guard. Enable it on ports that must never lead to the root and never on the root port.',
    lesson: '1.5-stp-loop-protection',
  },
  {
    id: 'd1-059',
    topic: '1.5',
    type: 'multi',
    difficulty: 2,
    stem: 'Which two statements describe STP defaults and support in FortiLink mode? (Choose two.)',
    options: [
      'STP is not supported between the FortiGate and a FortiSwitch in FortiLink mode',
      'STP is enabled by default on the non-FortiLink ports of managed switches',
      'Loop guard is enabled by default on all ports',
      'BPDU guard is enabled by default on edge ports',
      'Root guard is enabled by default on ports facing third-party switches',
    ],
    answer: [0, 1],
    explanation: 'STP runs on the managed switches (enabled by default on non-FortiLink ports) but **not between FortiGate and FortiSwitch**; the FortiLink port shows STP disabled in switch output. Loop guard, BPDU guard and root guard are all **disabled** by default.',
    lesson: '1.5-stp-loop-protection',
  },
  {
    id: 'd1-060',
    topic: '1.5',
    type: 'single',
    difficulty: 2,
    stem: 'Refer to the exhibit. The administrator then changes hello-time to 1 under config switch-controller stp-settings. Which switches use the new hello time?',
    exhibit: `config switch-controller managed-switch
    edit "S524DF4K15000104"
        set name "FSW-Core1"
        config stp-settings
            set local-override enable
            set hello-time 2
        end
    next
    edit "S248EPTF18000101"
        set name "FSW-Access1"
    next
end`,
    options: [
      'All managed switches, because global settings always win',
      'All managed switches except FSW-Core1, which keeps its local STP settings',
      'Only FSW-Core1, because it is the only switch with an stp-settings block',
      'None until each switch is rebooted',
    ],
    answer: [1],
    explanation: '`config switch-controller stp-settings` applies to all managed switches, except where a switch has `config stp-settings` → `set local-override enable`, which makes its local STP values override the global ones. FSW-Core1 keeps hello-time 2; the others take the new global value.',
    lesson: '1.5-stp-loop-protection',
  },
  {
    id: 'd1-061',
    topic: '1.5',
    type: 'single',
    difficulty: 2,
    stem: 'Refer to the exhibit. All other managed switches use default MSTP priorities. Which switch is the root bridge for MST instance 1?',
    exhibit: `config switch-controller stp-instance
    edit "1"
        config vlan-range "vlan10-data" "vlan20-voice"
    next
end
config switch-controller managed-switch
    edit "S524DF4K15000104"
        set name "FSW-Core1"
        config stp-instance
            edit "1"
                set priority 8192
            next
        end
    next
    edit "S524DF4K15000105"
        set name "FSW-Core2"
        config stp-instance
            edit "1"
                set priority 4096
            next
        end
    next
end`,
    options: [
      'FSW-Core1',
      'FSW-Core2',
      'The switch with the lowest MAC address among those using 32768',
      'FGT-HQ, because the FortiGate is always the STP root in FortiLink mode',
    ],
    answer: [1],
    explanation: 'The lowest bridge ID wins, and priority is compared first: FSW-Core2 (4096) beats FSW-Core1 (8192) and the default 32768 of the other switches. Priorities are per switch per instance in steps of 4096. The FortiGate does not take part in STP with FortiLink switches.',
    lesson: '1.5-stp-loop-protection',
  },
  {
    id: 'd1-062',
    topic: '1.5',
    type: 'fill',
    difficulty: 1,
    stem: 'MSTP bridge priorities on FortiSwitch must be multiples of which number? (Enter a number.)',
    answer: ['4096'],
    explanation: 'Valid priorities are 0, 4096, 8192 … 61440 — steps of **4096** (the low 12 bits of the bridge ID carry the instance/system ID). The default is 32768.',
    lesson: '1.5-stp-loop-protection',
  },
  {
    id: 'd1-063',
    topic: '1.5',
    type: 'single',
    difficulty: 2,
    stem: 'How does Fortinet loop guard detect a loop on a FortiSwitch port?',
    options: [
      'The port periodically sends loop guard data packets (LGDP); if the port receives its own packet back, a loop exists downstream',
      'The port stops receiving BPDUs while in the alternate role',
      'The port receives a BPDU while configured as an edge port',
      'The port receives a superior BPDU from a downstream switch',
    ],
    answer: [0],
    explanation: 'Loop guard sends **LGDP** packets; receiving one back on the sending port means there is a loop in the subtending network, and the port is taken out of service. Losing BPDUs on an alternate port is what **STP loop protection** guards against; a BPDU on an edge port triggers **BPDU guard**; a superior BPDU is what **root guard** drops.',
    lesson: '1.5-stp-loop-protection',
  },
  {
    id: 'd1-064',
    topic: '1.5',
    type: 'single',
    difficulty: 3,
    stem: 'A unidirectional fibre fault means an alternate port on a standalone FortiSwitch stops receiving BPDUs. Which FortiSwitchOS feature keeps that port in the blocking state instead of letting it become designated and forward?',
    options: [
      'set stp-loop-protection enabled',
      'set loop-guard enabled',
      'set stp-root-guard enabled',
      'set edge-port enabled',
    ],
    answer: [0],
    explanation: '**STP loop protection** forces a port to remain blocking even if it stops receiving BPDUs — the same idea as Cisco Loop Guard. Fortinet\'s separately named **loop guard** (`loop-guard`) detects downstream loops with LGDP packets. Root guard drops superior BPDUs, and edge port makes the port forward immediately, which is the opposite of what is wanted.',
    lesson: '1.5-stp-loop-protection',
  },
  {
    id: 'd1-065',
    topic: '1.5',
    type: 'single',
    difficulty: 2,
    stem: 'Refer to the exhibit. Loop guard detects a loop on port20. What happens to port20?',
    exhibit: `config switch-controller managed-switch
    edit "S248EPTF18000101"
        config ports
            edit "port20"
                set loop-guard enabled
                set loop-guard-timeout 0
            next
        end
    next
end`,
    options: [
      'It is taken out of service and stays down until an administrator resets it',
      'It is taken out of service for the default 45 minutes',
      'It keeps forwarding and only logs the loop, because the timeout is 0',
      'It is moved to the quarantine VLAN',
    ],
    answer: [0],
    explanation: 'When loop guard detects a loop, the port is taken out of service for `loop-guard-timeout` minutes (0–120, default 45). A value of **0 means the port must be reset manually**, for example with `execute switch-controller switch-action loop-guard reset <serial> <port>`.',
    lesson: '1.5-stp-loop-protection',
  },
  {
    id: 'd1-066',
    topic: '1.5',
    type: 'single',
    difficulty: 3,
    stem: 'Refer to the exhibit. The CIST root is FSW-Core1 inside the MSTP region. port1 of FSW-Core1 connects to a Rapid PVST+ switch. After the change, port1 is flagged IC and goes to Discarding. Why?',
    exhibit: `FSW-Core1 (MSTP region, CIST root): instance 0 priority 4096
FSW-Core1 port1: rpvst-port enabled, allowed VLANs 10,20

Rapid PVST+ switch (connected to port1):
  VLAN 1  bridge priority 32768
  VLAN 10 bridge priority 32768
  VLAN 20 bridge priority 0        <- changed today`,
    options: [
      'With the CIST root in the MSTP region, RPVST+ VLANs other than VLAN 1 must have worse (higher) priority than the CIST root, and VLAN 20 now has a better one',
      'With the CIST root in the MSTP region, VLAN 1 in the RPVST+ domain must have priority 0',
      'RPVST+ interoperation supports only VLAN 1, so VLAN 20 must be removed from port1',
      'The RPVST+ switch must be placed in the same MST region name',
    ],
    answer: [0],
    explanation: 'When the CIST root is inside the MSTP region, the boundary switch sends one BPDU per VLAN based on instance 0, and every RPVST+ VLAN other than VLAN 1 must have a bridge priority **numerically higher** than the CIST root (4096). VLAN 20 with priority 0 violates the rule, so the port is flagged **IC** (inconsistent) and discards. An **MV** flag would indicate a VLAN range mismatch instead.',
    lesson: '1.5-stp-loop-protection',
  },
  {
    id: 'd1-067',
    topic: '1.5',
    type: 'multi',
    difficulty: 3,
    stem: 'Which two statements about FortiSwitch interoperation with Rapid PVST+ are true? (Choose two.)',
    options: [
      'If the CIST root is in the RPVST+ domain, the boundary FortiSwitch processes only the VLAN 1 BPDUs for the topology',
      'Interoperation is disabled by default and is enabled per port with rpvst-port',
      'The FortiSwitch converts its whole region to Rapid PVST+ when an RPVST+ BPDU is received',
      'If the CIST root is in the RPVST+ domain, VLAN 1 must have the best root priority of all VLANs',
      'RPVST+ ports must be edge ports',
    ],
    answer: [0, 1],
    explanation: 'With the CIST root in the RPVST+ domain, the boundary FortiSwitch uses only VLAN 1 information; other VLAN BPDUs are just consistency checks, and those VLANs\' root priorities must be **better** (numerically lower) than VLAN 1\'s — so VLAN 1 must not be the best. `rpvst-port` is disabled by default. The region keeps running MSTP, and boundary ports are not edge ports.',
    lesson: '1.5-stp-loop-protection',
  },
  {
    id: 'd1-068',
    topic: '1.5',
    type: 'match',
    difficulty: 2,
    stem: 'Match each FortiSwitch protection feature with what triggers it or what it does.',
    pairs: [
      ['BPDU guard', 'Shuts an edge port when any BPDU is received'],
      ['Root guard', 'Drops superior BPDUs so the port cannot lead to the root'],
      ['Loop guard', 'Shuts the port when its own LGDP packet returns'],
      ['STP loop protection', 'Keeps a blocking port blocked when BPDUs stop arriving'],
      ['Edge port', 'Moves the port straight to forwarding'],
    ],
    explanation: 'BPDU guard enforces the network edge; root guard enforces root placement; Fortinet loop guard detects downstream loops with LGDP; STP loop protection (like Cisco Loop Guard) stops BPDU-starved blocking ports from forwarding; edge port is the PortFast equivalent.',
    lesson: '1.5-stp-loop-protection',
  },
  {
    id: 'd1-069',
    topic: '1.5',
    type: 'single',
    difficulty: 2,
    stem: 'A managed-switch edge port with BPDU guard enabled and the default timeout receives a BPDU. What happens?',
    options: [
      'The port goes down and comes back automatically after 5 minutes',
      'The port goes down permanently until an administrator resets it',
      'The port stays up but discards the BPDU',
      'The port goes down for 45 minutes',
    ],
    answer: [0],
    explanation: 'BPDU guard shuts the edge port for the configured timeout, **default 5 minutes** (0–120), then the port recovers by itself — unlike Cisco\'s default err-disable behaviour. You can reset it earlier with `execute switch-controller switch-action bpdu-guard reset <serial> <port>`. 45 minutes is the loop guard default.',
    lesson: '1.5-stp-loop-protection',
  },

  // ---------------------------------------------------------------- 1.6 Ports
  {
    id: 'd1-070',
    topic: '1.6',
    type: 'single',
    difficulty: 2,
    stem: 'Refer to the exhibit. port7 changes state six times in 20 seconds. What happens?',
    exhibit: `config switch-controller managed-switch
    edit "S248EPTF18000102"
        config ports
            edit "port7"
                set flapguard enable
                set flap-rate 5
                set flap-duration 30
                set flap-timeout 0
            next
        end
    next
end`,
    options: [
      'Flap guard shuts down port7, and it stays down until it is reset, for example with execute switch-controller flapguard reset',
      'Flap guard shuts down port7 for 30 minutes',
      'Nothing, because flap-timeout 0 disables flap guard',
      'Flap guard logs the event but leaves port7 up, because the window is 30 seconds',
    ],
    answer: [0],
    explanation: 'Six changes within the 30-second `flap-duration` exceed `flap-rate` 5, so flap guard shuts the port. `flap-timeout` (0–120 minutes) sets when the port is automatically reset; **0 means no timeout**, so the port stays down until an administrator resets it (`execute switch-controller flapguard reset <serial> <port>` or the GUI).',
    lesson: '1.6-ports-poe-split-transceivers',
  },
  {
    id: 'd1-071',
    topic: '1.6',
    type: 'single',
    difficulty: 2,
    stem: 'Refer to the exhibit. The administrator wants to connect a 10GBASE-T server NIC to port18. What does the output show?',
    exhibit: `FGT-HQ # diagnose switch-controller switch-info port-properties S524DF4K15000104 port18
Vdom: root
Switch: S524DF4K15000104
Port: port18
        PoE           : 802.3af/at,30.0W
        Connector     : RJ45
        Speed         : 10Mhalf/10Mfull/100Mhalf/100Mfull/1Gauto/auto`,
    options: [
      'port18 cannot run at 10 Gbps; its fastest speed is 1 Gbps',
      'port18 will autonegotiate 10 Gbps with the NIC',
      'port18 needs set speed 10000full to reach 10 Gbps',
      'port18 is a fibre port and needs an SFP+ module',
    ],
    answer: [0],
    explanation: '`port-properties` lists what the port hardware supports: an RJ45 connector with speeds up to 1 Gbps and PoE (802.3af/at, 30 W). 10G is not among the supported speeds, so neither autonegotiation nor `set speed 10000full` will give 10 Gbps. The connector is RJ45, not fibre.',
    lesson: '1.6-ports-poe-split-transceivers',
  },
  {
    id: 'd1-072',
    topic: '1.6',
    type: 'single',
    difficulty: 2,
    stem: 'A PoE FortiSwitch runs short of power budget. Ports are configured with critical, high and low PoE priority. Which ports lose power first?',
    options: [
      'Ports with low priority',
      'Ports with critical priority',
      'The highest-numbered ports, regardless of priority',
      'Ports that negotiated 802.3at',
    ],
    answer: [0],
    explanation: 'When there is not enough power, power is allotted first to **critical**, then **high**, then **medium** (on models that support it), then **low** priority ports. Low-priority ports are therefore the first to be left without power. `poe-port-priority` defaults to low.',
    lesson: '1.6-ports-poe-split-transceivers',
  },
  {
    id: 'd1-073',
    topic: '1.6',
    type: 'order',
    difficulty: 2,
    stem: 'FGT-HQ runs FortiOS 7.6. A new FS-524D must have its 40G port29 split into four 10G ports. Put the steps in order.',
    items: [
      'Discover the FortiSwitch unit on the FortiGate',
      'Authorize the FortiSwitch unit',
      'On the FortiSwitch, configure the split with config switch phy-mode',
      'Restart the FortiSwitch unit',
      'The FortiGate automatically updates the managed-switch port list',
    ],
    explanation: 'For a new switch with FortiOS/FortiSwitchOS 7.2.0 or later: discover, authorize, configure the split on the switch with `config switch phy-mode`, then restart — a restart is required to update the port list. Since 7.2.0 the FortiGate updates the port list automatically; before 7.2.0 you had to delete, rediscover and reauthorize the switch.',
    lesson: '1.6-ports-poe-split-transceivers',
  },
  {
    id: 'd1-074',
    topic: '1.6',
    type: 'single',
    difficulty: 3,
    stem: 'Refer to the exhibit. On an FS-524D, port29 is a 40G QSFP+ port that is documented as splittable into 4 x 10G. Which statement is true?',
    exhibit: `FSW-Core1 # config switch phy-mode
FSW-Core1 (phy-mode) # set port29-phy-mode ?`,
    options: [
      '4x10G is the correct mode; 4x25G and 2x50G apply only to 100G QSFP ports',
      '4x25G is the correct mode, because 4 x 25G fits within a 100G breakout cable',
      '2x50G is the correct mode, because it keeps the most bandwidth',
      'single-port must be selected first and then the subports created under config switch physical-port',
    ],
    answer: [0],
    explanation: '`4x25G` and `2x50G` are for **100G** QSFP ports only; `4x10G` and `4x1G` work on 40G or 100G QSFP ports. A 40G QSFP+ port is split as 4 x 10G, producing port29.1 to port29.4 after the required restart. `single-port` means not split.',
    lesson: '1.6-ports-poe-split-transceivers',
  },
  {
    id: 'd1-075',
    topic: '1.6',
    type: 'single',
    difficulty: 2,
    stem: 'A 100G port on a managed FS-3032E must use RS-FEC to match the peer. Which fec-state value should be configured on the port?',
    options: [
      'cl91',
      'cl74',
      'detect-by-module',
      'disabled',
    ],
    answer: [0],
    explanation: '`cl91` enables Clause 91 RS-FEC, which applies to **100G** ports. `cl74` is the Clause 74 option for **25G** ports. `detect-by-module` (the default on FEC-capable ports) lets the transceiver decide, which does not guarantee a match with the peer\'s requirement.',
    lesson: '1.6-ports-poe-split-transceivers',
  },
  {
    id: 'd1-076',
    topic: '1.6',
    type: 'fill',
    difficulty: 2,
    stem: 'A user access port must never accept 802.1Q-tagged frames, to prevent VLAN hopping. Complete the managed-switch port command: set discard-mode ________',
    answer: ['all-tagged'],
    explanation: '`discard-mode all-tagged` discards tagged frames and lets only untagged frames enter. `all-untagged` discards untagged frames, and `none` (default) accepts both.',
    lesson: '1.6-ports-poe-split-transceivers',
  },
  {
    id: 'd1-077',
    topic: '1.6',
    type: 'single',
    difficulty: 3,
    stem: 'Refer to the exhibit. port25 on FSW-Core1 is down. The far-end switch reports its own optic as healthy. Based on the output, what is the most likely problem?',
    exhibit: `FSW-Core1 # get switch modules status port25
____________________________________________________________
Port(port25)
temperature      31.210938 C
voltage          3.301200 volts
alarm_flags[0]   0x0000
warning_flags[0] 0x0000
laser_bias[0]    6.120000 mAmps
tx_power[0]      -2.410251 dBm
rx_power[0]      -38.239087 dBm
options          0x000F ( TX_DISABLE TX_FAULT RX_LOSS TX_POWER_LEVEL1 )`,
    options: [
      'Almost no light is being received, which points to the fibre path or the far end transmitter, not the local optic',
      'The local optic is overheating',
      'The local optic is not transmitting',
      'The module supply voltage is too low',
    ],
    answer: [0],
    explanation: 'DMI `status` shows temperature (31 °C, about 88 °F), supply voltage (3.3 V) and laser bias in a normal range, and TX power of about -2.4 dBm, so the local transmitter works. RX power of about -38 dBm means essentially no light arrives: check the fibre (dirty or broken connector, wrong strand) and the far-end transmitter.',
    lesson: '1.6-ports-poe-split-transceivers',
  },
  {
    id: 'd1-078',
    topic: '1.6',
    type: 'multi',
    difficulty: 2,
    stem: 'Which two statements about PoE on managed FortiSwitch units are true? (Choose two.)',
    options: [
      'PoE pre-standard detection is disabled by default',
      'On some FortiSwitch models pre-standard detection is a per-switch (global) setting rather than a per-port setting',
      'poe-status is disabled by default on PoE ports',
      'The default poe-port-priority is critical',
      'Medium priority is available on all PoE models',
    ],
    answer: [0, 1],
    explanation: 'Since FortiOS 6.4.5 the factory default for `poe-pre-standard-detection` is **disable**, and on models such as FS-548D-FPOE, FS-524D-FPOE, FS-224D-POE, FS-124E-POE/FPOE and FS-148F-POE/FPOE it is set **globally** for the switch; other models set it per port. `poe-status` is enabled by default, the default priority is **low**, and medium priority exists only on some models.',
    lesson: '1.6-ports-poe-split-transceivers',
  },
  {
    id: 'd1-079',
    topic: '1.6',
    type: 'single',
    difficulty: 2,
    stem: 'An SFP+ port on a standalone FortiSwitch is set to speed auto-module. What does the switch do?',
    options: [
      'Reads the inserted module and sets the port to the maximum speed the module advertises',
      'Autonegotiates speed and duplex with the link partner using 10GBASE-T',
      'Enables forward error correction according to the module',
      'Splits the port into subports according to the module type',
    ],
    answer: [0],
    explanation: 'With **auto-module**, the system reads information from the module and sets the port speed to the maximum the module advertises (logging the speed it chose). It is supported on 1/10G ports, not on higher-speed ports such as 40G. FEC selection by module is `fec-state detect-by-module`, and splitting is `phy-mode`.',
    lesson: '1.6-ports-poe-split-transceivers',
  },
  {
    id: 'd1-080',
    topic: '1.6',
    type: 'match',
    difficulty: 2,
    stem: 'Match each phy-mode value with its meaning.',
    pairs: [
      ['single-port', 'Use the port at full speed without splitting it'],
      ['4x25G', 'Four 25G subports, 100G QSFP28 only'],
      ['4x10G', 'Four 10G subports, 40G or 100G QSFP'],
      ['2x50G', 'Two 50G subports, 100G QSFP only'],
    ],
    explanation: 'Split modes depend on the base port: 4x25G and 2x50G need a 100G port, while 4x10G and 4x1G work on 40G or 100G QSFP ports. `single-port` leaves the port unsplit. Changing phy-mode requires a switch restart.',
    lesson: '1.6-ports-poe-split-transceivers',
  },
];
