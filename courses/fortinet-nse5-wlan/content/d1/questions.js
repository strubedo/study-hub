// Domain 1 — Wireless fundamentals and FortiAP management question bank (original, exam-style).
export default [
  // ---------------------------------------------------------------- 1.1
  {
    id: 'd1-001',
    topic: '1.1',
    type: 'single',
    difficulty: 1,
    stem: 'A vendor markets an access point as "Wi-Fi 6E". Which statement describes that product correctly?',
    options: [
      'It implements 802.11be and can use 320 MHz channels in 6 GHz',
      'It implements 802.11ax and can also operate in the 6 GHz band',
      'It implements 802.11ac Wave 2 with an extra 5 GHz radio',
      'It implements 802.11ax but only in the 2.4 GHz and 5 GHz bands',
    ],
    answer: [1],
    explanation: '**Wi-Fi 6E** is the Wi-Fi Alliance name for **802.11ax operating in 6 GHz** (FortiOS band `802.11ax-6G`). Plain Wi-Fi 6 is 802.11ax in 2.4/5 GHz, so "only 2.4 and 5 GHz" describes Wi-Fi 6, not 6E. 802.11be with 320 MHz channels is Wi-Fi 7. 802.11ac Wave 2 is Wi-Fi 5 and has nothing to do with 6 GHz.',
    lesson: '1.1-standards-rf',
  },
  {
    id: 'd1-002',
    topic: '1.1',
    type: 'match',
    difficulty: 1,
    stem: 'Match each IEEE amendment (and band, where it matters) to its Wi-Fi Alliance generation name.',
    pairs: [
      ['802.11n', 'Wi-Fi 4'],
      ['802.11ac', 'Wi-Fi 5'],
      ['802.11ax in 2.4/5 GHz', 'Wi-Fi 6'],
      ['802.11ax in 6 GHz', 'Wi-Fi 6E'],
      ['802.11be', 'Wi-Fi 7'],
    ],
    explanation: 'The Wi-Fi Alliance numbered generations from 802.11n onward: 802.11n = Wi-Fi 4, 802.11ac = Wi-Fi 5, 802.11ax = Wi-Fi 6, 802.11ax extended into 6 GHz = Wi-Fi 6E, and 802.11be = Wi-Fi 7. Older amendments (802.11a/b/g) never received generation numbers.',
    lesson: '1.1-standards-rf',
  },
  {
    id: 'd1-003',
    topic: '1.1',
    type: 'single',
    difficulty: 2,
    stem: 'Which statement about channel widths and bands is correct according to the IEEE standards?',
    options: [
      '802.11ac defines 80 and 160 MHz channels in both 2.4 GHz and 5 GHz',
      '320 MHz channels are an 802.11be feature available only in the 6 GHz band',
      '802.11n is limited to 20 MHz channels in the 5 GHz band',
      '802.11ax removed support for 20 MHz channels to improve efficiency',
    ],
    answer: [1],
    explanation: '802.11be (Wi-Fi 7) added **320 MHz channels, which exist only in 6 GHz** — there is not enough contiguous spectrum in 5 GHz. 802.11ac is a 5 GHz-only standard (FortiOS offers a vendor `802.11ac-2G` mode, but that is not IEEE 802.11ac in 2.4 GHz). 802.11n supports 20 and 40 MHz in both bands. 802.11ax still uses 20 MHz channels; OFDMA even subdivides them into resource units.',
    lesson: '1.1-standards-rf',
  },
  {
    id: 'd1-004',
    topic: '1.1',
    type: 'single',
    difficulty: 2,
    stem: 'Refer to the exhibit. Three FortiAPs in an open-plan office (US regulatory domain) cover overlapping areas. Users complain of poor 2.4 GHz performance. What is the best change to the 2.4 GHz channel plan?',
    exhibit: String.raw`Site survey summary (2.4 GHz radios, 20 MHz channels)

AP name     Radio  Channel  Width   Neighbours heard at > -70 dBm
AP-Lobby    1      1        20MHz   AP-Floor2, AP-Cafe
AP-Floor2   1      3        20MHz   AP-Lobby, AP-Cafe
AP-Cafe     1      8        20MHz   AP-Lobby, AP-Floor2`,
    options: [
      'Move all three radios to channel 6 so they share the same channel cleanly',
      'Use channels 1, 6 and 11 so the three cells do not overlap in frequency',
      'Increase the channel width to 40 MHz so each AP gets more capacity',
      'Use channels 1, 2 and 3 so the APs stay close to the lowest channel',
    ],
    answer: [1],
    explanation: '2.4 GHz channels are 5 MHz apart but each 20 MHz transmission spans about four channel numbers, so 1/3/8 overlap (adjacent-channel interference, which is worse than co-channel sharing). In a channel 1–11 domain only **1, 6 and 11** do not overlap — FortiOS calls this the Three Channels plan. Putting all APs on channel 6 forces them to share airtime as one big collision domain. 40 MHz in 2.4 GHz eats most of the band and leaves no clean reuse. Channels 1, 2 and 3 overlap almost completely.',
    lesson: '1.1-standards-rf',
  },
  {
    id: 'd1-005',
    topic: '1.1',
    type: 'multi',
    difficulty: 2,
    stem: 'An AP is configured to use channel 100 in a country that applies DFS rules. Which two behaviours does DFS require of the AP? (Choose two.)',
    options: [
      'Listen for radar on the channel before it starts transmitting there',
      'Leave the channel when radar is detected and avoid it for a non-occupancy period',
      'Lower its transmit power by 3 dB every time a client associates',
      'Use only 20 MHz channel width while on a DFS channel',
      'Switch automatically to the 2.4 GHz band when radar is detected',
    ],
    answer: [0, 1],
    explanation: 'Channels 52–64 (UNII-2A) and 100–144 (UNII-2C) are DFS channels. The AP must perform a **channel availability check** (listen for radar, typically 60 s) before transmitting, keep monitoring, and **vacate** the channel quickly when radar appears, staying off it for the non-occupancy period (at least 30 minutes). DFS does not dictate a channel width, does not tie power to client associations (transmit power control is a separate rule), and does not move a radio to another band — the AP moves to another 5 GHz channel.',
    lesson: '1.1-standards-rf',
  },
  {
    id: 'd1-006',
    topic: '1.1',
    type: 'single',
    difficulty: 1,
    stem: 'An administrator wants to avoid radar-related channel changes near an airport. Which group of 5 GHz channels should be excluded from the FortiAP radios\' channel lists?',
    options: [
      '36, 40, 44 and 48',
      '52–64 and 100–144',
      '149, 153, 157, 161 and 165',
      '169, 173 and 177',
    ],
    answer: [1],
    explanation: '**UNII-2A (52–64) and UNII-2C (100–144)** are the DFS channels that must yield to radar. UNII-1 (36–48) and UNII-3 (149–165) do not require DFS in the US. 169/173/177 are UNII-4 channels, which are not DFS channels but are allowed only in some countries and, on FortiAP, only on G-series in Single 5G mode. With DARRP you can also set `include-dfs-channel disable` in the ARRP profile.',
    lesson: '1.1-standards-rf',
  },
  {
    id: 'd1-007',
    topic: '1.1',
    type: 'single',
    difficulty: 2,
    stem: 'Refer to the exhibit. The administrator wants to broadcast the Corp SSID from the 6 GHz radios of new FortiAP 431G units. Which change makes the SSID meet the 6 GHz security requirements?',
    exhibit: String.raw`FGT-HQ # show wireless-controller vap corp-wlan
config wireless-controller vap
    edit "corp-wlan"
        set ssid "Corp"
        set security wpa2-only-personal
        set passphrase ENC xxxxxxxxxxxxxxxx
        set schedule "always"
    next
end`,
    options: [
      'Keep WPA2-Personal and set pmf optional',
      'Change to wpa3-sae with pmf enable and sae-h2e-only enable',
      'Change to wpa3-sae-transition with pmf optional',
      'Change to open security and enable captive-portal',
    ],
    answer: [1],
    explanation: 'The Wi-Fi Alliance allows only **WPA3 or OWE, with PMF required**, in 6 GHz, and SAE there must use **hash-to-element (H2E)**. `wpa3-sae` with `pmf enable` and `sae-h2e-only enable` meets that. WPA2-Personal is not allowed in 6 GHz no matter what PMF is set to. SAE transition keeps a WPA2 path with PMF optional, so it does not meet the 6 GHz rule. Open security (captive portal or not) is not allowed in 6 GHz either; OWE would be the open-style option.',
    lesson: '1.1-standards-rf',
  },
  {
    id: 'd1-008',
    topic: '1.1',
    type: 'fill',
    difficulty: 1,
    stem: 'A FortiAP reports a client signal of -67 dBm on a channel with a noise floor of -92 dBm. What is the signal-to-noise ratio in dB? (Enter a number.)',
    answer: ['25', '25 dB', '25db', '25 db'],
    explanation: 'SNR = signal − noise = −67 − (−92) = **25 dB**. Because both values are in dBm, subtracting them gives a ratio in dB. 25 dB is workable for data; voice and high MCS rates want more.',
    lesson: '1.1-standards-rf',
  },
  {
    id: 'd1-009',
    topic: '1.1',
    type: 'single',
    difficulty: 2,
    stem: 'Refer to the exhibit. What is the EIRP of this outdoor radio installation?',
    exhibit: String.raw`Outdoor FortiAP installation, radio 2 (5 GHz)

Radio conducted transmit power : 17 dBm
External antenna gain          : 6 dBi
Cable and connector loss       : 1 dB`,
    options: [
      '17 dBm',
      '22 dBm',
      '24 dBm',
      '102 dBm',
    ],
    answer: [1],
    explanation: 'EIRP = transmit power + antenna gain − cable loss = 17 + 6 − 1 = **22 dBm**. 17 dBm ignores the antenna and cable; 24 dBm forgets the cable loss; 102 multiplies instead of adding (decibel values add). Regulators limit EIRP, which is why FortiOS radio power settings (`power-mode`, `power-level`, `power-value`) are expressed as EIRP.',
    lesson: '1.1-standards-rf',
  },
  {
    id: 'd1-010',
    topic: '1.1',
    type: 'order',
    difficulty: 2,
    stem: 'A laptop joins a WPA2-Enterprise SSID that it found by active scanning. Put the steps in the order they occur.',
    items: [
      'Probe request and probe response',
      '802.11 Open System authentication',
      'Association request and association response',
      '802.1X/EAP authentication with the RADIUS server',
      '4-way handshake (EAPOL-Key messages 1 to 4)',
      'DHCP to obtain an IP address',
    ],
    explanation: 'The client discovers the SSID (probe exchange, or beacons for passive scanning), performs 802.11 Open System authentication (a formality for WPA2), associates, then runs **802.1X/EAP** through the AP/controller to the RADIUS server. EAP produces the PMK, which the **4-way handshake** uses to derive the PTK and deliver the GTK. Only after the keys are installed can the client send data such as **DHCP**.',
    lesson: '1.1-wlan-frames-security',
  },
  {
    id: 'd1-011',
    topic: '1.1',
    type: 'single',
    difficulty: 2,
    stem: 'During the WPA2 4-way handshake, which message delivers the group temporal key (GTK) to the client?',
    options: [
      'Message 1, sent by the AP together with the ANonce',
      'Message 2, sent by the client together with the SNonce',
      'Message 3, sent by the AP with a MIC and the encrypted GTK',
      'Message 4, sent by the client to confirm key installation',
    ],
    answer: [2],
    explanation: '**Message 3** (AP to client) carries the GTK, encrypted with the new key material, plus a MIC, and tells the client to install the keys. Message 1 carries only the AP\'s ANonce. Message 2 carries the client\'s SNonce and a MIC that proves it holds the PMK. Message 4 is the client\'s acknowledgement.',
    lesson: '1.1-wlan-frames-security',
  },
  {
    id: 'd1-012',
    topic: '1.1',
    type: 'multi',
    difficulty: 2,
    stem: 'Which two advantages does WPA3-Personal (SAE) have over WPA2-Personal (PSK)? (Choose two.)',
    options: [
      'An attacker who captures the handshake cannot run an offline dictionary attack against the password',
      'Each session has forward secrecy, so a later password leak does not decrypt previously captured traffic',
      'Each user gets an individual RADIUS account, removing the shared password',
      'It works with clients that do not support Protected Management Frames',
      'It allows TKIP for legacy clients while using AES for new ones',
    ],
    answer: [0, 1],
    explanation: 'SAE (Dragonfly) makes the password exchange resistant to **offline dictionary attacks** and provides **forward secrecy**. It still uses a shared password — per-user credentials need Enterprise mode with RADIUS (or MPSK keys). WPA3 requires PMF, so non-PMF clients need SAE transition mode instead. WPA3 does not use TKIP.',
    lesson: '1.1-wlan-frames-security',
  },
  {
    id: 'd1-013',
    topic: '1.1',
    type: 'match',
    difficulty: 2,
    stem: 'Match each EAP method to the credentials it uses.',
    pairs: [
      ['EAP-TLS', 'Certificates on both the client and the server'],
      ['PEAP (MSCHAPv2)', 'Server certificate, then a user password inside a TLS tunnel'],
      ['EAP-TTLS', 'Server certificate, then a choice of inner methods such as PAP'],
    ],
    explanation: '**EAP-TLS** is mutual certificate authentication and needs client certificates from a PKI. **PEAP** builds a TLS tunnel with the server certificate and runs MSCHAPv2 (username/password) inside it — the usual Active Directory choice. **EAP-TTLS** also tunnels with a server certificate but allows several inner methods, including PAP. In all three, the client should validate the server certificate.',
    lesson: '1.1-wlan-frames-security',
  },
  {
    id: 'd1-014',
    topic: '1.1',
    type: 'single',
    difficulty: 2,
    stem: 'Refer to the exhibit. The tunnel-mode SSID Corp authenticates users against Windows NPS at 10.0.1.20. Authentications fail and NPS logs requests from an unknown client. Which device must be added as a RADIUS client on NPS?',
    exhibit: String.raw`FGT-HQ # show user radius RADIUS-NPS
config user radius
    edit "RADIUS-NPS"
        set server "10.0.1.20"
        set secret ENC xxxxxxxxxxxxxxxx
    next
end

FGT-HQ # show wireless-controller vap corp-wlan
config wireless-controller vap
    edit "corp-wlan"
        set ssid "Corp"
        set security wpa2-only-enterprise
        set auth radius
        set radius-server "RADIUS-NPS"
        set schedule "always"
    next
end`,
    options: [
      'Each wireless laptop, because it is the supplicant',
      'Each FortiAP, because the AP radio receives the EAPOL frames',
      'The FortiGate, because it acts as the authenticator and sends the RADIUS requests',
      'No RADIUS client is needed when the shared secret matches',
    ],
    answer: [2],
    explanation: 'In 802.1X the **supplicant** is the laptop, the **authentication server** is NPS, and the **authenticator** relays EAP. With a FortiGate wireless controller and `auth radius`, the **FortiGate** sends the RADIUS Access-Requests, so NPS must list the FortiGate (its source IP) as a RADIUS client with the matching secret. The AP relays EAPOL to the controller over CAPWAP but does not talk RADIUS here. Laptops never talk RADIUS. A shared secret is configured per RADIUS client, so an unknown client is rejected regardless.',
    lesson: '1.1-wlan-frames-security',
  },
  {
    id: 'd1-015',
    topic: '1.1',
    type: 'single',
    difficulty: 2,
    stem: 'Refer to the exhibit. A FortiWiFi shipped to a branch in France still uses its factory country setting and already has FortiAP profiles. According to Fortinet\'s guide, what must the administrator do before setting the country to FR?',
    exhibit: String.raw`FWF-Branch # config wireless-controller setting
FWF-Branch (setting) # get | grep country
country             : US`,
    options: [
      'Reboot the FortiWiFi so the wireless controller reloads its regulatory table',
      'Remove all FortiAP profiles, then set the country under wireless-controller setting',
      'Set ap-country FR in each FortiAP profile; the controller country cannot be changed',
      'Factory-reset every FortiAP so it forgets the US channel list',
    ],
    answer: [1],
    explanation: 'The controller defaults to the **United States**. Fortinet\'s guide says to **remove all FortiAP profiles before changing** `config wireless-controller setting` → `set country`, then recreate them, because the country changes which channels and powers profiles can use. A reboot is not the requirement. `ap-country` exists per profile (default NA = use the VDOM country), but the controller country can be changed. FortiAPs take their regulatory settings from the controller, so factory-resetting them achieves nothing.',
    lesson: '1.1-standards-rf',
  },
  {
    id: 'd1-016',
    topic: '1.1',
    type: 'multi',
    difficulty: 2,
    stem: 'Which two statements about Protected Management Frames (802.11w) are true? (Choose two.)',
    options: [
      'PMF prevents an attacker from forging deauthentication and disassociation frames to disconnect clients',
      'PMF is mandatory for WPA3-SAE and for any SSID in 6 GHz',
      'PMF encrypts beacons so that SSIDs are hidden from scanners',
      'PMF is enabled by default on new FortiOS SSIDs',
      'PMF replaces the 4-way handshake with a faster exchange',
    ],
    answer: [0, 1],
    explanation: 'PMF protects **deauthentication, disassociation and robust action frames**, which stops forged-deauth attacks, and it is **required for WPA3 and in 6 GHz**. Beacons are not encrypted (beacon protection is a separate WPA3 feature that adds integrity, not confidentiality). The FortiOS `pmf` default is `disable`. PMF works alongside the 4-way handshake; it does not replace it.',
    lesson: '1.1-wlan-frames-security',
  },
  {
    id: 'd1-017',
    topic: '1.1',
    type: 'fill',
    difficulty: 2,
    stem: 'Refer to the exhibit. How many BSSIDs is the FortiAP at 10.10.10.22 currently using? (Enter a number.)',
    exhibit: String.raw`FGT-HQ # diagnose wireless-controller wlac -c vap
bssid             ssid   intf       vfid:ip-port              rId wId
04:d5:90:3a:11:28 Corp   corp-wlan  ws (0-10.10.10.21:5246)   0   0
04:d5:90:3a:11:30 Corp   corp-wlan  ws (0-10.10.10.21:5246)   1   0
04:d5:90:3a:22:48 Corp   corp-wlan  ws (0-10.10.10.22:5246)   0   0
04:d5:90:3a:22:50 Corp   corp-wlan  ws (0-10.10.10.22:5246)   1   0
06:d5:90:3a:22:50 Guest  guest-wlan ws (0-10.10.10.22:5246)   1   1
06:d5:90:3a:22:48 IoT    iot-wlan   ws (0-10.10.10.22:5246)   0   1`,
    answer: ['4', 'four'],
    explanation: 'Each line is one BSSID (one SSID on one radio). The AP at 10.10.10.22 has **four**: Corp on radios 0 and 1, Guest on radio 1 and IoT on radio 0. One SSID on two radios uses two BSSIDs, which is why the BSSID — not the SSID — identifies a specific radio cell.',
    lesson: '1.1-wlan-frames-security',
  },
  {
    id: 'd1-018',
    topic: '1.1',
    type: 'single',
    difficulty: 1,
    stem: 'Refer to the exhibit. The administrator says the change "keeps attackers from finding the IoT network". Which statement is correct?',
    exhibit: String.raw`config wireless-controller vap
    edit "iot-wlan"
        set ssid "IoT"
        set broadcast-ssid disable
        set security wpa2-only-personal
        set passphrase ENC xxxxxxxxxxxxxxxx
    next
end`,
    options: [
      'The SSID name is left out of beacons, but clients must probe for it by name, so it is easily discovered; it is not a security control',
      'The AP stops transmitting beacons entirely, so the network is invisible to scanners',
      'Clients can no longer connect unless they are pre-authorized by MAC address',
      'Hiding the SSID upgrades the network to WPA3 because the name is no longer public',
    ],
    answer: [0],
    explanation: 'With `broadcast-ssid disable` the AP still sends beacons, just with the SSID field empty. Clients configured for the network send **probe requests containing the name**, and the AP\'s probe responses and the clients\' association requests reveal it too, so any scanner learns it quickly. It does not add MAC filtering (that is `address-group`/`address-group-policy`) and does not change the security mode.',
    lesson: '1.1-wlan-frames-security',
  },

  // ---------------------------------------------------------------- 1.2
  {
    id: 'd1-019',
    topic: '1.2',
    type: 'single',
    difficulty: 1,
    stem: 'Which administrative access setting must be enabled on the FortiGate interface that FortiAP units connect to so that they can establish CAPWAP sessions?',
    options: [
      'CAPWAP, set with allowaccess capwap',
      'Security Fabric Connection, set with allowaccess fabric',
      'FMG-Access, set with allowaccess fgfm',
      'HTTPS, because FortiAPs download their configuration over HTTPS',
    ],
    answer: [1],
    explanation: 'In FortiOS 7.6 the **Security Fabric Connection** access (`allowaccess fabric`) is what allows CAPWAP from FortiAPs (and FortiSwitch/Security Fabric connections). There is no `capwap` allowaccess keyword. `fgfm` (FMG-Access) is for FortiManager management of the FortiGate. FortiAPs receive configuration over the CAPWAP control channel (UDP 5246, DTLS), not HTTPS.',
    lesson: '1.2-discovery-capwap',
  },
  {
    id: 'd1-020',
    topic: '1.2',
    type: 'order',
    difficulty: 2,
    stem: 'A FortiAP is left at the default discovery type (auto). Put the controller discovery methods in the order the FortiAP tries them.',
    items: [
      'Static controller IP address (AC_IPADDR_1 to 3)',
      'DHCP option 138',
      'DNS lookup of fortinet-capwap-controller',
      'FortiManagement Cloud (apctrl1.forticloud.com)',
      'Multicast to 224.0.1.140',
      'Broadcast',
    ],
    explanation: 'Auto discovery runs **static → DHCP → DNS → FortiManagement Cloud → multicast → broadcast**. For each method the AP sends up to three discovery requests, `discovery-interval` (default 5 s) apart. When broadcast also fails, the AP enters the SULKING state and later starts again. Fortinet\'s pages disagree on whether multicast or broadcast is numbered 5 or 6, so learn the order by name.',
    lesson: '1.2-discovery-capwap',
  },
  {
    id: 'd1-021',
    topic: '1.2',
    type: 'fill',
    difficulty: 2,
    stem: 'FortiAPs at a remote site must learn the controller address 10.10.10.1 from DHCP option 138, and the DHCP server only accepts the option in hexadecimal. What value do you enter? (Eight hex digits.)',
    answer: ['0A0A0A01', '0x0A0A0A01', '0a0a0a01', '0x0a0a0a01'],
    explanation: 'Convert each octet: 10 = 0x0A, 10 = 0x0A, 10 = 0x0A, 1 = 0x01, giving **0A0A0A01**. Fortinet\'s example is 192.168.0.1 = C0A80001. You can concatenate several addresses; the first has the highest priority. If option 138 is already used, set another code on the AP with `AC_DISCOVERY_DHCP_OPTION_CODE`.',
    lesson: '1.2-discovery-capwap',
  },
  {
    id: 'd1-022',
    topic: '1.2',
    type: 'single',
    difficulty: 3,
    stem: 'Refer to the exhibit (an excerpt of the wtp_filter and cw_acd debug). A branch FortiAP joins FGT-HQ across a third-party firewall. Both the FortiAP profile and the AP use clear-text data channel security. After the last line shown, no further messages appear for this AP until it starts discovery again. What is the most likely cause?',
    exhibit: String.raw`11204.310 <msg> DISCOVERY_REQ (3) <== ws (0-10.50.1.20:5246)
11204.310 <msg> DISCOVERY_RESP (3) ==> ws (0-10.50.1.20:5246)
11206.315 <fsm> old CWAS_IDLE(1) ev CWAE_LISTENER_THREAD_READY(1) new CWAS_DTLS_SETUP(4)
11206.402 <aev> - CWAE_DTLS_ESTABLISHED ws (0-10.50.1.20:5246)
11206.402 <fsm> old CWAS_DTLS_CONN(5) ev CWAE_DTLS_ESTABLISHED(8) new CWAS_JOIN(7)
11206.405 <msg> JOIN_REQ (4) <== ws (0-10.50.1.20:5246)
11206.409 <msg> CFG_STATUS (5) <== ws (0-10.50.1.20:5246)
11206.409 <fsm> old CWAS_JOIN(7) ev CWAE_CFG_STATUS_REQ(13) new CWAS_CONFIG(8)
11206.960 <msg> CHG_STATE_EVENT_REQ (6) <== ws (0-10.50.1.20:5246)
11206.960 <fsm> old CWAS_CONFIG(8) ev CWAE_CHG_STATE_EVENT_REQ_RECV(23) new CWAS_DATA_CHAN_SETUP(10)`,
    options: [
      'The FortiGate interface is missing allowaccess fabric',
      'The DHCP scope at the branch does not include option 138',
      'The firewall in the path blocks the CAPWAP data channel (UDP 5247)',
      'The AP failed DTLS authentication on the control channel',
    ],
    answer: [2],
    explanation: 'The AP got through discovery, DTLS (`CWAE_DTLS_ESTABLISHED`), join and configuration, and the controller moved to **CWAS_DATA_CHAN_SETUP**. A healthy join continues with `CWAE_DATA_CHAN_CONNECTED`, data channel keep-alives, CWAS_DATA_CHECK and **CWAS_RUN**. With matching clear-text settings, the data channel failing points to **UDP 5247 being blocked** in the path. Missing `fabric` access would stop the AP at discovery. Option 138 only matters for finding the controller, which already worked. DTLS on the control channel succeeded.',
    lesson: '1.2-discovery-capwap',
  },
  {
    id: 'd1-023',
    topic: '1.2',
    type: 'single',
    difficulty: 2,
    stem: 'Refer to the exhibit. No FortiAP-231F has connected yet. What happens when the first FortiAP-231F (serial FP231FTF20000007) discovers this FortiGate?',
    exhibit: String.raw`config wireless-controller wtp
    edit "FP231F****000001"
        set admin enable
        set wtp-profile "FAP231F-office"
    next
end`,
    options: [
      'The AP is listed as discovered and waits for manual authorization because its serial number does not match exactly',
      'The entry is renamed to FP231FTF20000007 and the AP is authorized with the FAP231F-office profile',
      'The AP is authorized only if its serial number ends in 000001',
      'The entry is copied, so both FP231F****000001 and FP231FTF20000007 exist and the template stays available',
    ],
    answer: [1],
    explanation: 'This is a **wildcard serial number**: a six-character model prefix (`FP231F`), four asterisks and six characters that do not have to match the real serial. The first FortiAP-231F to register takes over the entry: FortiOS **renames** it to the real serial (the UUID stays the same) and the AP is authorized with the entry\'s profile. The template is consumed, not copied; create `FP231F****000002` for the next unit.',
    lesson: '1.2-discovery-capwap',
  },
  {
    id: 'd1-024',
    topic: '1.2',
    type: 'single',
    difficulty: 2,
    stem: 'Refer to the exhibit. A FortiAP connected to port5 receives 10.10.10.21 from the FortiGate DHCP server, but it never appears in Managed FortiAPs. ap-discover is at its default. What should the administrator change?',
    exhibit: String.raw`FGT-HQ # show system interface port5
config system interface
    edit "port5"
        set vdom "root"
        set ip 10.10.10.1 255.255.255.0
        set allowaccess ping https ssh
        set type physical
        set role lan
        set snmp-index 5
    next
end`,
    options: [
      'Add fabric to allowaccess on port5',
      'Enable auto-auth-extension-device on port5',
      'Add a DHCP option 138 with the value of 10.10.10.1',
      'Change the role of port5 to dmz',
    ],
    answer: [0],
    explanation: 'The AP has an address in the same subnet, so broadcast discovery alone would reach the FortiGate — but the FortiGate only answers CAPWAP on interfaces with **Security Fabric Connection (`fabric`)** access. Add `fabric` to `allowaccess`. `auto-auth-extension-device` only authorizes APs that are already being discovered; it does not make them visible. Option 138 is unnecessary on the same subnet. The interface role does not control CAPWAP.',
    lesson: '1.2-discovery-capwap',
  },
  {
    id: 'd1-025',
    topic: '1.2',
    type: 'multi',
    difficulty: 2,
    stem: 'A new FortiAP-431G is plugged into a correctly configured FortiGate interface. No pre-authorization or auto-authorization settings have been changed. Which two statements are true? (Choose two.)',
    options: [
      'The FortiGate creates a Managed FortiAPs entry for the AP that waits for an administrator to authorize it',
      'When the AP is authorized without choosing a profile, it uses the built-in default profile for the 431G model',
      'The AP is authorized automatically because auto-auth-extension-device is enabled by default',
      'The AP broadcasts all tunnel-mode SSIDs before it is authorized',
      'The AP is rejected because its serial number was not pre-authorized',
    ],
    answer: [0, 1],
    explanation: '`ap-discover` defaults to **enable**, so a new AP gets an entry awaiting authorization (within about two minutes). On authorization it uses its **model\'s default FortiAP profile** unless you assign another. `auto-auth-extension-device` defaults to **disable**. An unauthorized AP receives no SSIDs. Pre-authorization is optional; it is required only if `ap-discover` has been disabled.',
    lesson: '1.2-discovery-capwap',
  },
  {
    id: 'd1-026',
    topic: '1.2',
    type: 'single',
    difficulty: 2,
    stem: 'Refer to the exhibit. What is the effect of this configuration on AP-Lobby?',
    exhibit: String.raw`config wireless-controller wtp
    edit "FP231FTF20000001"
        set admin discovered
        set name "AP-Lobby"
        set wtp-profile "FAP231F-office"
    next
end`,
    options: [
      'The AP is managed normally; discovered only records how it was found',
      'The AP is known to the controller but not authorized, so it is not managed and broadcasts no SSIDs from this FortiGate',
      'The AP is permanently blocked and cannot be authorized again without a factory reset',
      'The AP runs in standalone mode with the FAP231F-office settings cached locally',
    ],
    answer: [1],
    explanation: '`admin` takes `discovered`, `enable` or `disable`. **`discovered`** is the deauthorized state: the controller knows the AP but does not manage it, so it serves no SSIDs. Setting `admin enable` authorizes it again — no factory reset is needed. `disable` is the value that tells the controller not to provide service to the AP. Profile assignment alone does nothing until the AP is authorized.',
    lesson: '1.2-discovery-capwap',
  },
  {
    id: 'd1-027',
    topic: '1.2',
    type: 'multi',
    difficulty: 1,
    stem: 'Which two statements about the CAPWAP tunnel between a FortiAP and a FortiGate are true? (Choose two.)',
    options: [
      'The control channel uses UDP 5246 and is always protected with DTLS',
      'The data channel uses clear text by default (dtls-policy clear-text)',
      'The control channel can be switched to clear text to improve throughput',
      'The data channel always uses IPsec when the AP connects across the internet',
      'Both channels share a single TCP 5246 connection',
    ],
    answer: [0, 1],
    explanation: 'The CAPWAP **control channel (UDP 5246) is always DTLS-encrypted**. The **data channel** (UDP 5247 per RFC 5415) follows `dtls-policy` in the FortiAP profile, whose default is **`clear-text`**; you can choose `dtls-enabled`, `ipsec-vpn` or `ipsec-sn-vpn`, and Fortinet recommends encryption when the path crosses a public network — it is not automatic. CAPWAP uses UDP, not TCP.',
    lesson: '1.2-discovery-capwap',
  },
  {
    id: 'd1-028',
    topic: '1.2',
    type: 'single',
    difficulty: 2,
    stem: 'A company\'s WiFi controller is a FortiGate in the data center. Branch FortiAPs reach it through site-to-site VPN tunnels and branch DHCP is provided by a third-party router that the WiFi team cannot change. Which discovery method does Fortinet recommend for this connection-over-WAN design?',
    options: [
      'Broadcast discovery',
      'Multicast discovery to 224.0.1.140',
      'A static controller IP address configured on each FortiAP',
      'FortiManagement Cloud discovery through apctrl1.forticloud.com',
    ],
    answer: [2],
    explanation: 'For connection over WAN, Fortinet\'s guide recommends configuring each FortiAP with the **static controller IP** (`AC_IPADDR_1`, with `_2` and `_3` available for redundant controllers). DHCP option 138 would also work, but the DHCP server cannot be changed here. Broadcast never crosses the routed VPN. Multicast needs multicast routing over the tunnels. FortiManagement Cloud discovery finds a cloud controller, not an on-premises FortiGate.',
    lesson: '1.2-discovery-capwap',
  },
  {
    id: 'd1-029',
    topic: '1.2',
    type: 'single',
    difficulty: 2,
    stem: 'A FortiAP receives the domain example.com in DHCP option 15 and no option 138. Its AC_HOSTNAME variables are at their defaults. Which name must resolve to the controller for DNS discovery to work?',
    options: [
      'capwap.example.com',
      'fortinet-capwap-controller.example.com',
      'apctrl1.forticloud.com',
      'fortiap-controller.example.com',
    ],
    answer: [1],
    explanation: 'By default the AP combines the host name **`fortinet-capwap-controller`** with the domain from DHCP option 15. `AC_HOSTNAME_1..3` let you change the host part. `apctrl1.forticloud.com` is the FortiManagement Cloud dispatcher used by the cloud discovery method, not on-premises DNS discovery. The other names are made up.',
    lesson: '1.2-discovery-capwap',
  },
  {
    id: 'd1-030',
    topic: '1.2',
    type: 'fill',
    difficulty: 1,
    stem: 'What is the default multicast address that FortiAPs and the FortiGate use for multicast controller discovery?',
    answer: ['224.0.1.140'],
    explanation: 'The default is **224.0.1.140**. Change it with `config wireless-controller global` → `set discovery-mc-addr` on the FortiGate and `AC_DISCOVERY_MC_ADDR` on the FortiAP; both must match. Multicast discovery works across subnets only if multicast routing is configured.',
    lesson: '1.2-discovery-capwap',
  },
  {
    id: 'd1-031',
    topic: '1.2',
    type: 'single',
    difficulty: 2,
    stem: 'A FortiAP in auto discovery mode cycles through every method without finding a controller. What happens next?',
    options: [
      'It factory-resets itself and reboots',
      'It enters the SULKING state, waits, and then starts the discovery cycle again',
      'It switches permanently to FortiManagement Cloud discovery',
      'It starts broadcasting an open configuration SSID for local setup',
    ],
    answer: [1],
    explanation: 'After the last method (broadcast) fails, the AP enters **SULKING**, waits, then returns to discovery and repeats the cycle. It does not factory-reset or lock itself to one method. The open `FAP-config-<serial>` SSID belongs to Configuration mode, which you trigger by holding the reset button 5–10 seconds on supported models, not by failed discovery.',
    lesson: '1.2-discovery-capwap',
  },
  {
    id: 'd1-032',
    topic: '1.2',
    type: 'single',
    difficulty: 2,
    stem: 'An older FortiAP has no FortiCloud key sticker. The administrator wants to manage it from FortiEdge Cloud. After upgrading the AP to supported firmware, what does Fortinet\'s procedure say to do on the AP?',
    options: [
      'Set the AP static controller address to the IP of apctrl1.forticloud.com',
      'Set AC Discovery Type to FortiAP Cloud and enter the FortiEdge Cloud account name and password',
      'Configure DHCP option 138 with the FortiEdge Cloud portal address',
      'Hold the reset button for 10 seconds so the AP joins the cloud in configuration mode',
    ],
    answer: [1],
    explanation: 'For APs without a key, the FortiEdge Cloud guide says to log in to the AP\'s GUI (default `https://192.168.1.2`, `admin`, empty password), set **AC Discovery Type** to **FortiAP Cloud**, enter the FortiEdge Cloud account credentials and connect the AP to the internet; it then appears in *Inventory Devices*. Cloud discovery uses the dispatcher name over HTTPS, not a static IP or option 138. A reset longer than 10 seconds factory-resets the AP.',
    lesson: '1.2-cloud-firmware',
  },
  {
    id: 'd1-033',
    topic: '1.2',
    type: 'single',
    difficulty: 3,
    stem: 'Refer to the exhibit. A FortiAP behind a branch FortiGate is registered and deployed to a FortiEdge Cloud network, but the cloud never shows it online. The branch FortiGate uses this policy for the AP subnet. What must be added?',
    exhibit: String.raw`config firewall policy
    edit 7
        set name "FAP-to-cloud"
        set srcintf "ap-vlan"
        set dstintf "wan1"
        set srcaddr "FAP-subnet"
        set dstaddr "all"
        set action accept
        set schedule "always"
        set service "DNS" "HTTPS"
        set nat enable
    next
end`,
    options: [
      'TCP 541 to the FortiEdge Cloud portal, because cloud management uses the FortiManager protocol',
      'UDP 5246 and 5247 (and TCP 514 and 8443) to the FortiEdge Cloud AP portal',
      'SNMP from the cloud to the AP, because the cloud polls APs for status',
      'Inbound TCP 443 from the cloud to the AP, with a VIP',
    ],
    answer: [1],
    explanation: 'DNS and HTTPS let the AP resolve and contact the **dispatcher** (`apctrl1.forticloud.com`, TCP 443), which tells it which regional AP portal to use. The AP then joins that portal with **CAPWAP over UDP 5246/5247**, and FortiEdge Cloud\'s firewall table also lists **TCP 514 and 8443** to the portal. All of it is outbound from the AP, so no VIP is needed. TCP 541 is FortiManager-to-FortiGate, and SNMP polling is not how cloud APs report.',
    lesson: '1.2-cloud-firmware',
  },
  {
    id: 'd1-034',
    topic: '1.2',
    type: 'order',
    difficulty: 2,
    stem: 'Put the FortiEdge Cloud onboarding tasks for a newly purchased FortiAP in Fortinet\'s recommended order.',
    items: [
      'Sign in to FortiEdge Cloud with a FortiCloud account',
      'Add the FortiAP to the account inventory (with its key, or by cloud discovery)',
      'Create a network to organize devices by premises',
      'Deploy the FortiAP from the inventory to that network',
    ],
    explanation: 'Fortinet\'s getting-started workflow: register on FortiCloud and **sign in**; **add the AP to the inventory**; **create a network** (a logical grouping of devices with common configuration); then **deploy** the AP from *Inventory Devices* (*Actions > Deploy > Deploy to FortiEdge Cloud*) into that network. SSIDs and per-AP settings are then configured for the network.',
    lesson: '1.2-cloud-firmware',
  },
  {
    id: 'd1-035',
    topic: '1.2',
    type: 'single',
    difficulty: 2,
    stem: 'Refer to the exhibit. An hour later, all managed FortiAPs still run their old firmware. What must the administrator do to start the upgrade on every AP?',
    exhibit: String.raw`FGT-HQ # execute wireless-controller upload-wtp-image tftp FP231F-v7.6-build0123.out 10.0.1.50
FGT-HQ # execute wireless-controller list-wtp-image`,
    options: [
      'Run execute wireless-controller reset-wtp all so the APs reboot, rejoin and download the image',
      'Enable firmware-provision-on-authorization under wireless-controller setting',
      'Run execute wireless-controller delete-wtp-image all and upload the image again over FTP',
      'Nothing; the APs check the FortiGate for new images every 24 hours',
    ],
    answer: [0],
    explanation: 'Fortinet\'s CLI procedure is upload (`upload-wtp-image`), verify (`list-wtp-image`), then **`execute wireless-controller reset-wtp all`** (or a serial or FortiAP group). The APs restart and download the image when they rejoin, because `image-download` is enabled by default. `firmware-provision-on-authorization` affects only newly authorized APs and uses FortiGuard images. Deleting and re-uploading changes nothing. There is no 24-hour automatic check of uploaded images.',
    lesson: '1.2-cloud-firmware',
  },
  {
    id: 'd1-036',
    topic: '1.2',
    type: 'multi',
    difficulty: 2,
    stem: 'Refer to the exhibit. Which two statements about this upgrade are true? (Choose two.)',
    exhibit: String.raw`FGT-HQ # config wireless-controller global
FGT-HQ (global) # set rolling-wtp-upgrade enable
FGT-HQ (global) # end
FGT-HQ # execute wireless-controller rolling-wtp-upgrade floor2`,
    options: [
      'Only the APs in the FortiAP group floor2 are upgraded, in batches so neighbouring APs keep serving clients',
      'APs waiting for their turn show ISSU queued, and progress can be checked with diagnose wireless-controller wlac -c ap-upd',
      'All APs in floor2 reboot at the same moment to keep the upgrade window short',
      'Rolling upgrade is enabled by default, so the first command was unnecessary',
      'The neighbour threshold that decides which APs cover each other defaults to -65 dBm',
    ],
    answer: [0, 1],
    explanation: 'A **rolling (hitless) upgrade** staggers APs so neighbours keep clients connected. `rolling-wtp-upgrade` takes `all`, a serial or a **FortiAP group**, so only floor2 is upgraded. Queued APs show **ISSU queued**, and `diagnose wireless-controller wlac -c ap-upd` monitors the process. Rebooting all at once is the opposite of a rolling upgrade. The feature is **disabled by default**, and `rolling-wtp-upgrade-threshold` defaults to **-80 dBm**.',
    lesson: '1.2-cloud-firmware',
  },

  // ---------------------------------------------------------------- 1.3
  {
    id: 'd1-037',
    topic: '1.3',
    type: 'single',
    difficulty: 1,
    stem: 'A site uses FortiAP-231F and FortiAP-431G units that must broadcast the same SSIDs with the same radio policy. How many FortiAP profiles are needed at minimum?',
    options: [
      'One, because a FortiAP profile can include any number of models',
      'Two, because each FortiAP profile is tied to one platform type',
      'One per AP, because radio settings cannot be shared',
      'None; SSIDs are assigned directly to APs, not through profiles',
    ],
    answer: [1],
    explanation: 'A FortiAP profile has a **platform type** (`config platform` → `set type`), so you need **one profile per model** — here one for the 231F and one for the 431G. Many APs of the same model share one profile, so per-AP profiles are unnecessary (use overrides for exceptions). SSIDs reach radios through the profile\'s `vap-all`/`vaps` settings (or a per-AP `override-vaps`).',
    lesson: '1.3-fortiap-profiles',
  },
  {
    id: 'd1-038',
    topic: '1.3',
    type: 'single',
    difficulty: 2,
    stem: 'Refer to the exhibit. The administrator created the tunnel-mode SSID iot-wlan for 2.4 GHz devices only, but users now also see the IoT SSID on 5 GHz. Why?',
    exhibit: String.raw`FGT-HQ # show full-configuration wireless-controller wtp-profile FAP231F-office
config wireless-controller wtp-profile
    edit "FAP231F-office"
        config radio-1
            set mode ap
            set band 802.11ax-2G
            set vap-all manual
            set vaps "corp-wlan" "iot-wlan"
        end
        config radio-2
            set mode ap
            set band 802.11ax-5G
            set vap-all tunnel
        end
    next
end`,
    options: [
      'iot-wlan was added to radio-1 manually, and manual assignments are copied to every radio',
      'Radio 2 uses vap-all tunnel, which automatically broadcasts every tunnel-mode SSID, including iot-wlan',
      'The 802.11ax-5G band forces all SSIDs onto the 5 GHz radio',
      'SSIDs created in tunnel mode are always broadcast on all radios regardless of the profile',
    ],
    answer: [1],
    explanation: '`vap-all tunnel` (the default) **automatically assigns all tunnel-mode SSIDs** to that radio, including new ones. Set radio 2 to `vap-all manual` with `vaps "corp-wlan"`. Manual lists apply only to their own radio, the band does not choose SSIDs, and tunnel mode does not override a radio set to `manual` (radio 1 shows the profile decides).',
    lesson: '1.3-fortiap-profiles',
  },
  {
    id: 'd1-039',
    topic: '1.3',
    type: 'single',
    difficulty: 2,
    stem: 'Refer to the exhibit. DARRP is disabled on both. Which channel and transmit power does radio 2 of AP-Lobby use?',
    exhibit: String.raw`config wireless-controller wtp-profile
    edit "FAP231F-office"
        config radio-2
            set band 802.11ax-5G
            set channel "36" "40" "44" "48"
            set power-mode percentage
            set power-level 100
        end
    next
end
config wireless-controller wtp
    edit "FP231FTF20000001"
        set name "AP-Lobby"
        set wtp-profile "FAP231F-office"
        config radio-2
            set override-channel enable
            set channel "149"
        end
    next
end`,
    options: [
      'Channel 149 at 100% of the maximum allowed power',
      'One of channels 36–48 at 100% power, because the profile wins over the AP entry',
      'Channel 149 at the default 27 dBm, because overriding the channel also resets power',
      'Channel 149 or 36–48, chosen randomly at each reboot',
    ],
    answer: [0],
    explanation: 'Per-AP radio overrides replace only the overridden setting. `override-channel enable` with `channel "149"` makes AP-Lobby use **149**, while power still comes from the profile (`percentage`, `power-level 100`) because `override-txpower` is not enabled. Overrides win over the profile for that AP, and they are independent: the channel override does not reset power. 27 dBm is the default `power-value`, which applies only in `dBm` mode.',
    lesson: '1.3-fortiap-profiles',
  },
  {
    id: 'd1-040',
    topic: '1.3',
    type: 'match',
    difficulty: 1,
    stem: 'Match each FortiAP radio mode to what the radio does.',
    pairs: [
      ['ap', 'Serves WiFi clients on the assigned SSIDs'],
      ['monitor', 'Dedicated scanning for rogue APs and wireless threats'],
      ['sniffer', 'Captures 802.11 frames over the air for analysis'],
      ['sam', 'Joins a neighbouring AP as a station to test the network'],
    ],
    explanation: 'Radio `mode` values in a FortiAP profile: **`ap`** (default) serves clients; **`monitor`** is a dedicated monitor that scans and feeds the rogue AP list; **`sniffer`** captures frames on air; **`sam`** (Service Assurance Management) connects to a neighbouring AP to run health checks; `disabled` turns the radio off.',
    lesson: '1.3-fortiap-profiles',
  },
  {
    id: 'd1-041',
    topic: '1.3',
    type: 'multi',
    difficulty: 2,
    stem: 'Which two statements about DARRP on a FortiOS 7.6 wireless controller are true? (Choose two.)',
    options: [
      'DARRP is disabled by default and is enabled per radio with set darrp enable',
      'By default, optimization runs in the default-darrp-optimize schedule, from 01:00 to 01:30 every day',
      'The controller rescans and changes every AP channel every 300 seconds',
      'DARRP requires a FortiAIOps licence before it can be enabled',
      'DFS channels are always excluded from DARRP selection',
    ],
    answer: [0, 1],
    explanation: '`darrp` defaults to **disable** on each radio. Optimization timing is set under `wireless-controller setting`: `darrp-optimize` 86400 s within `darrp-optimize-schedules`, default **`default-darrp-optimize` (01:00–01:30 daily)**. 300 s is the ARRP `monitor-period` for TX retries/RX errors, not a forced channel change. FortiAIOps adds AI-ARRP but plain DARRP needs no licence. `include-dfs-channel` defaults to enable, so DFS channels are candidates unless you exclude them.',
    lesson: '1.3-fortiap-profiles',
  },
  {
    id: 'd1-042',
    topic: '1.3',
    type: 'single',
    difficulty: 3,
    stem: 'Refer to the exhibit. A radio uses an ARRP profile with all thresholds at their defaults. During the selection phase on the AP, which channel is NOT excluded?',
    exhibit: String.raw`DARRP input for FP431GTF20000002 radio 2 (averaged over selection-period)

Channel  APs heard  Noise floor  Channel load  Spectral RSSI
36       14         -94 dBm      72 %          -81 dBm
40       9          -82 dBm      35 %          -79 dBm
44       11         -95 dBm      28 %          -84 dBm
48       6          -93 dBm      22 %          -58 dBm`,
    options: [
      'Channel 36',
      'Channel 40',
      'Channel 44',
      'Channel 48',
    ],
    answer: [2],
    explanation: 'Default ARRP thresholds: `threshold-ap` 250, `threshold-noise-floor` −85 dBm, `threshold-channel-load` 60 %, `threshold-spectral-rssi` −65 dBm. Channel 36 exceeds the load threshold (72 %), channel 40 exceeds the noise floor threshold (−82 dBm is higher than −85), and channel 48 exceeds the spectral RSSI threshold (−58 dBm is higher than −65). **Channel 44** stays within every threshold. If every channel had been excluded, the controller would score them with the configured weights instead.',
    lesson: '1.3-fortiap-profiles',
  },
  {
    id: 'd1-043',
    topic: '1.3',
    type: 'fill',
    difficulty: 2,
    stem: 'Under config wireless-controller setting, what is the default value in seconds of darrp-optimize? (Enter a number.)',
    answer: ['86400'],
    explanation: '`darrp-optimize` defaults to **86400** seconds (24 hours), range 0–86400, 0 disables it. It is the interval between DARRP runs inside `darrp-optimize-schedules` (default `default-darrp-optimize`, 01:00–01:30), so by default DARRP optimizes once a day. An ARRP profile can override both with `override-darrp-optimize enable`.',
    lesson: '1.3-fortiap-profiles',
  },
  {
    id: 'd1-044',
    topic: '1.3',
    type: 'single',
    difficulty: 2,
    stem: 'A radio in a FortiAP profile uses power-mode percentage with power-level 100. What transmit power does that represent?',
    options: [
      'Exactly 100 mW (20 dBm) conducted power on every model',
      'The maximum EIRP permitted for the configured country and supported by the AP',
      'The default 27 dBm EIRP, regardless of country',
      'The highest power the radio chipset can produce, ignoring regulatory limits',
    ],
    answer: [1],
    explanation: 'FortiOS radio power is EIRP. In `percentage` mode (the default), **100 % is the maximum permitted in your region** for that AP; `power-level` 0–100 scales it. 27 dBm is the default `power-value`, used only with `power-mode dBm`. FortiOS never ignores the regulatory limits of the configured country, and 100 % is not a fixed mW value.',
    lesson: '1.3-fortiap-profiles',
  },
  {
    id: 'd1-045',
    topic: '1.3',
    type: 'single',
    difficulty: 1,
    stem: 'An administrator plans FortiAP groups for VLAN assignment by floor and also wants a group for "all ceiling APs". Which rule limits this design?',
    options: [
      'A FortiAP group can contain at most eight APs',
      'Each FortiAP can belong to only one FortiAP group',
      'FortiAP groups can be used only for firmware upgrades',
      'FortiAP groups require FortiEdge Cloud',
    ],
    answer: [1],
    explanation: 'Fortinet states that **each AP can belong to one group only**, so overlapping "per floor" and "ceiling APs" groups are not possible. Groups are used for filtering the Managed FortiAPs view, `reset-wtp` and `rolling-wtp-upgrade` targets, and VLAN assignment by FortiAP group. The eight-AP limit is invented, and groups are a FortiGate controller feature.',
    lesson: '1.3-fortiap-profiles',
  },
  {
    id: 'd1-046',
    topic: '1.3',
    type: 'single',
    difficulty: 2,
    stem: 'Refer to the exhibit. What does the last command do?',
    exhibit: String.raw`config wireless-controller wtp-group
    edit "floor2"
        set platform-type 231F
        config wtp-list
            edit "FP231FTF20000001"
            next
            edit "FP231FTF20000003"
            next
        end
    next
end

FGT-HQ # execute wireless-controller reset-wtp floor2`,
    options: [
      'Restarts FP231FTF20000001 and FP231FTF20000003 only',
      'Restarts every managed FortiAP-231F on the FortiGate',
      'Resets the floor2 group configuration to defaults',
      'Restarts the cw_acd daemon for the APs in floor2',
    ],
    answer: [0],
    explanation: '`execute wireless-controller reset-wtp` accepts `all`, a serial number or a **FortiAP group**, and restarts the matching APs — here the two members of floor2. It does not reach other 231F units outside the group. It does not touch group configuration. Restarting the controller daemon is `execute wireless-controller restart-acd`, which drops every AP.',
    lesson: '1.3-fortiap-profiles',
  },
  {
    id: 'd1-047',
    topic: '1.3',
    type: 'single',
    difficulty: 2,
    stem: 'An administrator creates SSID group "staff-group" with corp-wlan and voice-wlan, and SSID group "all-group" containing staff-group and guest-wlan. What happens?',
    options: [
      'It works; groups can nest to any depth',
      'all-group cannot contain staff-group, because SSID group members must be SSIDs, not other SSID groups',
      'It works, but only on tunnel-mode SSIDs',
      'SSID groups can only be assigned to FortiAP groups, not to radios',
    ],
    answer: [1],
    explanation: 'An SSID group (`config wireless-controller vap-group`, `set vaps …`) has **SSIDs as members, not SSID groups**. A group can be referenced in a radio\'s `vaps` list like a single SSID (with `vap-all manual`), regardless of traffic mode. They are not tied to FortiAP groups.',
    lesson: '1.3-fortiap-profiles',
  },
  {
    id: 'd1-048',
    topic: '1.3',
    type: 'single',
    difficulty: 3,
    stem: 'Where it is legal, an administrator wants FortiAP radios to use UNII-4 channels 169, 173 and 177. Which deployment supports this?',
    options: [
      'Any Wi-Fi 6 FortiAP with channel-bonding set to 20MHz',
      'FortiAP G-series in Single 5G platform mode',
      'FortiAP G-series in Dual 5G platform mode',
      'Any FortiAP after setting the controller country to US',
    ],
    answer: [1],
    explanation: 'Fortinet supports UNII-4 on **FortiAP G-series in Single 5G mode**. It is **not available in Dual 5G mode**, and not every country allows it. With dedicated scan enabled, the channels are available by default; with dedicated scan disabled you turn them on with `set unii-4-5ghz-band enable` (default disable), which removes the UNII-5/UNII-6 channels from radio 3. Channel width and country alone do not add UNII-4 to other models.',
    lesson: '1.1-standards-rf',
  },
  {
    id: 'd1-049',
    topic: '1.3',
    type: 'single',
    difficulty: 1,
    stem: 'Refer to the exhibit. The 5 GHz radios run at 20 MHz even though the site design calls for 40 MHz. Why?',
    exhibit: String.raw`config wireless-controller wtp-profile
    edit "FAP431G-hd"
        config radio-2
            set band 802.11ax-5G
            set channel "36" "44" "149" "157"
            set darrp enable
        end
    next
end`,
    options: [
      'DARRP always forces 20 MHz channels',
      'channel-bonding is not set, and its default is 20MHz',
      '802.11ax does not support 40 MHz in 5 GHz',
      'The channel list contains UNII-3 channels, which are limited to 20 MHz',
    ],
    answer: [1],
    explanation: '`channel-bonding` defaults to **`20MHz`**; set `channel-bonding 40MHz` on radio 2. DARRP works with wider channels (it accounts for bonding of 40 MHz or more when it selects). 802.11ax supports 20/40/80/160 MHz in 5 GHz, and UNII-3 channels can be bonded too (149/153, 157/161).',
    lesson: '1.3-fortiap-profiles',
  },
  {
    id: 'd1-050',
    topic: '1.3',
    type: 'multi',
    difficulty: 2,
    stem: 'An administrator edits one AP under config wireless-controller wtp and opens config radio-2. Which two override options exist there? (Choose two.)',
    options: [
      'override-channel',
      'override-txpower',
      'override-darrp',
      'override-wids-profile',
      'override-channel-bonding',
    ],
    answer: [0, 1],
    explanation: 'Per-radio overrides on a managed AP are **`override-band`, `override-channel`, `override-txpower` and `override-vaps`**. DARRP, WIDS profile and channel width are not individually overridable on the AP entry; change those in the FortiAP profile (or use a different profile). AP-level overrides such as `override-allowaccess` and `override-led-state` sit outside the radio block.',
    lesson: '1.3-fortiap-profiles',
  },
  {
    id: 'd1-051',
    topic: '1.3',
    type: 'fill',
    difficulty: 1,
    stem: 'Complete the command path: to change the wireless controller\'s country, you enter "config ________" and then "set country <code>". (Enter the configuration path after "config".)',
    answer: ['wireless-controller setting'],
    explanation: 'The controller country is set with **`config wireless-controller setting`** → `set country <code>` (default US). Each FortiAP profile also has `ap-country`, whose default `NA` uses the VDOM\'s country.',
    lesson: '1.1-standards-rf',
  },
  {
    id: 'd1-052',
    topic: '1.3',
    type: 'single',
    difficulty: 2,
    stem: 'Refer to the exhibit. Which statement is correct?',
    exhibit: String.raw`FGT-HQ # diagnose wireless-controller wlac -c darrp
wtp_id           rId base_mac          index nr_chan vfid 5G  oper_chan age
FP231FTF20000001 0   04:d5:90:3a:11:28 0     3       0    No  6         3605
FP231FTF20000001 1   04:d5:90:3a:11:30 1     9       0    Yes 44        3605
FP431GTF20000002 1   04:d5:90:4b:20:30 2     9       0    Yes 149       1210`,
    options: [
      'FP231FTF20000001 has DARRP disabled on its 2.4 GHz radio',
      'The 5 GHz radio of FP231FTF20000001 has 9 candidate channels and operates on channel 44',
      'FP431GTF20000002 operates on channel 9 in the 5 GHz band',
      'Both APs use channel 6 on their 2.4 GHz radios',
    ],
    answer: [1],
    explanation: '`wlac -c darrp` lists DARRP-managed radios with the AP serial, radio ID, number of candidate channels (`nr_chan`), whether the radio is 5 GHz and the operating channel (`oper_chan`). FP231FTF20000001 radio 1 is 5 GHz with **9 candidates on channel 44**. Its 2.4 GHz radio (3 candidates, channel 6) is listed, so DARRP is running on it. For FP431GTF20000002, 9 is `nr_chan`, not the channel (it uses 149), and no 2.4 GHz radio of that AP appears.',
    lesson: '1.3-fortiap-profiles',
  },
];
