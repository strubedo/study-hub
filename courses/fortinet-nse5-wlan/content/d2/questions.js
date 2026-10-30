// Domain 2 — Wireless network security and access question bank (original, exam-style).
export default [
  // ---------------------------------------------------------------- 2.1
  {
    id: 'd2-001',
    topic: '2.1',
    type: 'single',
    difficulty: 1,
    stem: 'An administrator creates a new SSID on a FortiGate and leaves the traffic mode at its default. Where does client data go?',
    options: [
      'Out of the FortiAP\'s Ethernet port onto the local LAN',
      'Through the CAPWAP data channel to the FortiGate, which routes and inspects it',
      'Over a wireless mesh backhaul to the nearest root AP',
      'To FortiEdge Cloud, which forwards it to the internet',
    ],
    answer: [1],
    explanation: '**Tunnel** ("Tunnel to Wireless Controller") is the default traffic mode: client frames travel inside the CAPWAP data channel to the FortiGate, where the SSID is a Layer 3 interface subject to firewall policies. Leaving through the AP\'s Ethernet port is local bridge mode, the mesh backhaul is mesh mode, and FortiEdge Cloud does not carry client data for a FortiGate-managed AP.',
    lesson: '2.1-traffic-modes-ssids',
  },
  {
    id: 'd2-002',
    topic: '2.1',
    type: 'single',
    difficulty: 2,
    stem: 'Refer to the exhibit. Which statement about traffic from clients of this SSID is true?',
    exhibit: String.raw`config wireless-controller vap
    edit "iot-wlan"
        set ssid "IoT"
        set security wpa2-only-personal
        set passphrase ENC xxxxxxxxxxxxxxxx
        set local-bridging enable
        set vlanid 300
        set schedule "always"
    next
end`,
    options: [
      'It is tunneled to the FortiGate and leaves through a VLAN 300 sub-interface of iot-wlan',
      'It leaves the FortiAP\'s Ethernet port tagged with VLAN 300, and FortiGate firewall policies on iot-wlan do not see it',
      'It is dropped unless a firewall policy with srcintf iot-wlan exists',
      'It is sent untagged on the AP\'s uplink because VLAN tags are applied only to tunnel-mode SSIDs',
    ],
    answer: [1],
    explanation: '`local-bridging enable` makes this a **local bridge** SSID: the AP bridges client traffic onto its Ethernet uplink and, with `vlanid 300`, tags it with VLAN 300 — the switch port must trunk VLAN 300. The traffic never enters the FortiGate\'s SSID interface, so no policy on `iot-wlan` applies (and none is required). VLAN sub-interfaces on the SSID interface are the tunnel-mode design.',
    lesson: '2.1-traffic-modes-ssids',
  },
  {
    id: 'd2-003',
    topic: '2.1',
    type: 'single',
    difficulty: 2,
    stem: 'Refer to the exhibit. Guest-wlan is a tunnel-mode SSID with a FortiGate DHCP server. Guests connect and receive 10.20.20.x addresses, but cannot browse the internet. Corp users can. What is the most likely cause?',
    exhibit: String.raw`FGT-HQ # show firewall policy
config firewall policy
    edit 20
        set name "Corp-WiFi-to-Internet"
        set srcintf "corp-wlan"
        set dstintf "wan1"
        set srcaddr "all"
        set dstaddr "all"
        set action accept
        set schedule "always"
        set service "ALL"
        set nat enable
    next
end`,
    options: [
      'The guest DHCP scope is missing a default gateway, so clients cannot route',
      'There is no firewall policy from guest-wlan to wan1, so the implicit deny drops guest traffic',
      'Tunnel-mode SSIDs share the policy of the first SSID created, so guests are matched by policy 20 but blocked by NAT',
      'Guest traffic needs dtls-policy dtls-enabled before it can be forwarded to the internet',
    ],
    answer: [1],
    explanation: 'A tunnel SSID is an ordinary FortiOS interface. DHCP works because the FortiGate interface serves it locally, but forwarding needs a **policy with `srcintf "guest-wlan"`** (normally with NAT). Without one, the implicit deny drops the traffic. The exhibit shows no policy for guest-wlan at all, which by itself is enough to drop the traffic; a DHCP scope created for the SSID normally uses the interface IP as the gateway. Policies are never shared between SSIDs. Data channel encryption does not control forwarding.',
    lesson: '2.1-policies-data-channel',
  },
  {
    id: 'd2-004',
    topic: '2.1',
    type: 'multi',
    difficulty: 2,
    stem: 'Which two statements correctly compare tunnel-mode and local-bridge SSIDs? (Choose two.)',
    options: [
      'Clients of a tunnel-mode SSID keep the same IP address when they roam between APs managed by the same FortiGate',
      'Traffic from a local-bridge SSID is not subject to FortiGate firewall policies unless the wired path routes it through the FortiGate',
      'A local-bridge SSID requires an IP address and a DHCP server on the FortiGate SSID interface',
      'Tunnel-mode SSIDs cannot use WPA2-Enterprise authentication',
      'Local-bridge SSIDs stop working whenever the CAPWAP data channel uses clear text',
    ],
    answer: [0, 1],
    explanation: 'Tunnel SSIDs terminate on one FortiGate interface, so every AP delivers clients into the **same subnet** and they keep their address while roaming. Local-bridge traffic leaves at the AP\'s Ethernet port, so **FortiGate policies do not see it** unless the LAN routes it through the FortiGate. Bridge SSIDs get addressing from the wired network, not the SSID interface. Enterprise authentication works in both modes. The clear-text data channel setting has nothing to do with bridge SSIDs, whose data does not use the CAPWAP data channel.',
    lesson: '2.1-traffic-modes-ssids',
  },
  {
    id: 'd2-005',
    topic: '2.1',
    type: 'single',
    difficulty: 2,
    stem: 'An administrator wants the built-in radio of FWF-Branch (a FortiWiFi) to broadcast a local-bridge SSID. What is the result?',
    options: [
      'It works if vap-all bridge is set in the local radio profile',
      'It is not possible; the FortiWiFi local radio does not support bridge-mode SSIDs',
      'It works only if the SSID also uses DTLS data channel encryption',
      'It works only on the 5 GHz local radio',
    ],
    answer: [1],
    explanation: 'Fortinet states that **FortiWiFi does not support bridge mode SSIDs** on its built-in radio, and the `bridge` choice for SSID assignment is not available on FortiWiFi local radio platforms. Use tunnel mode on the local radio, or deploy a FortiAP for local bridging. Data channel encryption and band choice are unrelated.',
    lesson: '2.1-traffic-modes-ssids',
  },
  {
    id: 'd2-006',
    topic: '2.1',
    type: 'order',
    difficulty: 2,
    stem: 'Put the steps for building a FortiAP wireless mesh in the order Fortinet\'s guide describes.',
    items: [
      'Create the mesh backhaul SSID (traffic mode Mesh, mesh-backhaul enable)',
      'Create the FortiAP profile with one radio dedicated to the backhaul SSID',
      'Connect and authorize the wired mesh root AP with that profile',
      'Preconfigure each leaf AP with MESH_AP_TYPE, SSID, password and security',
      'Power on the leaf APs and authorize them on the controller',
      'Create firewall policies for the user SSIDs',
    ],
    explanation: 'Fortinet\'s sequence: **mesh root SSID → FortiAP profile → mesh root AP → leaf AP preconfiguration → authorize leaves → security policies**. The leaf must already know the backhaul SSID, password and security type before it can join over the air, and it still appears as waiting for authorization on the controller. Policies are required for user traffic, as with any SSID.',
    lesson: '2.1-traffic-modes-ssids',
  },
  {
    id: 'd2-007',
    topic: '2.1',
    type: 'single',
    difficulty: 3,
    stem: 'Refer to the exhibit. The leaf FortiAP never joins the mesh. The root AP broadcasts the backhaul SSID correctly. What should the administrator change on the leaf?',
    exhibit: String.raw`FGT-HQ # show wireless-controller vap mesh-bh
config wireless-controller vap
    edit "mesh-bh"
        set ssid "fgt-hq.mesh.root"
        set mesh-backhaul enable
        set security wpa3-sae
        set pmf enable
        set sae-h2e-only enable
        set sae-password ENC xxxxxxxxxxxxxxxx
    next
end

Commands entered on the leaf FortiAP:
cfg -a MESH_AP_TYPE=1
cfg -a MESH_AP_SSID=fgt-hq.mesh.root
cfg -a MESH_AP_PASSWD=<the SAE password>
cfg -c`,
    options: [
      'Set MESH_AP_TYPE=2 so the leaf uses the mesh link as its main uplink',
      'Set MESH_AP_SECURITY=2 so the leaf uses WPA3-SAE like the backhaul SSID',
      'Set MESH_ETH_BRIDGE=1 so the leaf can authenticate over Ethernet',
      'Remove MESH_AP_PASSWD, because WPA3-SAE backhauls use certificates',
    ],
    answer: [1],
    explanation: '`MESH_AP_SECURITY` defaults to **0 (open)**. Because the backhaul is WPA3-SAE, the leaf must use **`MESH_AP_SECURITY=2`** (1 is WPA/WPA2-Personal), then `cfg -c`. `MESH_AP_TYPE=1` (WiFi mesh) is already correct; 2 means Ethernet with mesh backup. `MESH_ETH_BRIDGE` bridges the leaf\'s Ethernet port onto the mesh and does not affect joining. SAE uses a password, not certificates.',
    lesson: '2.1-traffic-modes-ssids',
  },
  {
    id: 'd2-008',
    topic: '2.1',
    type: 'fill',
    difficulty: 1,
    stem: 'Which VAP option, set to enable, makes an SSID the wireless mesh backhaul? (Enter the CLI keyword.)',
    answer: ['mesh-backhaul', 'set mesh-backhaul enable', 'mesh-backhaul enable'],
    explanation: '`set mesh-backhaul enable` under `config wireless-controller vap` (default disable). It is available only with a WPA security type or open; Fortinet\'s mesh procedure uses WPA2-Personal or WPA3-SAE (WPA3-SAE with H2E-only is mandatory for 6 GHz backhauls).',
    lesson: '2.1-traffic-modes-ssids',
  },
  {
    id: 'd2-009',
    topic: '2.1',
    type: 'single',
    difficulty: 2,
    stem: 'Refer to the exhibit. After this change, throughput for tunnel-mode clients on a FortiGate with NP6 processors dropped sharply. Why?',
    exhibit: String.raw`config wireless-controller wtp-profile
    edit "FAP431G-hd"
        set dtls-policy dtls-enabled
    next
end`,
    options: [
      'DTLS on the data channel cannot be hardware-accelerated on the FortiGate, so the CPU encrypts every packet',
      'DTLS forces the AP radios to 20 MHz channels',
      'DTLS disables the CAPWAP control channel, so APs rejoin repeatedly',
      'DTLS makes the APs switch every SSID to local bridge mode',
    ],
    answer: [0],
    explanation: 'Fortinet notes that **DTLS cannot be hardware-accelerated** on the FortiGate, so `dtls-enabled` throughput is significantly lower than `clear-text` (which can be offloaded). If encryption is required on an NP-equipped FortiGate, `ipsec-vpn` can be offloaded and performs better. The data channel setting does not change channel width, does not disable the (always DTLS) control channel and does not change traffic modes.',
    lesson: '2.1-policies-data-channel',
  },
  {
    id: 'd2-010',
    topic: '2.1',
    type: 'multi',
    difficulty: 3,
    stem: 'Refer to the exhibit. The administrator wants tunnel-mode CAPWAP traffic from these APs offloaded to the FortiGate\'s NP. Which two conditions must be met? (Choose two.)',
    exhibit: String.raw`config wireless-controller wtp-profile
    edit "FAP231F-office"
        set dtls-policy dtls-enabled
    next
end
config system npu
    set capwap-offload disable
end`,
    options: [
      'Change dtls-policy to clear-text or ipsec-vpn',
      'Set capwap-offload enable under config system npu',
      'Change all SSIDs to local bridge mode',
      'Allow IP fragmentation of CAPWAP packets so large frames can be offloaded',
      'Enable dtls-in-kernel on the FortiAP profile',
    ],
    answer: [0, 1],
    explanation: 'CAPWAP offloading applies to tunnel-mode traffic and needs **`dtls-policy` `clear-text` or `ipsec-vpn`** plus **`config system npu` → `set capwap-offload enable`**. Fragmented CAPWAP traffic is *not* offloaded, so allowing fragmentation works against it. Local bridge traffic never reaches the FortiGate, so there would be nothing to offload. `dtls-in-kernel` speeds DTLS on the AP side but DTLS is still not offloaded on the FortiGate.',
    lesson: '2.1-policies-data-channel',
  },
  {
    id: 'd2-011',
    topic: '2.1',
    type: 'single',
    difficulty: 2,
    stem: 'Remote FortiAPs at employees\' homes connect to FGT-HQ over the internet. Their tunnel-mode data channel must be encrypted, and the NP6-equipped FortiGate should be able to offload it. Which dtls-policy meets both requirements?',
    options: [
      'clear-text',
      'dtls-enabled',
      'ipsec-vpn',
      'Any value, because the control channel is already DTLS-encrypted',
    ],
    answer: [2],
    explanation: '`ipsec-vpn` builds an automatic IPsec tunnel for the CAPWAP data, which is **encrypted** and **offloadable** on NP6-class FortiGates (the AP is usually the bottleneck). `clear-text` does not encrypt; `dtls-enabled` encrypts but cannot be hardware-accelerated. The control channel\'s DTLS protects only control messages, not client data.',
    lesson: '2.1-policies-data-channel',
  },
  {
    id: 'd2-012',
    topic: '2.1',
    type: 'single',
    difficulty: 1,
    stem: 'Refer to the exhibit. What does set intra-vap-privacy enable do on this SSID?',
    exhibit: String.raw`config wireless-controller vap
    edit "guest-wlan"
        set ssid "Guest"
        set security open
        set captive-portal enable
        set portal-type auth
        set selected-usergroups "guest-users"
        set intra-vap-privacy enable
    next
end`,
    options: [
      'Blocks traffic between clients connected to the Guest SSID',
      'Hides the Guest SSID from beacons',
      'Encrypts guest traffic between the AP and the FortiGate',
      'Prevents guests from reaching the captive portal until they accept a disclaimer',
    ],
    answer: [0],
    explanation: '`intra-vap-privacy` (default disable) **blocks communication between clients on the same SSID** — standard practice for guest networks. Hiding the SSID is `broadcast-ssid disable`; AP-to-FortiGate encryption is `dtls-policy` in the FortiAP profile; disclaimers are a captive portal `portal-type`.',
    lesson: '2.1-policies-data-channel',
  },
  {
    id: 'd2-013',
    topic: '2.1',
    type: 'match',
    difficulty: 2,
    stem: 'Match each FortiAP profile dtls-policy value to its behaviour.',
    pairs: [
      ['clear-text', 'Default; unencrypted data channel that FortiGates with hardware acceleration can offload'],
      ['dtls-enabled', 'DTLS-encrypted data channel; not hardware-accelerated on the FortiGate'],
      ['ipsec-vpn', 'Automatic IPsec tunnel for the data channel; can be offloaded on NP6-class FortiGates'],
    ],
    explanation: '`clear-text` is the default and fastest. `dtls-enabled` encrypts but costs the most throughput. `ipsec-vpn` encrypts and can be offloaded. A fourth option adds the FortiAP serial number to the first IKE messages (spelled `ipsec-sn-vpn` in the 7.6.3 CLI Reference and `ipsec-vpn-sn` in the FortiAP guide). The FortiGate and FortiAP settings must agree.',
    lesson: '2.1-policies-data-channel',
  },
  {
    id: 'd2-014',
    topic: '2.1',
    type: 'single',
    difficulty: 2,
    stem: 'An administrator tries to delete the tunnel-mode SSID old-wlan, which has a DHCP server configured on its interface. What must be done first?',
    options: [
      'Nothing; deleting the SSID removes its DHCP server automatically',
      'Delete the DHCP server on the old-wlan interface',
      'Deauthorize every FortiAP that broadcasts the SSID',
      'Change the SSID to local bridge mode',
    ],
    answer: [1],
    explanation: 'Fortinet notes that **you cannot delete an SSID (wireless interface) that has DHCP enabled** on it. Remove the DHCP server (and any other references such as policies or addresses) first. APs do not have to be deauthorized, and changing the traffic mode is unnecessary.',
    lesson: '2.1-traffic-modes-ssids',
  },
  {
    id: 'd2-015',
    topic: '2.1',
    type: 'single',
    difficulty: 2,
    stem: 'Refer to the exhibit. The administrator created the local-bridge SSID branch-wlan, but no FortiAP using this profile broadcasts it. Why?',
    exhibit: String.raw`config wireless-controller vap
    edit "branch-wlan"
        set ssid "Branch"
        set local-bridging enable
        set vlanid 100
    next
end
config wireless-controller wtp-profile
    edit "FAP231F-office"
        config radio-1
            set vap-all tunnel
        end
        config radio-2
            set vap-all tunnel
        end
    next
end`,
    options: [
      'Local-bridge SSIDs must be assigned through FortiEdge Cloud',
      'vap-all tunnel automatically assigns only tunnel-mode SSIDs; use vap-all bridge or list the SSID with vap-all manual',
      'VLAN 100 is reserved, so the SSID cannot be broadcast',
      'Bridge SSIDs are broadcast only by APs in a FortiAP group',
    ],
    answer: [1],
    explanation: '`vap-all tunnel` picks up **all tunnel-mode SSIDs** automatically, but not bridge SSIDs. Use `vap-all bridge` (all bridge SSIDs) or `vap-all manual` with `vaps "branch-wlan" …`. VLAN 100 is an ordinary VLAN ID, and neither FortiEdge Cloud nor FortiAP groups are needed to broadcast a bridge SSID.',
    lesson: '2.1-traffic-modes-ssids',
  },
  {
    id: 'd2-016',
    topic: '2.1',
    type: 'single',
    difficulty: 3,
    stem: 'An administrator needs two VAPs in the same VDOM — one tunnel, one local bridge — that both broadcast the SSID "Corp" to different APs. Which setting must be changed from its default?',
    options: [
      'config wireless-controller setting: set duplicate-ssid enable',
      'config wireless-controller global: set local-radio-vdom root',
      'config wireless-controller vap: set broadcast-ssid disable on one VAP',
      'config system settings: set gui-fortiap-split-tunneling enable',
    ],
    answer: [0],
    explanation: '`duplicate-ssid` under `config wireless-controller setting` controls whether VAPs in the same VDOM may use the same SSID name; its default is **disable**. `local-radio-vdom` selects the VDOM of a FortiWiFi\'s built-in radio. Hiding one SSID does not change the duplicate-name rule. The split-tunnelling GUI option is unrelated.',
    lesson: '2.1-traffic-modes-ssids',
  },

  // ---------------------------------------------------------------- 2.2
  {
    id: 'd2-017',
    topic: '2.2',
    type: 'single',
    difficulty: 1,
    stem: 'An administrator creates an SSID from the CLI and sets only the SSID name and a passphrase. Which security mode does it use?',
    options: [
      'open',
      'wpa-personal (WPA/WPA2 mixed)',
      'wpa2-only-personal with AES',
      'wpa3-sae-transition',
    ],
    answer: [2],
    explanation: 'The `security` default for a VAP is **`wpa2-only-personal`**, and `encrypt` defaults to AES. `wpa-personal` is the WPA/WPA2 mixed mode; WPA3 modes must be selected explicitly.',
    lesson: '2.2-personal-wpa3-mpsk',
  },
  {
    id: 'd2-018',
    topic: '2.2',
    type: 'single',
    difficulty: 2,
    stem: 'Refer to the exhibit. Which statement is true?',
    exhibit: String.raw`config wireless-controller vap
    edit "corp-wlan"
        set ssid "Corp"
        set security wpa3-sae-transition
        set pmf optional
        set passphrase ENC aaaaaaaaaaaaaaaa
        set sae-password ENC bbbbbbbbbbbbbbbb
        set schedule "always"
    next
end`,
    options: [
      'All clients must know both secrets to connect',
      'WPA2 clients connect with the passphrase; WPA3 clients connect with the sae-password using SAE',
      'Clients without PMF support are refused because WPA3 is enabled',
      'The sae-password is ignored in transition mode',
    ],
    answer: [1],
    explanation: 'In **SAE transition** mode the SSID has two secrets: WPA2 clients use **`passphrase`** (WPA2-PSK) and WPA3 clients use **`sae-password`** (SAE). `pmf optional` lets non-PMF WPA2 clients connect while PMF-capable clients use it. Clients need only the secret for their own method, and the SAE password is the one WPA3 clients use.',
    lesson: '2.2-personal-wpa3-mpsk',
  },
  {
    id: 'd2-019',
    topic: '2.2',
    type: 'multi',
    difficulty: 2,
    stem: 'For which three security modes do Fortinet\'s examples set pmf enable (PMF required)? (Choose three.)',
    options: [
      'wpa3-sae',
      'wpa3-only-enterprise',
      'owe',
      'wpa3-sae-transition',
      'wpa3-enterprise-transition',
      'wpa2-only-personal',
    ],
    answer: [0, 1, 2],
    explanation: '**WPA3-SAE, WPA3-Enterprise only and OWE** require PMF (`pmf enable`); so does 192-bit `wpa3-enterprise`. The **transition** modes use `pmf optional` so WPA2 clients can still connect. WPA2-Personal can run with PMF disabled (the default).',
    lesson: '2.2-personal-wpa3-mpsk',
  },
  {
    id: 'd2-020',
    topic: '2.2',
    type: 'multi',
    difficulty: 2,
    stem: 'A café wants its open guest network to be encrypted without handing out a password. Which two statements about OWE are true? (Choose two.)',
    options: [
      'Each client negotiates its own encryption keys without entering a password',
      'OWE does not authenticate users, so it can be combined with a captive portal or policy controls when identity matters',
      'OWE requires a RADIUS server to deliver per-user keys',
      'OWE uses the sae-password field as a shared key',
      'Every client, including old WPA2-only devices, can join an OWE-only SSID',
    ],
    answer: [0, 1],
    explanation: 'OWE (Wi-Fi Enhanced Open) uses an unauthenticated Diffie-Hellman exchange so **each client gets its own keys with no password**, but it **authenticates nobody**. No RADIUS and no SAE password are involved. An OWE-only SSID admits only OWE-capable clients; older devices need **OWE transition** (an open SSID paired with a hidden OWE SSID).',
    lesson: '2.2-personal-wpa3-mpsk',
  },
  {
    id: 'd2-021',
    topic: '2.2',
    type: 'single',
    difficulty: 3,
    stem: 'Refer to the exhibit. Which statement describes how clients use these two VAPs?',
    exhibit: String.raw`config wireless-controller vap
    edit "guest-wlan"
        set ssid "Guest"
        set security open
        set owe-transition enable
        set owe-transition-ssid "Guest-OWE"
    next
    edit "guest-owe"
        set ssid "Guest-OWE"
        set broadcast-ssid disable
        set security owe
        set pmf enable
        set owe-transition enable
        set owe-transition-ssid "Guest"
    next
end`,
    options: [
      'Clients see two SSIDs, Guest and Guest-OWE, and users must choose the encrypted one manually',
      'Legacy clients join the visible open SSID Guest; OWE-capable clients use the hidden OWE SSID Guest-OWE',
      'All clients join Guest-OWE, and Guest exists only for captive portal redirection',
      'OWE-capable clients are refused because the OWE VAP is hidden',
    ],
    answer: [1],
    explanation: 'This is **OWE transition** mode: an open SSID and a hidden OWE SSID that point to each other with `owe-transition-ssid`. Legacy devices connect to the **open** SSID; OWE-capable devices learn about the transition SSID and connect with **OWE encryption**. Users see only "Guest", the hidden OWE SSID is reachable by capable clients, and no captive portal is configured here.',
    lesson: '2.2-personal-wpa3-mpsk',
  },
  {
    id: 'd2-022',
    topic: '2.2',
    type: 'fill',
    difficulty: 1,
    stem: 'A WPA2-Personal passphrase on a FortiOS SSID must be at least 8 characters long. What is the maximum length in characters? (Enter a number.)',
    answer: ['63'],
    explanation: 'A WPA2-Personal passphrase is **8 to 63** printable characters (a raw 64-hex-digit key is the other form defined by the standard). Fortinet\'s GUI procedure states the 8–63 limit.',
    lesson: '2.2-personal-wpa3-mpsk',
  },
  {
    id: 'd2-023',
    topic: '2.2',
    type: 'single',
    difficulty: 2,
    stem: 'Refer to the exhibit. A security camera connects to the IoT SSID using the key cam-key-1. Which VLAN is it placed in?',
    exhibit: String.raw`config wireless-controller mpsk-profile
    edit "iot-mpsk"
        config mpsk-group
            edit "cameras"
                set vlan-type fixed-vlan
                set vlan-id 300
                config mpsk-key
                    edit "cam-key-1"
                        set passphrase ENC xxxxxxxx
                        set mpsk-schedules "always"
                    next
                end
            next
            edit "printers"
                set vlan-type fixed-vlan
                set vlan-id 310
                config mpsk-key
                    edit "prn-key-1"
                        set passphrase ENC yyyyyyyy
                        set mpsk-schedules "always"
                    next
                end
            next
        end
    next
end
config wireless-controller vap
    edit "iot-wlan"
        set ssid "IoT"
        set security wpa2-only-personal
        set mpsk-profile "iot-mpsk"
        set dynamic-vlan enable
        set vlanid 0
    next
end`,
    options: [
      'VLAN 300',
      'VLAN 310',
      'No VLAN, because vlanid is 0',
      'The VLAN returned by a RADIUS server',
    ],
    answer: [0],
    explanation: 'With MPSK, the **group of the key the client uses** sets the VLAN: `cam-key-1` is in group `cameras` with `fixed-vlan` **300**. Using an MPSK profile turns on dynamic VLAN (shown here). The VAP\'s `vlanid` is only a fallback for clients that get no other VLAN; no RADIUS server is involved.',
    lesson: '2.2-personal-wpa3-mpsk',
  },
  {
    id: 'd2-024',
    topic: '2.2',
    type: 'multi',
    difficulty: 2,
    stem: 'Which two statements about MPSK profiles in FortiOS 7.6 are true? (Choose two.)',
    options: [
      'Only one MPSK profile can be assigned to a VAP at a time',
      'When MPSK is enabled on an SSID, the single passphrase is dropped and dynamic VLAN is enabled automatically',
      'MPSK profiles support only WPA2-Personal',
      'Every MPSK key must be bound to a client MAC address',
      'MPSK requires the SSID to use local bridge mode',
    ],
    answer: [0, 1],
    explanation: 'Fortinet: **one MPSK profile per VAP**, and enabling MPSK **drops the single passphrase and enables dynamic VLAN**. In 7.6.0, MPSK profiles also support **WPA3-SAE and WPA3-SAE transition**. The MAC address on a key is optional. MPSK works in tunnel and bridge modes (Fortinet\'s WPA2 example happens to use local bridging).',
    lesson: '2.2-personal-wpa3-mpsk',
  },
  {
    id: 'd2-025',
    topic: '2.2',
    type: 'single',
    difficulty: 3,
    stem: 'Refer to the exhibit. Laptops using PEAP connect, but laptops configured for EAP-TLS fail. All members of wifi-staff are local FortiGate users. What is the cause?',
    exhibit: String.raw`config wireless-controller vap
    edit "corp-wlan"
        set ssid "Corp"
        set security wpa2-only-enterprise
        set auth usergroup
        set usergroup "wifi-staff"
        set schedule "always"
    next
end`,
    options: [
      'EAP-TLS requires security wpa3-enterprise',
      'Authentication against local FortiGate user groups supports PEAP only, not EAP-TLS',
      'EAP-TLS requires pmf enable on the SSID',
      'EAP-TLS works only on local-bridge SSIDs',
    ],
    answer: [1],
    explanation: 'Fortinet states that **authentication with local user groups supports only PEAP, not EAP-TLS**. For certificate-based EAP-TLS, use `auth radius` with a RADIUS server that supports it (for example FortiAuthenticator or NPS). WPA2-Enterprise supports EAP-TLS in general, PMF is not an EAP-TLS requirement, and the traffic mode does not decide the EAP method.',
    lesson: '2.2-enterprise-portal-mac',
  },
  {
    id: 'd2-026',
    topic: '2.2',
    type: 'single',
    difficulty: 2,
    stem: 'Refer to the exhibit. The administrator wants visitors on this SSID to accept an acceptable use policy page after connecting. What should the administrator know?',
    exhibit: String.raw`config wireless-controller vap
    edit "visitor-wlan"
        set ssid "Visitor"
        set security wpa2-only-enterprise
        set auth radius
        set radius-server "FAC-HQ"
    next
end`,
    options: [
      'Set captive-portal enable with portal-type disclaimer; it works with any security mode',
      'Captive portal is not supported with WPA/WPA2-Enterprise or WPA3-Enterprise modes; use a personal, OWE or open mode for a portal SSID',
      'Set portal-type auth+disclaimer; Enterprise SSIDs support only that portal type',
      'Disclaimers must be configured on FAC-HQ, because the RADIUS server presents the portal',
    ],
    answer: [1],
    explanation: 'Fortinet\'s SSID and captive portal pages both state that **captive portal is not supported for WPA/WPA2-Enterprise or WPA3-Enterprise** security modes. A disclaimer portal needs an SSID using open, OWE or a personal mode (Fortinet\'s examples use WPA3-SAE) with `captive-portal enable` and `portal-type disclaimer` (tunnel mode). The RADIUS server does not serve the portal page.',
    lesson: '2.2-enterprise-portal-mac',
  },
  {
    id: 'd2-027',
    topic: '2.2',
    type: 'match',
    difficulty: 2,
    stem: 'Match each captive portal portal-type to what the user sees.',
    pairs: [
      ['auth', 'A login page; no access beyond the AP until valid credentials are entered'],
      ['auth+disclaimer', 'A login page followed by a disclaimer the user must accept'],
      ['disclaimer', 'Only a disclaimer to accept, with no login page'],
      ['email-collect', 'A page that asks for the user\'s email address, with no login page'],
    ],
    explanation: 'FortiOS GUI portal types: **Authentication** (`auth`), **Disclaimer + Authentication** (`auth+disclaimer`), **Disclaimer Only** (`disclaimer`) and **Email Collection** (`email-collect`, enabled in Feature Visibility). CLI-only types include `auth-mac`, `external-auth`, `external-macauth`, `cmcc` and `cmcc-macauth`.',
    lesson: '2.2-enterprise-portal-mac',
  },
  {
    id: 'd2-028',
    topic: '2.2',
    type: 'single',
    difficulty: 3,
    stem: 'A branch uses a local-bridge guest SSID and wants the FortiGate\'s built-in captive portal. According to Fortinet\'s portal type table, which portal-type is available in bridge mode?',
    options: [
      'auth',
      'auth+disclaimer',
      'disclaimer',
      'email-collect',
    ],
    answer: [0],
    explanation: 'In Fortinet\'s table **Authentication (`auth`) is available in tunnel and bridge** modes, while Disclaimer + Authentication, Disclaimer Only and Email Collection are listed for **tunnel** mode only. Bridge mode also has CLI-only external portal types (`external-auth`, `external-macauth`, `cmcc`, `cmcc-macauth`).',
    lesson: '2.2-enterprise-portal-mac',
  },
  {
    id: 'd2-029',
    topic: '2.2',
    type: 'single',
    difficulty: 2,
    stem: 'Refer to the exhibit. Which clients can associate with the IoT SSID (assuming they know the passphrase)?',
    exhibit: String.raw`config firewall address
    edit "old-tablet"
        set type mac
        set macaddr "02:1a:2b:3c:4d:5e"
    next
end
config firewall addrgrp
    edit "iot-blocked"
        set member "old-tablet"
    next
end
config wireless-controller vap
    edit "iot-wlan"
        set ssid "IoT"
        set passphrase ENC xxxxxxxxxxxxxxxx
        set address-group "iot-blocked"
        set address-group-policy deny
    next
end`,
    options: [
      'Only 02:1a:2b:3c:4d:5e',
      'Every client except 02:1a:2b:3c:4d:5e',
      'No clients, because a deny policy blocks the whole SSID',
      'Every client, because MAC filtering also needs radius-mac-auth enable',
    ],
    answer: [1],
    explanation: '`address-group-policy deny` **blocks clients whose MAC addresses are in the address group** and lets everyone else connect. `allow` would admit only group members, and `disable` (the default) ignores the group. The address-group filter is separate from RADIUS MAC authentication (`radius-mac-auth`).',
    lesson: '2.2-enterprise-portal-mac',
  },
  {
    id: 'd2-030',
    topic: '2.2',
    type: 'single',
    difficulty: 1,
    stem: 'Why does Fortinet recommend using SSID MAC address filtering only together with other security measures such as encryption?',
    options: [
      'MAC filtering disables WPA2 encryption on the SSID',
      'MAC addresses are visible in wireless traffic and can be spoofed by an attacker',
      'MAC filtering works only for 2.4 GHz clients',
      'MAC filtering is applied only after DHCP, so attackers can still get an address',
    ],
    answer: [1],
    explanation: 'Client MAC addresses are sent in the clear in 802.11 headers, so an attacker can observe an allowed MAC and **impersonate it**. MAC filtering does not disable encryption, works in any band, and is checked when the client associates.',
    lesson: '2.2-enterprise-portal-mac',
  },
  {
    id: 'd2-031',
    topic: '2.2',
    type: 'order',
    difficulty: 1,
    stem: 'Put the steps for providing temporary guest WiFi access with FortiOS Guest Management in order.',
    items: [
      'Create a guest user group',
      'Create guest accounts in Guest Management and deliver the credentials by print, email or SMS',
      'Configure the guest SSID with captive portal authentication using the guest group',
      'Guests log in through the captive portal until their accounts expire',
    ],
    explanation: 'Fortinet\'s guest procedure: create **guest user groups**, create **guest accounts** (*User & Authentication > Guest Management*) and send the credentials, configure the **SSID captive portal** with that group, then guests **log in** until the account expires.',
    lesson: '2.2-enterprise-portal-mac',
  },
  {
    id: 'd2-032',
    topic: '2.2',
    type: 'single',
    difficulty: 2,
    stem: 'Refer to the exhibit. How does the GUI show this SSID\'s security mode, and what does it require?',
    exhibit: String.raw`config wireless-controller vap
    edit "secure-wlan"
        set ssid "Secure"
        set security wpa3-enterprise
        set pmf enable
        set auth radius
        set radius-server "RADIUS-NPS"
    next
end`,
    options: [
      'WPA3 Enterprise Transition; PMF is optional so WPA2 clients can join',
      'WPA3 Enterprise 192-bit; PMF is mandatory',
      'WPA3 Enterprise Only; it works without a RADIUS server',
      'WPA3-SAE; users enter a shared password',
    ],
    answer: [1],
    explanation: 'The keyword `wpa3-enterprise` is the **192-bit** mode with **PMF mandatory**. It is not offered in the GUI by default, but once configured from the CLI the GUI lists it as WPA3 Enterprise 192-bit. `wpa3-only-enterprise` is WPA3 Enterprise Only (PMF mandatory) and `wpa3-enterprise-transition` uses PMF optional. Every Enterprise mode needs RADIUS or a user group; SAE is the personal mode.',
    lesson: '2.2-enterprise-portal-mac',
  },
  {
    id: 'd2-033',
    topic: '2.2',
    type: 'fill',
    difficulty: 2,
    stem: 'A tunnel-mode SSID with captive-portal enable should send users to a portal on an external web server instead of the FortiGate. Which VAP option holds the URL of that external server? (Enter the CLI keyword.)',
    answer: ['external-web', 'set external-web'],
    explanation: '`set external-web "<FQDN or URL>"` points the captive portal at an external server. The portal script posts credentials back to the FortiGate at `https://<FortiGate>:1000/fgtauth` with the `magic` value; `config user setting` → `set auth-secure-http enable` keeps that exchange on HTTPS.',
    lesson: '2.2-enterprise-portal-mac',
  },
  {
    id: 'd2-034',
    topic: '2.2',
    type: 'single',
    difficulty: 2,
    stem: 'Refer to the exhibit. Which statement is supported by the output?',
    exhibit: String.raw`FGT-HQ # diagnose wireless-controller wlac -d sta online
vf=0 wtp=1 rId=2 wlan=corp-wlan vlan_id=200 ip=10.20.200.14 ip6=:: mac=02:1a:2b:3c:4d:61 vci= host=LT-JDOE user=jdoe group=wifi-staff signal=-54 noise=-95 idle=1 bw=3 use=6 chan=44 radio_type=11AX_5G security=wpa2_only_enterprise mpsk= encrypt=aes cp_authed=no online=yes mimo=2
vf=0 wtp=2 rId=1 wlan=iot-wlan vlan_id=300 ip=10.20.30.31 ip6=:: mac=02:1a:2b:3c:4d:72 vci= host=CAM-03 user= group= signal=-61 noise=-94 idle=4 bw=0 use=6 chan=6 radio_type=11N security=wpa2_only_personal mpsk= encrypt=aes cp_authed=no online=yes mimo=1`,
    options: [
      'jdoe authenticated with 802.1X as a member of wifi-staff and is in VLAN 200',
      'CAM-03 passed captive portal authentication',
      'Both clients use WPA3',
      'jdoe is connected on the 2.4 GHz band',
    ],
    answer: [0],
    explanation: 'The first line shows `security=wpa2_only_enterprise`, `user=jdoe`, `group=wifi-staff` and `vlan_id=200` — an 802.1X user placed in VLAN 200. `cp_authed=no` on both lines means neither went through a captive portal. Both clients use WPA2 (enterprise and personal). jdoe is on channel 44, `radio_type=11AX_5G`, which is 5 GHz.',
    lesson: '2.2-enterprise-portal-mac',
  },
  {
    id: 'd2-035',
    topic: '2.2',
    type: 'single',
    difficulty: 3,
    stem: 'An attacker sets up a fake AP with the same SSID and the same WPA3-SAE password as a coffee shop\'s network. Which SSID feature lets clients detect that the AP is not genuine?',
    options: [
      'sae-h2e-only',
      'SAE-PK (sae-pk with a sae-private-key)',
      'pmf optional',
      'owe-transition',
    ],
    answer: [1],
    explanation: '**SAE-PK** binds the password to a public key; the genuine AP proves possession of the private key (`sae-private-key`), so an evil twin that knows only the password fails. FortiOS can generate the key and matching password with `execute wireless-controller create-sae-pk`. H2E changes how the password element is derived but does not authenticate the AP. PMF and OWE transition do not stop an attacker who knows the password.',
    lesson: '2.2-personal-wpa3-mpsk',
  },
  {
    id: 'd2-036',
    topic: '2.2',
    type: 'fill',
    difficulty: 3,
    stem: 'Complete the FortiOS command that generates an SAE-PK private key and password for the SSID Corp: "execute wireless-controller ________ Corp prime256v1". (Enter the missing keyword.)',
    answer: ['create-sae-pk'],
    explanation: '`execute wireless-controller create-sae-pk <SSID> <curve>` (curves `prime256v1`, `secp384r1`, `secp521r1`) prints an SAE password and private key. Paste them into `sae-password` and `sae-private-key` on a WPA3-SAE SSID with `sae-pk enable`.',
    lesson: '2.2-personal-wpa3-mpsk',
  },

  // ---------------------------------------------------------------- 2.3
  {
    id: 'd2-037',
    topic: '2.3',
    type: 'single',
    difficulty: 2,
    stem: 'Refer to the exhibit. The SSID corp-wlan has dynamic-vlan enable and vlanid 100. The RADIUS server returns these attributes for user asmith. Which VLAN does asmith\'s laptop use?',
    exhibit: String.raw`RADIUS Access-Accept for user asmith (from RADIUS-NPS, 10.0.1.20)

Attribute                       Value
Tunnel-Type (64)                VLAN (13)
Tunnel-Medium-Type (65)         802 (6)
Tunnel-Private-Group-ID (81)    200`,
    options: [
      'VLAN 100, because the SSID vlanid always wins',
      'VLAN 200, from Tunnel-Private-Group-ID',
      'VLAN 13, from Tunnel-Type',
      'VLAN 6, from Tunnel-Medium-Type',
    ],
    answer: [1],
    explanation: 'With `dynamic-vlan enable`, FortiOS uses the RADIUS attributes **64 = 13 (VLAN), 65 = 6 (IEEE-802) and 81 = VLAN ID**, so asmith lands in **VLAN 200**. The SSID\'s `vlanid` (100) is only the default for users whose reply carries no VLAN. 13 and 6 are the type values that identify the tunnel as a VLAN over 802, not VLAN IDs.',
    lesson: '2.3-vlans-nac',
  },
  {
    id: 'd2-038',
    topic: '2.3',
    type: 'fill',
    difficulty: 2,
    stem: 'Which IETF RADIUS attribute number carries the VLAN ID (Tunnel-Private-Group-ID) for dynamic VLAN assignment? (Enter a number.)',
    answer: ['81'],
    explanation: 'Tunnel-Private-Group-ID is attribute **81** and carries the VLAN ID (1–4094). It must be returned with Tunnel-Type (64) = 13 and Tunnel-Medium-Type (65) = 6.',
    lesson: '2.3-vlans-nac',
  },
  {
    id: 'd2-039',
    topic: '2.3',
    type: 'single',
    difficulty: 2,
    stem: 'Refer to the exhibit. The RADIUS policy for contractors returns Access-Accept with no tunnel attributes. Which VLAN do contractors use?',
    exhibit: String.raw`config wireless-controller vap
    edit "corp-wlan"
        set ssid "Corp"
        set security wpa2-only-enterprise
        set auth radius
        set radius-server "RADIUS-NPS"
        set dynamic-vlan enable
        set vlanid 100
    next
end`,
    options: [
      'VLAN 1, the native VLAN',
      'VLAN 100, the SSID default VLAN',
      'No VLAN; the client is rejected because dynamic VLAN is enabled',
      'A VLAN chosen round-robin from the existing VLAN interfaces',
    ],
    answer: [1],
    explanation: 'Fortinet: if the user\'s RADIUS record does not specify a VLAN ID, the user is assigned to the **default VLAN for the SSID** — here `vlanid 100`. Dynamic VLAN does not reject users without attributes, and round-robin selection belongs to VLAN pooling, which is not configured.',
    lesson: '2.3-vlans-nac',
  },
  {
    id: 'd2-040',
    topic: '2.3',
    type: 'single',
    difficulty: 2,
    stem: 'Refer to the exhibit. The administrator wants clients spread across VLANs 101–103, but the configuration does not give the expected result. Why?',
    exhibit: String.raw`config wireless-controller vap
    edit "branch-wlan"
        set ssid "Branch"
        set local-bridging enable
        set vlan-pooling round-robin
        config vlan-pool
            edit 101
            next
            edit 102
            next
            edit 103
            next
        end
    next
end`,
    options: [
      'Round-robin needs a FortiAP group in each pool entry',
      'VLAN pooling load balancing is available only for tunnel-mode SSIDs',
      'VLAN pools need at least four VLANs',
      'Round-robin works only with WPA2-Enterprise SSIDs',
    ],
    answer: [1],
    explanation: 'Fortinet: **VLAN pooling load balancing (round-robin and hash) is available only for SSIDs operating in tunnel mode**. This SSID is local bridge. FortiAP groups are used with `vlan-pooling wtp-group`, not round-robin. There is no four-VLAN minimum, and pooling does not depend on the security mode.',
    lesson: '2.3-vlans-nac',
  },
  {
    id: 'd2-041',
    topic: '2.3',
    type: 'single',
    difficulty: 2,
    stem: 'Refer to the exhibit. A client associates to the Corp SSID through FP231FTF20000003. Which VLAN does it get?',
    exhibit: String.raw`config wireless-controller wtp-group
    edit "floor1"
        config wtp-list
            edit "FP231FTF20000001"
            next
        end
    next
    edit "floor2"
        config wtp-list
            edit "FP231FTF20000003"
            next
        end
    next
end
config wireless-controller vap
    edit "corp-wlan"
        set ssid "Corp"
        set vlan-pooling wtp-group
        config vlan-pool
            edit 101
                set wtp-group "floor1"
            next
            edit 102
                set wtp-group "floor2"
            next
        end
    next
end`,
    options: [
      'VLAN 101',
      'VLAN 102',
      'VLAN 101 or 102, alternating per client',
      'The SSID default VLAN, because wtp-group pooling needs RADIUS',
    ],
    answer: [1],
    explanation: '`vlan-pooling wtp-group` assigns the VLAN mapped to the **FortiAP group of the AP the client joins**. FP231FTF20000003 is in floor2, mapped to **VLAN 102**. Alternating assignment would be a load-balancing method (round-robin/hash). No RADIUS is involved.',
    lesson: '2.3-vlans-nac',
  },
  {
    id: 'd2-042',
    topic: '2.3',
    type: 'multi',
    difficulty: 3,
    stem: 'Which two statements about VLAN pooling on a FortiOS 7.6 SSID are true? (Choose two.)',
    options: [
      'FortiOS automatically adds the pool\'s load-balancing VLANs to a zone named after the SSID interface followed by .zone',
      'If the VLAN pool contains no valid VLAN ID, the SSID\'s static VLAN ID setting is used',
      'FortiOS creates the VLAN interfaces and DHCP servers for each pool VLAN automatically',
      'vlan-pooling is enabled with round-robin by default',
      'A VLAN pool can use hash load balancing on a local-bridge SSID',
    ],
    answer: [0, 1],
    explanation: 'Fortinet: load-balancing VLANs are added to a zone named **`<SSID interface>.zone`**, and **if the pool has no valid VLAN ID, the SSID\'s static `vlanid` is used**. You must still configure each VLAN\'s network and DHCP settings. The default is `vlan-pooling disable`. Load balancing (round-robin or hash) is tunnel-mode only.',
    lesson: '2.3-vlans-nac',
  },
  {
    id: 'd2-043',
    topic: '2.3',
    type: 'order',
    difficulty: 2,
    stem: 'An SSID uses FortiOS wireless NAC. Put the events for a client that matches a NAC policy in order.',
    items: [
      'The client connects to the SSID',
      'The client is placed in the onboarding VLAN from the NAC profile',
      'The FortiGate collects the client\'s device or user information',
      'The client matches a NAC policy and the controller disconnects it',
      'The client reconnects and is placed in the VLAN from the SSID policy',
    ],
    explanation: 'With wireless NAC every client first lands in the NAC profile\'s **onboarding VLAN**. After the FortiGate captures its information (Fortinet\'s example notes up to about two minutes), a client that matches a `user nac-policy` is **disconnected**; when it **reconnects**, it gets the VLAN of the policy\'s `ssid-policy`. Non-matching clients stay in the onboarding VLAN.',
    lesson: '2.3-vlans-nac',
  },
  {
    id: 'd2-044',
    topic: '2.3',
    type: 'single',
    difficulty: 2,
    stem: 'Refer to the exhibit. Which statement about the client 02:1a:2b:3c:4d:5e is correct?',
    exhibit: String.raw`FGT-HQ # diagnose wireless-controller wlac_hlp -c sta-nac
STA (001/002) vfid,mac: 0, 02:1a:2b:3c:4d:5e
    ip                 : 10.20.200.15
    wlan               : corp-wlan(tunnel)
    vlan-id(oper/dflt) : 200/100
    matched nac-policy : printers
STA (002/002) vfid,mac: 0, 02:1a:2b:3c:4d:61
    ip                 : 10.20.100.22
    wlan               : corp-wlan(tunnel)
    vlan-id(oper/dflt) : 100/100
    matched nac-policy : N/A`,
    options: [
      'It matched the NAC policy printers and now operates in VLAN 200 instead of the onboarding VLAN 100',
      'It is still in the onboarding VLAN and waiting for a policy match',
      'It was assigned VLAN 200 by a RADIUS Tunnel-Private-Group-ID attribute',
      'It is connected to a local-bridge SSID, so NAC does not apply',
    ],
    answer: [0],
    explanation: '`vlan-id(oper/dflt)` shows the **operational** VLAN (200) and the **default/onboarding** VLAN (100); `matched nac-policy : printers` confirms the NAC match. The second client matched nothing and stays in VLAN 100. The output identifies a NAC match, not a RADIUS assignment, and `corp-wlan(tunnel)` shows a tunnel-mode SSID.',
    lesson: '2.3-vlans-nac',
  },
  {
    id: 'd2-045',
    topic: '2.3',
    type: 'match',
    difficulty: 3,
    stem: 'Match each FortiOS wireless NAC configuration object to its role.',
    pairs: [
      ['config wireless-controller nac-profile', 'Defines the onboarding VLAN interface for new clients'],
      ['config wireless-controller vap (nac / nac-profile)', 'Enables NAC on the SSID and selects the NAC profile'],
      ['config wireless-controller ssid-policy', 'Names the VLAN that matched clients are moved into'],
      ['config user nac-policy', 'Holds the matching criteria (device, user group or EMS tag) and references the SSID policy'],
    ],
    explanation: 'The chain is: **NAC profile** (`onboarding-vlan`) → enabled on the **VAP** (`set nac enable`, `set nac-profile`) → **NAC policy** (`category device|firewall-user|ems-tag` plus criteria) → **SSID policy** (`set vlan`) that sets the destination VLAN.',
    lesson: '2.3-vlans-nac',
  },
  {
    id: 'd2-046',
    topic: '2.3',
    type: 'multi',
    difficulty: 2,
    stem: 'Which three category values can a FortiOS user nac-policy use to match wireless clients for VLAN assignment? (Choose three.)',
    options: [
      'device',
      'firewall-user',
      'ems-tag',
      'rssi',
      'radio-band',
      'dhcp-option',
    ],
    answer: [0, 1, 2],
    explanation: 'Fortinet\'s wireless NAC examples match on **`device`** properties (MAC, vendor, type, OS…), **`firewall-user`** (authenticated user group) and **`ems-tag`** (FortiClient EMS tag). Signal strength, band and DHCP options are not NAC policy categories.',
    lesson: '2.3-vlans-nac',
  },
  {
    id: 'd2-047',
    topic: '2.3',
    type: 'single',
    difficulty: 2,
    stem: 'Refer to the exhibit. AP-Floor2 connects to an access switch port configured as an untagged access port in VLAN 10 (the AP management VLAN). Clients of this SSID associate but never get an IP address. What is the most likely fix?',
    exhibit: String.raw`config wireless-controller vap
    edit "iot-wlan"
        set ssid "IoT"
        set security wpa2-only-personal
        set passphrase ENC xxxxxxxxxxxxxxxx
        set local-bridging enable
        set vlanid 300
    next
end`,
    options: [
      'Configure the switch port as a trunk that carries VLAN 300 tagged (with VLAN 10 for the AP)',
      'Add an IP address and DHCP server to the iot-wlan interface on the FortiGate',
      'Enable dynamic-vlan on the SSID',
      'Change dtls-policy to dtls-enabled',
    ],
    answer: [0],
    explanation: 'A local-bridge SSID with `vlanid 300` makes the AP **tag client frames with VLAN 300** on its uplink. An access port in VLAN 10 drops or misplaces those frames, so DHCP never reaches the VLAN 300 server. Trunk VLAN 300 (keeping VLAN 10 for AP management). The FortiGate SSID interface does not carry bridged traffic, dynamic VLAN needs a source of VLAN assignments, and the data channel setting does not affect bridged traffic.',
    lesson: '2.3-vlans-nac',
  },
  {
    id: 'd2-048',
    topic: '2.3',
    type: 'single',
    difficulty: 2,
    stem: 'A tunnel-mode SSID uses RADIUS dynamic VLAN assignment for VLANs 200 and 210. Where must the administrator create the VLAN interfaces on the FortiGate?',
    options: [
      'As VLAN sub-interfaces of the SSID interface (interface corp-wlan, vlanid 200 and 210)',
      'As VLAN sub-interfaces of the physical port that FortiAPs connect to',
      'Nowhere; the FortiAP creates them automatically',
      'In FortiEdge Cloud, which pushes them to the FortiGate',
    ],
    answer: [0],
    explanation: 'For tunnel-mode SSIDs, client traffic arrives on the SSID interface, so the dynamic VLANs are **VLAN sub-interfaces of the SSID interface** (`set interface "corp-wlan"`, `set vlanid 200`), each with an IP, DHCP server and policies. Sub-interfaces on the AP-facing port would be the design for the AP\'s own management VLAN or for bridged traffic routed by the FortiGate. Nothing creates them automatically.',
    lesson: '2.3-vlans-nac',
  },
  {
    id: 'd2-049',
    topic: '2.3',
    type: 'fill',
    difficulty: 1,
    stem: 'Which vlan-pooling value assigns VLANs according to the FortiAP group of the AP a client joins? (Enter the CLI value.)',
    answer: ['wtp-group'],
    explanation: '`set vlan-pooling wtp-group`, with each `config vlan-pool` entry (the VLAN ID) naming a `wtp-group`. The other values are `round-robin` and `hash` (tunnel-mode load balancing) and `disable` (default).',
    lesson: '2.3-vlans-nac',
  },
  {
    id: 'd2-050',
    topic: '2.3',
    type: 'single',
    difficulty: 2,
    stem: 'A hospital wants one SSID across a six-floor building, with clients on each floor in that floor\'s VLAN. Devices use WPA2-Personal, so no RADIUS attributes are available. Which design fits?',
    options: [
      'One SSID per floor, each with its own vlanid',
      'FortiAP groups per floor and vlan-pooling wtp-group on the SSID',
      'vlan-pooling hash so each floor hashes to the same VLAN',
      'Wireless NAC with an EMS-tag policy per floor',
    ],
    answer: [1],
    explanation: '**VLAN assignment by FortiAP group** does exactly this: group the APs by floor and map each group to a VLAN with `vlan-pooling wtp-group`. One SSID per floor would work but defeats the one-SSID requirement and adds airtime overhead. Hash pooling balances load; it does not follow location. NAC with EMS tags matches endpoints, not where they connect.',
    lesson: '2.3-vlans-nac',
  },
  {
    id: 'd2-051',
    topic: '2.3',
    type: 'single',
    difficulty: 2,
    stem: 'An administrator configures config wireless-controller nac-profile for the SSID corp-wlan. What value does set onboarding-vlan expect?',
    options: [
      'The name of a VLAN interface, such as corp-v100, created under the SSID interface',
      'A numeric VLAN ID between 1 and 4094',
      'The name of a FortiAP group',
      'The name of a firewall address group of MAC addresses',
    ],
    answer: [0],
    explanation: 'In the 7.6.3 CLI Reference `onboarding-vlan` is a **VLAN interface name** (up to 35 characters). Fortinet\'s example creates VLAN sub-interfaces on the SSID interface (for example `vap_v100` with `set interface "wifi.fap.01"`, `set vlanid 100`) and references the interface by name. The SSID policy\'s `set vlan` also takes an interface name. FortiAP groups belong to VLAN pooling, and MAC address groups to SSID MAC filtering.',
    lesson: '2.3-vlans-nac',
  },
  {
    id: 'd2-052',
    topic: '2.3',
    type: 'multi',
    difficulty: 2,
    stem: 'Which three FortiOS features can place clients of a single SSID into different VLANs? (Choose three.)',
    options: [
      'RADIUS dynamic VLAN assignment (Tunnel-Private-Group-ID)',
      'MPSK groups with fixed VLAN IDs',
      'VLAN pooling by FortiAP group',
      'DHCP option 138',
      'DARRP',
      'intra-vap-privacy',
    ],
    answer: [0, 1, 2],
    explanation: '**RADIUS dynamic VLAN**, **MPSK group VLANs** and **VLAN pooling** (by FortiAP group, or round-robin/hash) all assign VLANs per client on one SSID; wireless NAC is another. DHCP option 138 is FortiAP controller discovery, DARRP picks radio channels, and intra-VAP privacy blocks client-to-client traffic.',
    lesson: '2.3-vlans-nac',
  },
];
