// Domain 3 — Layer 2 control and security: question bank (FortiOS 7.6 / FortiSwitchOS 7.6).
// Original exam-style items (not brain-dump material). Options are shuffled by the app.
export default [
  // ---------------------------------------------------------------- 3.1
  {
    id: 'd3-001',
    topic: '3.1',
    type: 'single',
    difficulty: 2,
    stem: 'Refer to the exhibit. port5 of FSW-Access1 uses this policy. An IP phone with an 802.1X supplicant is connected to port5, and a PC without a supplicant is daisy-chained behind the phone. After the phone authenticates, the PC also has network access. Why?',
    exhibit: `FGT-HQ # show full-configuration switch-controller security-policy 802-1X corp-dot1x
config switch-controller security-policy 802-1X
    edit "corp-dot1x"
        set security-mode 802.1X
        set user-group "RADIUS-Users"
        set mac-auth-bypass disable
        set guest-vlan disable
        set auth-fail-vlan disable
        ...
    next
end`,
    options: [
      'The policy uses port-based 802.1X, so one successful authentication opens the port for every device on it; `802.1X-mac-based` would authenticate each device.',
      'MAC authentication bypass is authorizing the PC with its MAC address.',
      'The PC was placed in the guest VLAN because it sent no EAPOL frames.',
      'The phone forwards its EAP credentials on behalf of the PC through EAP pass-through.',
    ],
    answer: [0],
    explanation: "`security-mode 802.1X` is **port-based**: the port is authorized as a whole once a device authenticates, so the PC behind the phone rides on the phone's session. `802.1X-mac-based` authenticates each MAC separately (up to 20 devices per port) and is the mode Fortinet recommends when several devices share a port.\n\n- MAB, the guest VLAN and the auth-fail VLAN are all disabled in this policy.\n- EAP pass-through doesn't authenticate the PC with the phone's credentials.",
    lesson: '3.1-8021x-security-policies',
  },
  {
    id: 'd3-002',
    topic: '3.1',
    type: 'single',
    difficulty: 2,
    stem: 'Refer to the exhibit. Network printers without an 802.1X supplicant end up in the guest VLAN. The administrator wants them placed in vlan10-data based on their MAC addresses, which are already registered on the RADIUS server. What should the administrator change in the policy?',
    exhibit: `FGT-HQ # show switch-controller security-policy 802-1X corp-dot1x
config switch-controller security-policy 802-1X
    edit "corp-dot1x"
        set security-mode 802.1X-mac-based
        set user-group "RADIUS-Users"
        set guest-vlan enable
        set guest-vlan-id "vlan30-guest"
        set guest-auth-delay 30
    next
end`,
    options: [
      'Enable `mac-auth-bypass`.',
      'Enable `auth-fail-vlan` with `auth-fail-vlan-id "vlan10-data"`.',
      'Enable `radius-timeout-overwrite`.',
      'Change `security-mode` to `802.1X`.',
    ],
    answer: [0],
    explanation: "**MAC authentication bypass** (`mac-auth-bypass`, disabled by default) sends the device's MAC address as the RADIUS user name and password, so registered printers can be authorized (and assigned a VLAN) without a supplicant.\n\n- The auth-fail VLAN is for devices whose authentication **fails**; using vlan10-data for that would also admit anyone with bad credentials.\n- `radius-timeout-overwrite` lets the RADIUS Session-Timeout override the local timer.\n- Port-based mode wouldn't authenticate devices that have no supplicant.",
    lesson: '3.1-8021x-security-policies',
  },
  {
    id: 'd3-003',
    topic: '3.1',
    type: 'match',
    difficulty: 2,
    stem: 'Match each condition on an 802.1X port with the security-policy feature that handles it.',
    pairs: [
      ['The device sends no 802.1X response', 'Guest VLAN'],
      ['The RADIUS server rejects the credentials', 'Auth-fail VLAN'],
      ['The RADIUS server does not answer', 'RADIUS (authserver) timeout VLAN'],
      ['RADIUS returns Tunnel-Private-Group-Id', 'Dynamic VLAN assignment'],
    ],
    explanation: "Guest VLAN (`guest-vlan`, with `guest-auth-delay`) catches devices that don't do 802.1X; the auth-fail VLAN catches failed authentications; `authserver-timeout-vlan` keeps users working when RADIUS is unreachable; Tunnel-Private-Group-Id (VLAN ID or name) assigns a VLAN dynamically.",
    lesson: '3.1-8021x-security-policies',
  },
  {
    id: 'd3-004',
    topic: '3.1',
    type: 'single',
    difficulty: 2,
    stem: 'During a RADIUS outage, all 802.1X users on managed FortiSwitch ports lose access. The administrator wants authenticated-port users placed in vlan10-data whenever the RADIUS server stops responding. Which security-policy settings provide this?',
    options: [
      '`set authserver-timeout-vlan enable` and `set authserver-timeout-vlanid "vlan10-data"`',
      '`set auth-fail-vlan enable` and `set auth-fail-vlan-id "vlan10-data"`',
      '`set guest-vlan enable` and `set guest-vlan-id "vlan10-data"`',
      '`set radius-timeout-overwrite enable`',
    ],
    answer: [0],
    explanation: "The **authserver timeout VLAN** is used when RADIUS doesn't respond within `authserver-timeout-period` (3–15 s, default 3). It is disabled by default.\n\n- The auth-fail VLAN is for rejected credentials, not a silent server.\n- The guest VLAN is for devices without 802.1X.\n- `radius-timeout-overwrite` concerns the RADIUS Session-Timeout attribute.",
    lesson: '3.1-8021x-security-policies',
  },
  {
    id: 'd3-005',
    topic: '3.1',
    type: 'multi',
    difficulty: 2,
    stem: 'Which two values are defaults in `config switch-controller 802-1X-settings`? (Choose two.)',
    options: [
      '`reauth-period` is 60 minutes.',
      '`max-reauth-attempt` is 3.',
      '`tx-period` is 60 seconds.',
      '`link-down-auth` is `no-action`.',
      '`mab-reauth` is enabled.',
    ],
    answer: [0, 1],
    explanation: "Defaults: `reauth-period` **60** minutes (1–1440), `max-reauth-attempt` **3** (1–15), `tx-period` **30** s (4–60), `link-down-auth` **`set-unauth`** (the port must reauthenticate after link loss) and `mab-reauth` **disabled**. A switch can override them with `config 802-1X-settings` → `set local-override enable`.",
    lesson: '3.1-8021x-security-policies',
  },
  {
    id: 'd3-006',
    topic: '3.1',
    type: 'single',
    difficulty: 3,
    stem: 'Refer to the exhibit. An 802.1X security policy using RADIUS server 10.10.99.20 (on vlan99-mgmt) is applied to the access ports of FSW-Access1. Every authentication attempt times out, and the RADIUS server logs no requests. What should the administrator do?',
    exhibit: `FGT-HQ # show firewall policy
config firewall policy
    edit 1
        set name "Data-to-Internet"
        set srcintf "vlan10-data"
        set dstintf "wan1"
        set action accept
        set srcaddr "all"
        set dstaddr "all"
        set schedule "always"
        set service "ALL"
        set nat enable
    next
end`,
    options: [
      'Add a firewall policy that allows RADIUS traffic from the FortiLink interface to the RADIUS server on vlan99-mgmt.',
      'Enable `radius-timeout-overwrite` in the security policy.',
      'Increase `tx-period` in `config switch-controller 802-1X-settings`.',
      'Enable `mac-auth-bypass` so the switch stops sending EAP to RADIUS.',
    ],
    answer: [0],
    explanation: "Fortinet notes that in FortiLink mode you must create a **firewall policy allowing RADIUS traffic from the FortiLink interface to the RADIUS server**. The only policy here is vlan10-data → wan1, so the switch's RADIUS requests to 10.10.99.20 hit the implicit deny — which matches \"no requests logged\".\n\n- The timeout and tx-period settings change timers, not reachability.\n- MAB still uses RADIUS.",
    lesson: '3.1-8021x-security-policies',
  },
  {
    id: 'd3-007',
    topic: '3.1',
    type: 'fill',
    difficulty: 1,
    stem: 'What is the maximum number of devices (MAC sessions) that MAC-based 802.1X supports on one FortiSwitch port? (Enter the number.)',
    answer: ['20'],
    explanation: "**20** MAC sessions per port on all FortiSwitch models; the per-switch total depends on the model.",
    lesson: '3.1-8021x-security-policies',
  },
  {
    id: 'd3-008',
    topic: '3.1',
    type: 'single',
    difficulty: 2,
    stem: 'On FortiOS 7.6, an administrator wants ports that support both methods to try MAC authentication bypass first and fall back to 802.1X. Which `auth-priority` value is required?',
    options: [
      '`mab-dot1x`',
      '`dot1x-mab`',
      '`legacy`',
      '`mab`',
    ],
    answer: [0],
    explanation: "FortiOS 7.6.0 added `auth-priority`: `legacy` (default after upgrade — EAP first, no delay), `dot1x-mab` (802.1X then MAB) and **`mab-dot1x`** (MAB then 802.1X). `mab` is a value of `auth-order` for **MAB-only** authentication, where no EAP is sent at all.",
    lesson: '3.1-8021x-security-policies',
  },
  {
    id: 'd3-009',
    topic: '3.1',
    type: 'single',
    difficulty: 2,
    stem: 'The RADIUS server returns `Tunnel-Private-Group-Id = "voice"` for IP phones authenticated on managed FortiSwitch ports. How does the FortiGate decide which VLAN the phone gets?',
    options: [
      'It matches the string against the description of the FortiLink VLAN interfaces; if several share it, the lowest assignment priority wins.',
      'It matches the string against the VLAN interface names only.',
      'It ignores string values; only integer VLAN IDs are accepted in Tunnel-Private-Group-Id.',
      'It uses the LLDP-MED network policy of the port instead of the RADIUS attribute.',
    ],
    answer: [0],
    explanation: "Tunnel-Private-Group-Id can carry a VLAN **ID** (integer) or a **name** (string). Names are matched against the VLAN interfaces' **description** field (FortiOS 7.4.1+ syncs up to 63 characters). When several VLANs match, `assignment-priority` (1–255, default 128) decides and the **lowest** value wins.",
    lesson: '3.1-8021x-security-policies',
  },
  {
    id: 'd3-010',
    topic: '3.1',
    type: 'single',
    difficulty: 2,
    stem: 'Refer to the exhibit. IP phones connected to port7 of FSW-Access1 should receive the settings of the `access-dpp` dynamic port policy, but they stay in vlan10-data. What must the administrator configure on port7?',
    exhibit: `FGT-HQ # show switch-controller dynamic-port-policy access-dpp
config switch-controller dynamic-port-policy
    edit "access-dpp"
        set fortilink "fortilink"
        config policy
            edit "phones"
                set category device
                set hw-vendor "Yealink"
                set qos-policy "voice-qos"
                set vlan-policy "voice-vlans"
            next
        end
    next
end

FGT-HQ # show switch-controller managed-switch FSW-Access1 | grep -A3 'edit "port7"'
            edit "port7"
                set vlan "vlan10-data"
            next`,
    options: [
      '`set access-mode dynamic` and `set port-policy "access-dpp"`',
      '`set access-mode nac` and `set port-policy "access-dpp"`',
      '`set port-security-policy "access-dpp"`',
      '`set lldp-profile "access-dpp"`',
    ],
    answer: [0],
    explanation: "Port7 shows no `access-mode` line, so it uses the default **`static`** mode and keeps its configured VLAN. Dynamic port policies apply only to ports with `access-mode dynamic` and a `port-policy`.\n\n- `access-mode nac` uses `config user nac-policy`, not a dynamic port policy.\n- `port-security-policy` references an 802.1X security policy.\n- An LLDP profile is one possible *action* of a dynamic port policy, not the policy itself.",
    lesson: '3.1-nac-port-policies-mac',
  },
  {
    id: 'd3-011',
    topic: '3.1',
    type: 'single',
    difficulty: 2,
    stem: 'A new device is plugged into a managed FortiSwitch port that uses `access-mode nac`. No NAC policy has matched it yet. Where is the device placed?',
    options: [
      'In the onboarding VLAN configured in the NAC settings of the FortiLink interface.',
      'In the quarantine VLAN.',
      'In the native VLAN configured on the port before NAC was enabled.',
      'Nowhere: the port stays blocked until the device authenticates with 802.1X.',
    ],
    answer: [0],
    explanation: "Discovered NAC devices go to the **onboarding VLAN** (`config switch-controller fortilink-settings` → `config nac-ports` → `onboarding-vlan`). When a NAC policy matches, the device is authorized automatically by default and moved to the VLAN the policy assigns.\n\n- Quarantine is a separate feature for isolating specific MACs.\n- NAC doesn't need 802.1X.",
    lesson: '3.1-nac-port-policies-mac',
  },
  {
    id: 'd3-012',
    topic: '3.1',
    type: 'multi',
    difficulty: 3,
    stem: 'Refer to the exhibit. Which two statements about port12 are true? (Choose two.)',
    exhibit: `FGT-HQ # show switch-controller managed-switch FSW-Access1 | grep -A5 'edit "port12"'
            edit "port12"
                set vlan "vlan10-data"
                set learning-limit 2
                set sticky-mac enable
            next`,
    options: [
      'Static MAC addresses configured on port12 do not count toward the learning limit.',
      'Learned MAC addresses stay on port12 after the link goes down and up, but are lost at a switch reboot unless they are saved.',
      'Learning-limit violations on port12 are logged by default.',
      'The sticky MAC addresses are written to the configuration file automatically.',
      'The learning limit applies to the total number of MAC addresses in vlan10-data on all ports.',
    ],
    answer: [0, 1],
    explanation: "`learning-limit` (1–128, 0 = no limit) caps **dynamic** MACs on the port; static MACs don't count. `sticky-mac` keeps learned MACs across port down/up, but persistent entries are lost on reboot unless saved with `execute switch-controller switch-action sticky-mac save ...`.\n\n- `log-mac-limit-violations` is disabled by default.\n- Saving sticky MACs is a manual action.\n- A per-port limit is per port; VLANs have their own limit.",
    lesson: '3.1-nac-port-policies-mac',
  },
  {
    id: 'd3-013',
    topic: '3.1',
    type: 'fill',
    difficulty: 3,
    stem: 'From the FortiGate CLI, which command saves the sticky MAC addresses learned on port12 of switch S124EN5918000103 to the switch configuration so they survive a reboot? (Type the full command.)',
    answer: [
      'execute switch-controller switch-action sticky-mac save interface S124EN5918000103 port12',
    ],
    explanation: "`execute switch-controller switch-action sticky-mac save interface <serial> <port>`; use `save all <serial>` for every port, or `delete-unsaved` to discard unsaved entries.",
    lesson: '3.1-nac-port-policies-mac',
  },
  {
    id: 'd3-014',
    topic: '3.1',
    type: 'single',
    difficulty: 2,
    stem: 'Refer to the exhibit. port12 has `learning-limit 2`. A user connected an unmanaged switch with five PCs to port12, yet `diagnose switch-controller switch-info mac-limit-violations all S124EN5918000103` returns no entries. Why?',
    exhibit: `FGT-HQ # show switch-controller global
config switch-controller global
    set mac-event-logging enable
end`,
    options: [
      'Learning-limit violation logging is disabled by default and must be enabled with `set log-mac-limit-violations enable`.',
      '`mac-event-logging` replaces violation logging, so violations are sent only to syslog.',
      'The learning limit applies only after the MAC aging interval expires.',
      'Violations are recorded only for VLAN learning limits, not port limits.',
    ],
    answer: [0],
    explanation: "`log-mac-limit-violations` defaults to **disable**; until it is enabled, nothing is recorded for `mac-limit-violations` to show. (Only one violation per interface or VLAN is kept until its log is reset.)\n\n- `mac-event-logging` logs MAC learn/age/remove events — a separate feature.\n- The limit doesn't wait for aging.\n- Port and VLAN violations can both be displayed (`interface` and `vlan` keywords).",
    lesson: '3.1-nac-port-policies-mac',
  },
  {
    id: 'd3-015',
    topic: '3.1',
    type: 'order',
    difficulty: 2,
    stem: 'Place the FortiLink NAC events for a new device in the order they occur.',
    items: [
      'The device connects to a managed switch port configured with `access-mode nac`.',
      'The switch places the device in the onboarding VLAN.',
      'The FortiGate collects device information about the new MAC address.',
      'The FortiGate evaluates NAC policies in list order and finds a match.',
      'The device is authorized and moved to the VLAN that the matching policy assigns.',
    ],
    explanation: "NAC devices start in the onboarding VLAN, the FortiGate identifies them, NAC policies are evaluated in their list order, and a matching device is authorized automatically (by default) and moved to its assigned VLAN. `bounce-nac-port` can bounce the port so the device renews DHCP in the new VLAN.",
    lesson: '3.1-nac-port-policies-mac',
  },
  {
    id: 'd3-016',
    topic: '3.1',
    type: 'single',
    difficulty: 3,
    stem: 'Badge readers on managed FortiSwitch ports stop responding when they receive EAPOL frames. They are registered by MAC address on the RADIUS server. Which configuration authenticates them without sending any EAP packets?',
    options: [
      'Set `auth-order` to `mab` in the security policy (FortiSwitchOS 7.2.3 or later).',
      'Set `auth-priority` to `mab-dot1x`.',
      'Enable the guest VLAN with `guest-auth-delay 1`.',
      'Set `security-mode` to `802.1X-mac-based`.',
    ],
    answer: [0],
    explanation: "With `auth-order mab` (FortiSwitchOS 7.2.3+), only MAB is used and **no EAP packets are sent**.\n\n- `mab-dot1x` tries MAB first but still falls back to 802.1X, which means EAP.\n- The guest VLAN would bypass authentication rather than check the MAC.\n- MAC-based mode still sends EAP.",
    lesson: '3.1-8021x-security-policies',
  },

  // ---------------------------------------------------------------- 3.2
  {
    id: 'd3-017',
    topic: '3.2',
    type: 'single',
    difficulty: 2,
    stem: 'Refer to the exhibit. VLAN 99 clients get their addresses from a Windows DHCP server (10.10.99.20) connected to port20 of FSW-Core1; the FortiGate DHCP server is disabled on vlan99-mgmt. Right after DHCP snooping was enabled, VLAN 99 clients stopped getting addresses. What is the cause?',
    exhibit: `FGT-HQ # show system interface vlan99-mgmt
config system interface
    edit "vlan99-mgmt"
        set vdom "root"
        set ip 10.10.99.1 255.255.255.0
        set allowaccess ping
        set role lan
        set interface "fortilink"
        set vlanid 99
        set switch-controller-dhcp-snooping enable
    next
end

FGT-HQ # show switch-controller managed-switch FSW-Core1 | grep -A3 'edit "port20"'
            edit "port20"
                set vlan "vlan99-mgmt"
            next`,
    options: [
      'port20 is untrusted by default, so DHCP server traffic on it is blocked; set `dhcp-snooping trusted` on port20.',
      'DHCP snooping allows only the FortiGate as a DHCP server on FortiLink VLANs.',
      'The DHCP server access list is enabled by default and contains no servers.',
      'DHCP snooping requires dynamic ARP inspection to be enabled on the same VLAN.',
    ],
    answer: [0],
    explanation: "Managed-switch ports are **untrusted** by default (`dhcp-snooping untrusted`), and DHCP blocking filters server messages arriving on untrusted ports. With the default `dhcp-snoop-client-req drop-untrusted`, client requests aren't even flooded toward untrusted ports. Trust port20.\n\n- Third-party DHCP servers work on trusted ports.\n- The server access list is **disabled** by default.\n- DAI depends on snooping, not the other way round.",
    lesson: '3.2-dhcp-snooping-option82',
  },
  {
    id: 'd3-018',
    topic: '3.2',
    type: 'multi',
    difficulty: 2,
    stem: 'Which two statements about DHCP snooping defaults in FortiLink mode are true? (Choose two.)',
    options: [
      'Managed FortiSwitch ports are untrusted for DHCP snooping by default.',
      'DHCP snooping is disabled by default on managed FortiSwitch VLANs.',
      'The DHCP server access list is enabled by default.',
      '`dhcp-snoop-client-req` defaults to `forward-untrusted`.',
      '`dhcp-option82-format` defaults to `legacy`.',
    ],
    answer: [0, 1],
    explanation: "Ports default to `dhcp-snooping untrusted`, and DHCP snooping is off until you `set switch-controller-dhcp-snooping enable` on the VLAN interface.\n\n- The server access list defaults to **disable** (all servers allowed).\n- `dhcp-snoop-client-req` defaults to **`drop-untrusted`**.\n- `dhcp-option82-format` defaults to **`ascii`**.",
    lesson: '3.2-dhcp-snooping-option82',
  },
  {
    id: 'd3-019',
    topic: '3.2',
    type: 'single',
    difficulty: 3,
    stem: 'Refer to the exhibit. A second Windows DHCP server, 10.10.99.21, was added on port21 of FSW-Core1, and port21 was set to `dhcp-snooping trusted`. Clients never receive offers from 10.10.99.21. Why?',
    exhibit: `FGT-HQ # show switch-controller global
config switch-controller global
    set dhcp-server-access-list enable
end

FGT-HQ # show system interface vlan99-mgmt
config system interface
    edit "vlan99-mgmt"
        set ip 10.10.99.1 255.255.255.0
        set interface "fortilink"
        set vlanid 99
        set switch-controller-dhcp-snooping enable
        config dhcp-snooping-server-list
            edit "win-dhcp1"
                set server-ip 10.10.99.20
            next
        end
    next
end`,
    options: [
      'With the DHCP server access list enabled, only servers in the VLAN\'s server list may respond, and 10.10.99.21 is not listed.',
      'Only one trusted port per VLAN is allowed when DHCP snooping is enabled.',
      'The server access list must also be enabled per switch with `dhcp-server-access-list enable`; `global` is not a valid value.',
      'DHCP snooping allows a maximum of one DHCP server per VLAN.',
    ],
    answer: [0],
    explanation: "The server access list (FortiOS 7.0.1+) is enabled globally, and the managed switch uses the default per-switch value `global`. Only servers in `dhcp-snooping-server-list` may answer; add 10.10.99.21. Limits: 255 servers per table, 2,048 in total.\n\n- Several trusted ports per VLAN are fine.\n- `global` is a valid (default) per-switch value meaning \"follow the global setting\".\n- One table can hold up to 255 servers.",
    lesson: '3.2-dhcp-snooping-option82',
  },
  {
    id: 'd3-020',
    topic: '3.2',
    type: 'single',
    difficulty: 2,
    stem: 'An administrator wants the option-82 circuit ID inserted by managed switches to contain readable fields such as the interface and VLAN names instead of a fixed binary layout. Which global setting is required?',
    options: [
      '`set dhcp-option82-format ascii`',
      '`set dhcp-option82-format legacy`',
      '`set dhcp-snoop-client-req forward-untrusted`',
      '`set switch-controller-dhcp-snooping-verify-mac enable`',
    ],
    answer: [0],
    explanation: "With **`ascii`** (the CLI default) you select circuit-ID fields (interface name, VLAN, host name, mode, description) and remote-ID fields (MAC, host name, IP). `legacy` uses fixed formats such as `hostname-[<vlan:16><mod:8><port:8>].32bit` for the circuit ID. The other two settings don't control option-82 content.",
    lesson: '3.2-dhcp-snooping-option82',
  },
  {
    id: 'd3-021',
    topic: '3.2',
    type: 'single',
    difficulty: 3,
    stem: 'Refer to the exhibit. A client on port10 of FSW-Core1 sends a DHCP request in VLAN vlan10-data. Which option-82 values does the switch insert?',
    exhibit: `FGT-HQ # show switch-controller managed-switch FSW-Core1
config switch-controller managed-switch
    edit "FSW-Core1"
        set sn "S248EPTF18000101"
        config ports
            edit "port10"
                config dhcp-snoop-option82-override
                    edit "vlan15"
                        set circuit-id "BLDG2-RM210"
                        set remote-id "FSW-Core1"
                    next
                end
            next
        end
    next
end`,
    options: [
      'The circuit ID and remote ID built from the global option-82 settings.',
      'Circuit ID BLDG2-RM210 and remote ID FSW-Core1.',
      'Circuit ID BLDG2-RM210 and a remote ID from the global settings.',
      'No option-82 data, because an override exists on the port.',
    ],
    answer: [0],
    explanation: "Overrides are **per port and per VLAN**. This override matches only vlan15 on port10; for any VLAN without an override, the switch uses the **global** settings. Circuit ID and remote ID always come from the same source — both global or both override — so a mix is impossible.",
    lesson: '3.2-dhcp-snooping-option82',
  },
  {
    id: 'd3-022',
    topic: '3.2',
    type: 'single',
    difficulty: 3,
    stem: 'Refer to the exhibit. The administrator tries to create a DHCP-snooping static entry for a printer with a static IP address on port14, but the configuration is rejected. Why?',
    exhibit: `FGT-HQ # show switch-controller managed-switch FSW-Access1 | grep -A3 'edit "port14"'
            edit "port14"
                set vlan "vlan10-data"
                set dhcp-snooping trusted
            next

FGT-HQ (FSW-Access1) # config dhcp-snooping-static-client
FGT-HQ (dhcp-snooping-static-client) # edit "printer-2f"
FGT-HQ (printer-2f) # set vlan "vlan10-data"
FGT-HQ (printer-2f) # set ip 10.10.10.50
FGT-HQ (printer-2f) # set mac 00:09:0f:aa:10:50
FGT-HQ (printer-2f) # set port "port14"`,
    options: [
      'A DHCP-snooping static entry cannot use a DHCP-trusted switch interface.',
      'Static entries can only be created for VLANs where DHCP snooping is disabled.',
      'The MAC address must be written without colons.',
      'Static entries can only bind addresses from the FortiGate DHCP server range.',
    ],
    answer: [0],
    explanation: "Static entries need an **untrusted, non-802.1X** port, a VLAN with DHCP snooping **enabled** that is the port's native or allowed VLAN, one MAC to one IPv4 address, and MAC format `xx:xx:xx:xx:xx:xx`. Port14 is trusted, so the entry is refused. Up to 64 static entries per switch.",
    lesson: '3.2-dhcp-snooping-option82',
  },
  {
    id: 'd3-023',
    topic: '3.2',
    type: 'fill',
    difficulty: 2,
    stem: 'What is the maximum number of DHCP-snooping static entries for an entire managed FortiSwitch unit? (Enter the number.)',
    answer: ['64'],
    explanation: "A maximum of **64** DHCP static entries per FortiSwitch (not to be confused with the default per-port binding learn limit, which is also 64 but model-dependent).",
    lesson: '3.2-dhcp-snooping-option82',
  },
  {
    id: 'd3-024',
    topic: '3.2',
    type: 'single',
    difficulty: 2,
    stem: 'Refer to the exhibit. The administrator wants to enable dynamic ARP inspection on vlan10-data. What must be done first?',
    exhibit: `FGT-HQ # show system interface vlan10-data
config system interface
    edit "vlan10-data"
        set vdom "root"
        set ip 10.10.10.1 255.255.255.0
        set allowaccess ping
        set role lan
        set interface "fortilink"
        set vlanid 10
    next
end`,
    options: [
      'Enable DHCP snooping on the VLAN with `set switch-controller-dhcp-snooping enable`.',
      'Set `arp-inspection-trust trusted` on every access port in the VLAN.',
      'Enable `ip-source-guard` on every access port in the VLAN.',
      'Enable `switch-controller-access-vlan` on the VLAN.',
    ],
    answer: [0],
    explanation: "DAI validates ARP against IP-MAC bindings from the DHCP-snooping database, so **DHCP snooping must be enabled first**. DAI is disabled on all VLANs by default.\n\n- Trusting every access port would defeat DAI.\n- IPv4 source guard is a separate feature.\n- `switch-controller-access-vlan` blocks intra-VLAN traffic.",
    lesson: '3.2-dai-ipsg-storm',
  },
  {
    id: 'd3-025',
    topic: '3.2',
    type: 'single',
    difficulty: 3,
    stem: 'Refer to the exhibit. After DAI was enabled, a printer with the static address 10.10.10.50 on port14 can no longer communicate. Which fix restores the printer while DAI keeps enforcing ARP checks in vlan10-data and port14 stays ARP-untrusted?',
    exhibit: `FGT-HQ # show system interface vlan10-data
config system interface
    edit "vlan10-data"
        set ip 10.10.10.1 255.255.255.0
        set interface "fortilink"
        set vlanid 10
        set switch-controller-dhcp-snooping enable
        set switch-controller-arp-inspection enable
    next
end`,
    options: [
      'Create a DHCP-snooping static entry for 10.10.10.50 and the printer\'s MAC address on port14.',
      'Enable `ip-source-guard` on port14 with a binding entry for the printer.',
      'Set `dhcp-snooping trusted` on port14.',
      'Set `switch-controller-arp-inspection monitor` on vlan10-data.',
    ],
    answer: [0],
    explanation: "A static-IP host never appears in the snooping database, so DAI drops its ARP. Fortinet's answer is a **DHCP-snooping static entry** (`config dhcp-snooping-static-client`), which DAI uses for IP-MAC pairs that snooping didn't learn.\n\n- An IP source guard binding feeds source guard, not DAI.\n- Trusting the port for DHCP snooping doesn't make it ARP-trusted and would also prevent the static entry.\n- Monitor mode changes the whole VLAN's DAI setting to learn bindings from ARP on DHCP-trusted ports with `allow-arp-monitor`; it doesn't give this untrusted port a binding.",
    lesson: '3.2-dai-ipsg-storm',
  },
  {
    id: 'd3-026',
    topic: '3.2',
    type: 'multi',
    difficulty: 2,
    stem: 'Which two statements about IPv4 source guard on managed FortiSwitch units are true? (Choose two.)',
    options: [
      'When a static entry and a dynamic entry conflict, the static entry takes precedence.',
      'Traffic discarded by IPv4 source guard is not logged.',
      'IPv4 source guard is enabled per VLAN on the FortiGate VLAN interface.',
      'IPv4 source guard is enabled by default on access ports.',
      'Dynamic entries are learned from ARP traffic without DHCP snooping.',
    ],
    answer: [0, 1],
    explanation: "Static entries win conflicts, and discarded addresses aren't logged. Source guard is **off by default**, enabled **per port** (`set ip-source-guard enable`), and its dynamic entries come from **DHCP snooping**. More than 2,048 entries pushed from a FortiGate returns an error.",
    lesson: '3.2-dai-ipsg-storm',
  },
  {
    id: 'd3-027',
    topic: '3.2',
    type: 'single',
    difficulty: 3,
    stem: 'Refer to the exhibit. IPv4 source guard is enabled on port14. Both entries are present on FSW-Access1. Which traffic does port14 accept from source address 10.10.10.50?',
    exhibit: `FGT-HQ # show switch-controller managed-switch FSW-Access1
config switch-controller managed-switch
    edit "FSW-Access1"
        set sn "S124EN5918000103"
        config ports
            edit "port14"
                set vlan "vlan10-data"
                set ip-source-guard enable
            next
        end
        config ip-source-guard
            edit "port14"
                config binding-entry
                    edit 1
                        set ip 10.10.10.50
                        set mac 00:09:0f:aa:10:50
                    next
                end
            next
        end
    next
end

DHCP-snooping binding learned on FSW-Access1 (summary)
VLAN  IP             MAC                 PORT
10    10.10.10.50    00:09:0f:aa:99:99   port14`,
    options: [
      'Only traffic from MAC 00:09:0f:aa:10:50, because the static entry takes precedence over the conflicting dynamic entry.',
      'Only traffic from MAC 00:09:0f:aa:99:99, because the most recently learned entry wins.',
      'Traffic from both MAC addresses, because static and dynamic entries are merged.',
      'No traffic, because conflicting entries disable source guard on the port.',
    ],
    answer: [0],
    explanation: "Source guard allows sources from static bindings and from DHCP-snooping entries, and **when they conflict the static entry takes precedence**. Packets from 10.10.10.50 with the other MAC are discarded — silently, because source guard drops aren't logged.",
    lesson: '3.2-dai-ipsg-storm',
  },
  {
    id: 'd3-028',
    topic: '3.2',
    type: 'match',
    difficulty: 2,
    stem: 'Match each FortiLink-mode setting with the protection it controls.',
    pairs: [
      ['`set switch-controller-dhcp-snooping enable` (VLAN interface)', 'Turns on DHCP snooping for the VLAN'],
      ['`set switch-controller-arp-inspection enable` (VLAN interface)', 'Turns on dynamic ARP inspection for the VLAN'],
      ['`set ip-source-guard enable` (switch port)', 'Turns on IPv4 source guard for the port'],
      ['`set dhcp-snooping trusted` (switch port)', 'Lets DHCP server messages through the port'],
      ['`set arp-inspection-trust trusted` (switch port)', 'Exempts the port\'s ARP traffic from DAI checks'],
    ],
    explanation: "Snooping and DAI are switched on **per VLAN** on the FortiGate VLAN interface; source guard, DHCP trust and ARP trust are **per port** under `config switch-controller managed-switch` → `config ports`.",
    lesson: '3.2-dai-ipsg-storm',
  },
  {
    id: 'd3-029',
    topic: '3.2',
    type: 'single',
    difficulty: 2,
    stem: 'Refer to the exhibit. A broadcast storm in vlan10-data was not limited by the managed switches. Why?',
    exhibit: `FGT-HQ # show switch-controller storm-control
config switch-controller storm-control
    set rate 300
end`,
    options: [
      'Broadcast, unknown-unicast and unknown-multicast storm control are all disabled by default; `broadcast` must be enabled.',
      'A rate of 300 pps is below the minimum value, so storm control is ignored.',
      'Global storm control applies only to FortiLink ports, not access ports.',
      'Storm control works only when a storm-control policy is assigned to every port.',
    ],
    answer: [0],
    explanation: "Storm control measures traffic in pps and drops the excess, but **all three traffic types are disabled by default** — setting only the rate drops nothing. Enable `broadcast` (and `unknown-unicast` / `unknown-multicast` as needed).\n\n- 300 pps is a valid rate.\n- The global settings apply to all managed switch ports, FortiLink and non-FortiLink.\n- Per-port policies are optional overrides.",
    lesson: '3.2-dai-ipsg-storm',
  },
  {
    id: 'd3-030',
    topic: '3.2',
    type: 'single',
    difficulty: 3,
    stem: 'Refer to the exhibit. The policy is assigned to port5 with `set storm-control-policy "access-1000pps"`, but port5 still uses the global storm-control values. What is missing from the policy?',
    exhibit: `FGT-HQ # show switch-controller storm-control-policy access-1000pps
config switch-controller storm-control-policy
    edit "access-1000pps"
        set description "port5 limit"
        set rate 1000
        set broadcast enable
    next
end`,
    options: [
      '`set storm-control-mode override`',
      '`set unknown-unicast enable`',
      '`set rate 0`',
      '`set local-override enable`',
    ],
    answer: [0],
    explanation: "A per-port storm-control policy takes effect only with **`storm-control-mode override`**; without it the port keeps the global values.\n\n- Enabling more traffic types doesn't change which settings apply.\n- `rate 0` would drop *all* packets of the enabled types.\n- `local-override` isn't part of storm-control policies.",
    lesson: '3.2-dai-ipsg-storm',
  },
  {
    id: 'd3-031',
    topic: '3.2',
    type: 'fill',
    difficulty: 1,
    stem: 'What is the default storm-control threshold, in packets per second, on managed FortiSwitch units? (Enter the number.)',
    answer: ['500', '500 pps'],
    explanation: "**500 pps**. The traffic types themselves are disabled until enabled.",
    lesson: '3.2-dai-ipsg-storm',
  },
  {
    id: 'd3-032',
    topic: '3.2',
    type: 'single',
    difficulty: 3,
    stem: 'On FortiOS 7.6, an administrator wants managed switches to record the IP-MAC-VLAN bindings of static-IP devices from their ARP packets in the DHCP-snooping database. The VLAN already has DHCP snooping enabled and `switch-controller-arp-inspection monitor`. What else is required?',
    options: [
      'On the DHCP-snooping trusted port where those ARP packets arrive, `set allow-arp-monitor enable`.',
      'On every untrusted access port, `set arp-inspection-trust trusted`.',
      'On the VLAN interface, `set switch-controller-dhcp-snooping-verify-mac enable`.',
      'A DHCP-snooping static entry for each device.',
    ],
    answer: [0],
    explanation: "ARP monitor mode (FortiOS 7.4.4+) needs `switch-controller-arp-inspection monitor` on the VLAN **and** `allow-arp-monitor enable` (default disable) on a **DHCP-snooping trusted** port. The learned VLAN, MAC and IP go into the snooping database and can be used in RADIUS accounting.\n\n- ARP trust and verify-MAC don't collect bindings.\n- Static entries are the manual alternative that monitor mode avoids.",
    lesson: '3.2-dai-ipsg-storm',
  },

  // ---------------------------------------------------------------- 3.3
  {
    id: 'd3-033',
    topic: '3.3',
    type: 'single',
    difficulty: 2,
    stem: 'Refer to the exhibit. The administrator wants to stop the PC on port6 of FSW-Access1 from reaching the management subnet. The traffic still passes, and the ACL counters stay at zero. What is missing?',
    exhibit: `FGT-HQ # show switch-controller acl ingress 1
config switch-controller acl ingress
    edit 1
        config action
            set drop enable
            set count enable
        end
        config classifier
            set src-mac 00:0c:29:4a:10:25
            set dst-ip-prefix 10.10.99.0 255.255.255.0
        end
    next
end

FGT-HQ # show switch-controller acl group
config switch-controller acl group
    edit "block-mgmt"
        set ingress 1
    next
end

FGT-HQ # show switch-controller managed-switch FSW-Access1 | grep -A3 'edit "port6"'
            edit "port6"
                set vlan "vlan10-data"
            next`,
    options: [
      'The ACL group is not applied to the port; set `acl-group "block-mgmt"` on port6.',
      'Managed-switch ACLs work only at the egress stage, so the policy must be created under `acl egress`.',
      'The classifier must also include a VLAN ID before the ACL can match.',
      'ACL policies must be referenced directly on the port with `set acl-ingress 1`.',
    ],
    answer: [0],
    explanation: "The FortiLink ACL workflow is: ingress policy → ACL group → **apply the group to the port with `set acl-group`** → check counters. Port6 has no `acl-group`.\n\n- FortiLink-mode ACLs (FortiOS/FortiSwitchOS 7.4.0+) are **ingress only**.\n- The `vlan` classifier is optional.\n- Ports reference groups, not individual policies.",
    lesson: '3.3-acl-quarantine-inspection',
  },
  {
    id: 'd3-034',
    topic: '3.3',
    type: 'multi',
    difficulty: 3,
    stem: 'Which two statements about ACLs on FortiSwitch units managed by a FortiGate running FortiOS 7.6 are true? (Choose two.)',
    options: [
      'The ACLs act on the ingress stage only.',
      'User-configured ACLs are placed in ACL group 3 on the FortiSwitch; a switch without ACL group 3 cannot use them.',
      'ACL actions include redirecting matched packets to another port.',
      'Each ACL hit is logged to the FortiGate traffic log.',
      'ACLs are configured on the switch with `config switch acl ingress` and then synchronized to the FortiGate.',
    ],
    answer: [0, 1],
    explanation: "FortiLink ACLs are **ingress only**, and user ACLs go into **ACL group 3** on the switch. Classifiers are source/destination MAC, source/destination IP prefix and VLAN; actions are drop and count (no redirect) (view counts with `diagnose switch-controller switch-info acl-counters <sn>`). Switch-side `config switch acl` is standalone FortiSwitchOS configuration and isn't supported in FortiLink mode.",
    lesson: '3.3-acl-quarantine-inspection',
  },
  {
    id: 'd3-035',
    topic: '3.3',
    type: 'order',
    difficulty: 1,
    stem: 'Place the steps for blocking traffic with an ACL on a managed FortiSwitch port in the correct order.',
    items: [
      'Create the policy under `config switch-controller acl ingress` with a classifier and actions.',
      'Add the policy to a group under `config switch-controller acl group`.',
      'Apply the group to the switch port with `set acl-group`.',
      'Check the hits with `diagnose switch-controller switch-info acl-counters <serial>`.',
    ],
    explanation: "Policy → group → port → counters. The group can't reference a policy that doesn't exist, and the port references groups, not policies.",
    lesson: '3.3-acl-quarantine-inspection',
  },
  {
    id: 'd3-036',
    topic: '3.3',
    type: 'single',
    difficulty: 2,
    stem: 'An engineer opens the CLI of managed switch FSW-Access1 from the FortiGate GUI and plans to block a host with `config switch acl ingress`. What is the correct approach?',
    options: [
      'Configure the ACL on the FortiGate under `config switch-controller acl ingress`; switch-side ACL configuration is not supported in FortiLink mode.',
      'Configure it on the switch, then run `diagnose switch-controller trigger config-sync` so the FortiGate learns it.',
      'Configure it on the switch under the `prelookup` stage, which FortiLink mode does not overwrite.',
      'Convert the switch to standalone mode temporarily, add the ACL, and reauthorize it.',
    ],
    answer: [0],
    explanation: "On a managed switch, ACLs come from the FortiGate (`config switch-controller acl ingress` / `acl group` / port `acl-group`). The FortiSwitchOS guide states that its own ACL configuration isn't supported in FortiLink mode, and local changes are unknown to the FortiGate anyway.\n\n- `trigger config-sync` pushes FortiGate configuration *to* the switch, overwriting local edits.\n- Standalone conversion erases the managed configuration.",
    lesson: '3.3-acl-quarantine-inspection',
  },
  {
    id: 'd3-037',
    topic: '3.3',
    type: 'single',
    difficulty: 3,
    stem: 'Refer to the exhibit. Guests in vlan30-guest must not reach each other, but they must be able to print to a printer at 10.10.30.50 in the same VLAN. Guests currently cannot reach the printer. What should the administrator add?',
    exhibit: `FGT-HQ # show system interface vlan30-guest
config system interface
    edit "vlan30-guest"
        set ip 10.10.30.1 255.255.255.0
        set role lan
        set interface "fortilink"
        set vlanid 30
        set switch-controller-access-vlan enable
    next
end`,
    options: [
      'Proxy ARP for the VLAN range and a firewall policy from vlan30-guest to vlan30-guest that allows printing to 10.10.30.50.',
      'An ACL on the printer port with `set drop disable`.',
      'A second VLAN interface with `switch-controller-access-vlan disable` for the printer.',
      'A quarantine entry for the printer with `drop disable`.',
    ],
    answer: [0],
    explanation: "With `switch-controller-access-vlan enable`, the switch allows traffic only to and from the FortiGate; port-to-port traffic in the VLAN is blocked. To allow chosen host-to-host flows, the FortiGate must carry them: enable **proxy ARP** for the addresses and add a **same-interface firewall policy** (vlan30-guest → vlan30-guest) for the printer — where you can also apply security profiles. (If traffic enters and leaves the same interface, `allow-traffic-redirect disable` is a prerequisite.)\n\n- FortiLink ACLs have no allow action that overrides the block, quarantine would isolate the printer, and a second VLAN interface for the same VLAN isn't how you build an exception.",
    lesson: '3.3-acl-quarantine-inspection',
  },
  {
    id: 'd3-038',
    topic: '3.3',
    type: 'single',
    difficulty: 2,
    stem: 'Refer to the exhibit. The administrator enables "Block intra-VLAN traffic" on vlan30-guest, which is defined on this FortiLink interface, but the setting cannot be used. Why?',
    exhibit: `FGT-HQ # show system interface fortilink
config system interface
    edit "fortilink"
        set vdom "root"
        set fortilink enable
        set ip 10.255.1.1 255.255.255.0
        set type hard-switch
    next
end`,
    options: [
      'Blocking intra-VLAN traffic is not supported when the FortiLink interface is a hardware or software switch.',
      'Blocking intra-VLAN traffic requires the FortiLink split interface to be disabled.',
      'Blocking intra-VLAN traffic requires an IPv6 address on the VLAN interface.',
      'Blocking intra-VLAN traffic is supported only on the native VLAN of the FortiLink interface.',
    ],
    answer: [0],
    explanation: "The FortiLink interface is a **hardware switch** (`type hard-switch`), and Fortinet lists blocking intra-VLAN traffic as unsupported when the FortiLink interface is a hardware or software switch. (IPv6 between clients is also unsupported while blocking is enabled.)",
    lesson: '3.3-acl-quarantine-inspection',
  },
  {
    id: 'd3-039',
    topic: '3.3',
    type: 'fill',
    difficulty: 2,
    stem: 'Which `config system interface` keyword, set to `enable` on a FortiLink VLAN interface, blocks FortiSwitch port-to-port traffic within that VLAN? (Enter the keyword.)',
    answer: ['switch-controller-access-vlan', 'set switch-controller-access-vlan enable', 'set switch-controller-access-vlan'],
    explanation: "`set switch-controller-access-vlan enable` (GUI: **Block intra-VLAN traffic**). Only traffic to and from the FortiGate is then allowed in the VLAN.",
    lesson: '3.3-acl-quarantine-inspection',
  },
  {
    id: 'd3-040',
    topic: '3.3',
    type: 'single',
    difficulty: 2,
    stem: 'Refer to the exhibit. `quarantine-mode` is at its default value. What happens to the laptop with MAC 00:0c:29:4a:10:25?',
    exhibit: `FGT-HQ # show user quarantine
config user quarantine
    set quarantine enable
    config targets
        edit "infected-laptop"
            config macs
                edit 00:0c:29:4a:10:25
                    set drop disable
                next
            end
        next
    end
end`,
    options: [
      'It is moved to the quarantine VLAN, and its traffic is sent to the FortiGate.',
      'Its traffic is dropped at the FortiSwitch port.',
      'Its traffic is redirected to the QuarantinedDevices firewall address group.',
      'Its switch port is shut down until the entry is deleted.',
    ],
    answer: [0],
    explanation: "The default `quarantine-mode` is **`by-vlan`** (since FortiOS 6.4.1): the MAC is placed in the quarantine VLAN on the FortiGate. `drop disable` means the traffic is sent to the FortiGate rather than discarded.\n\n- `drop enable` would drop it.\n- Redirecting to the `QuarantinedDevices` group is the `by-redirect` mode.\n- Quarantine isolates by MAC; it doesn't shut the port (`bounce-quarantined-link` only bounces it to force a DHCP renewal).",
    lesson: '3.3-acl-quarantine-inspection',
  },
  {
    id: 'd3-041',
    topic: '3.3',
    type: 'multi',
    difficulty: 3,
    stem: 'Which two statements about FortiLink secure fabric are true? (Choose two.)',
    options: [
      'Links between the FortiGate and managed FortiSwitch units are always unencrypted.',
      'In `relax` mode, a switch that fails authentication gets a restricted ISL trunk without user VLANs.',
      'In `strict` mode, a switch that fails authentication gets a restricted ISL trunk.',
      'Authentication of ISL peers uses 802.1X with a RADIUS server.',
      'Secure fabric is supported for FortiSwitch units managed over VXLAN.',
      'Encryption mode `must` can be selected while `auto-isl-auth` is `legacy`.',
    ],
    answer: [0, 1],
    explanation: "Secure fabric (FortiOS/FortiSwitchOS 7.4.1+) authenticates and MACsec-encrypts **ISLs**; FortiGate-to-switch links are always unencrypted. `relax`: secure trunk on success, **restricted** trunk (no user VLANs) on failure. `strict`: secure trunk on success, **no trunk** on failure.\n\n- Authentication is based on LLDP neighbors and Fortinet factory certificates, not 802.1X.\n- VXLAN isn't supported.\n- `mixed`/`must` require `relax` or `strict` first.",
    lesson: '3.3-acl-quarantine-inspection',
  },
  {
    id: 'd3-042',
    topic: '3.3',
    type: 'single',
    difficulty: 3,
    stem: 'Refer to the exhibit. port49 and port50 of FSW-Core1 use this LLDP profile. A new FortiSwitch whose Fortinet factory certificate chain can\'t be validated is connected to port49. What happens?',
    exhibit: `FGT-HQ # show switch-controller lldp-profile secure-isl
config switch-controller lldp-profile
    edit "secure-isl"
        set auto-isl-auth strict
        set auto-isl-auth-encrypt must
        set auto-isl-auth-macsec-profile "default-macsec-auto-isl"
    next
end`,
    options: [
      'No ISL trunk forms on port49.',
      'A restricted ISL trunk forms on port49 so the switch can be authenticated later.',
      'A normal unencrypted ISL trunk forms because `must` falls back to no encryption.',
      'An ISL trunk forms, but port49 is removed from it and acts as a user port.',
    ],
    answer: [0],
    explanation: "With `auto-isl-auth strict`, a failed authentication means **no ISL trunk**. (A restricted trunk is the `relax` behaviour.) The `must` encryption mode removes non-MACsec ports from an *authenticated* ISL, but there is no ISL to join here. In strict mode a new switch must be configured manually (`config switch lldp-profile`) to be onboarded.",
    lesson: '3.3-acl-quarantine-inspection',
  },
  {
    id: 'd3-043',
    topic: '3.3',
    type: 'match',
    difficulty: 2,
    stem: 'Match each FortiLink secure fabric LLDP-profile value with its behaviour.',
    pairs: [
      ['`auto-isl-auth legacy`', 'No ISL authentication (default)'],
      ['`auto-isl-auth-encrypt none`', 'No MACsec on ISL members (default)'],
      ['`auto-isl-auth-encrypt mixed`', 'MACsec only on ISL members that support it'],
      ['`auto-isl-auth-encrypt must`', 'MACsec on all members; ports without MACsec leave the ISL'],
    ],
    explanation: "`legacy` and `none` are the defaults. `mixed` encrypts where possible; `must` removes ports that can't do MACsec from the ISL trunk (they still work as user ports). `mixed` and `must` require `relax` or `strict` authentication.",
    lesson: '3.3-acl-quarantine-inspection',
  },
  {
    id: 'd3-044',
    topic: '3.3',
    type: 'single',
    difficulty: 2,
    stem: 'A FortiGate firewall policy from vlan10-data to vlan99-mgmt has an IPS sensor. Two hosts that are both in vlan10-data exchange traffic through the same managed FortiSwitch, and none of it appears in IPS logs. Why?',
    options: [
      'Traffic between hosts in the same VLAN is switched locally by the FortiSwitch and never reaches the FortiGate.',
      'IPS sensors on FortiLink VLAN interfaces inspect only UDP traffic.',
      'The FortiSwitch applies the IPS sensor in hardware and does not send logs.',
      'IPS inspection of FortiLink VLANs requires the FortiLink interface to be in transparent mode.',
    ],
    answer: [0],
    explanation: "Inter-VLAN traffic is routed by the FortiGate and matches firewall policies (and their security profiles). **Intra-VLAN** traffic is switched locally, so the FortiGate never sees it. To inspect it, block intra-VLAN traffic (`switch-controller-access-vlan enable`) and allow the needed flows with proxy ARP and a same-interface policy carrying the profiles.\n\n- FortiSwitch doesn't run FortiGate IPS, and FortiLink isn't supported in transparent mode.",
    lesson: '3.3-acl-quarantine-inspection',
  },
  {
    id: 'd3-045',
    topic: '3.3',
    type: 'single',
    difficulty: 2,
    stem: 'Refer to the exhibit. Hosts in vlan10-data reach servers in vlan99-mgmt through managed FortiSwitch units. The security team wants antivirus and IPS inspection of this traffic. Which statement is true?',
    exhibit: `FGT-HQ # show firewall policy 5
config firewall policy
    edit 5
        set name "Data-to-Mgmt"
        set srcintf "vlan10-data"
        set dstintf "vlan99-mgmt"
        set action accept
        set srcaddr "all"
        set dstaddr "MGMT-SERVERS"
        set schedule "always"
        set service "HTTPS" "SSH"
    next
end`,
    options: [
      'FGT-HQ routes this traffic between its FortiLink VLAN interfaces, so adding antivirus and IPS profiles (with SSL inspection) to policy 5 inspects it.',
      'The traffic is routed by FSW-Core1, so the profiles must be applied in a FortiSwitch security policy.',
      'Security profiles must be applied to the `fortilink` aggregate interface, not to VLAN policies.',
      'Inspection requires the VLANs to be exported to a separate VDOM with `export-to`.',
    ],
    answer: [0],
    explanation: "In FortiLink mode, user VLANs are FortiGate VLAN interfaces, so inter-VLAN traffic is routed by the FortiGate and matches policy 5. Add the AV and IPS profiles (and an SSL inspection profile for HTTPS/SSH content) there.\n\n- FortiSwitch \"security policies\" are 802.1X port-security policies, not inspection.\n- Profiles are attached to firewall policies, not interfaces.\n- No VDOM export is needed.",
    lesson: '3.3-acl-quarantine-inspection',
  },
];
