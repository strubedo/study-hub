// Domain 3 — Wireless monitoring and protection question bank (original, exam-style).
// FortiOS 7.6 / FortiAP 7.6 / FortiAIOps 3.2. Exhibit output follows the field layout of the
// FortiAP 7.6.0 guide samples (wlac -c ap-rogue, wlac -d sta online, wlac -c ha, wireless event logs).
export default [
  {
    id: 'd3-001',
    topic: '3.1',
    type: 'single',
    difficulty: 2,
    stem: "Refer to the exhibit. Which statement about the AP with BSSID 9c:3d:cf:5a:11:20 is true?",
    exhibit: String.raw`FGT-HQ # diagnose wireless-controller wlac -c ap-rogue
CMWP AP: vf                  bssid ssid             ch  rate  sec                  signal noise  age      sta mac                 wtp cnt     ici    bw sgi band                    freq(MHz)
UNYN AP: 0       9c:3d:cf:5a:11:20 Linksys-Lab      6   144   WPA2 Personal           -58 -95    12       00:00:00:00:00:00       1   /1     none    20 1  11NGHT20                2437
 N                FP231FTF20000001 Linksys-Lab      6   144   WPA2 Personal           -58 -95    12       10.10.10.21:5246 -2  11
UNNN AP: 0       5c:62:8b:40:7e:01 CafeNet          11  130   WPA2 Personal           -81 -95    40       00:00:00:00:00:00       1   /1     none    20 1  11NGHT20                2462
 N                FP231FTF20000001 CafeNet          11  130   WPA2 Personal           -81 -95    40       10.10.10.21:5246 -2  11
C - Configured  (G:accept, B:rogue, S:suppress, U:unconfigured)
M - AC managed  (V:vdom, C:AC, N:unmanaged)
W - On wire     (Y:yes, N:no)
P - Phishing    (F:fake, O:offending, N:no)`,
    options: [
      "It has been classified as Rogue and is being suppressed by FP231FTF20000001",
      "It is not managed by FGT-HQ, has not been classified yet, and on-wire detection suspects it is connected to the wired network",
      "It is broadcasting an SSID that is configured on FGT-HQ, so it is reported as a fake AP",
      "It is a FortiAP managed by another VDOM on FGT-HQ, so FGT-HQ ignores it",
    ],
    answer: [1],
    explanation: "Read the four code letters: **U** (unconfigured: still Unclassified), **N** (not managed by this controller), **Y** (on wire), **N** (not a phishing SSID). That is exactly the entry an administrator should investigate and probably mark Rogue. It is not classified as rogue (that would be B) or suppressed (S). The phishing letter is N, so it is not a fake SSID (F). A FortiAP in another VDOM would show V in the managed column, not N. CafeNet (UNNN) is an ordinary neighbour: unmanaged and not on wire.",
    lesson: '3.1-rogue-detection',
  },
  {
    id: 'd3-002',
    topic: '3.1',
    type: 'single',
    difficulty: 2,
    stem: "Refer to the exhibit. FGT-HQ broadcasts the SSIDs Corp and Guest. Which conclusion about the second entry is correct?",
    exhibit: String.raw`FGT-HQ # diagnose wireless-controller wlac -c ap-rogue
CMWP AP: vf                  bssid ssid             ch  rate  sec                  signal noise  age      sta mac                 wtp cnt     ici    bw sgi band                    freq(MHz)
GNNN AP: 0       5c:62:8b:40:7e:01 CafeNet          11  130   WPA2 Personal           -81 -95    40       00:00:00:00:00:00       1   /1     none    20 1  11NGHT20                2462
 N                FP231FTF20000001 CafeNet          11  130   WPA2 Personal           -81 -95    40       10.10.10.21:5246 -2  11
UNNF AP: 0       a2:b5:7c:11:42:90 Corp             44  286   WPA2 Personal           -61 -95    3        00:00:00:00:00:00       1   /1     none    20 1  11AXAHE20               5220
 N                FP431GTF20000002 Corp             44  286   WPA2 Personal           -61 -95    3        10.10.10.22:5246 -2  12
C - Configured  (G:accept, B:rogue, S:suppress, U:unconfigured)
M - AC managed  (V:vdom, C:AC, N:unmanaged)
W - On wire     (Y:yes, N:no)
P - Phishing    (F:fake, O:offending, N:no)`,
    options: [
      "An AP that FGT-HQ does not manage is broadcasting the corporate SSID, which phishing SSID detection reports as a fake AP",
      "FP431GTF20000002 is broadcasting Corp on channel 44 and has been flagged because its signal is too strong",
      "The AP is on the wired network, so it must be a rogue that matched by MAC adjacency",
      "The AP matched an offending-ssid pattern, so it is already being suppressed",
    ],
    answer: [0],
    explanation: "The phishing letter **F** means **fake**: an unmanaged AP (N in the managed column) is broadcasting an SSID that is defined on this FortiGate. This is the evil-twin / hotspot-hacker case, and on-wire is N, so it is not (yet) seen on the LAN. FP431GTF20000002 is the managed AP that *heard* the BSSID, shown on the detail line. An offending-pattern match would show **O**, and a suppressed AP would show **S** in the first column; this one is still U. The first entry, GNNN, is a neighbour an administrator has marked Accepted.",
    lesson: '3.1-suppression-wids',
  },
  {
    id: 'd3-003',
    topic: '3.1',
    type: 'multi',
    difficulty: 2,
    stem: "An administrator wants FGT-HQ to suppress a rogue AP that has been confirmed on the corporate LAN. Which two conditions must be met for suppression to work? (Choose two.)",
    options: [
      "Rogue AP scanning with on-wire detection is enabled in the WIDS profile",
      "The FortiAP radio that performs suppression is in Dedicated Monitor mode",
      "Protected management frames are enabled on every corporate SSID",
      "The FortiGate has an active FortiGuard IPS subscription",
      "The rogue AP uses the same channel as one of the corporate SSIDs",
    ],
    answer: [0, 1],
    explanation: "Fortinet requires rogue monitoring with the **on-wire** technique enabled and the monitoring radio in **Dedicated Monitor** mode before suppression can be activated (plus a check that local regulations allow it). PMF on your own SSIDs protects your clients from forged deauthentication but is not a suppression prerequisite. Suppression is a wireless controller function, not a FortiGuard IPS feature. The monitor radio can work on whatever channel the rogue uses; nothing requires it to share a corporate channel.",
    lesson: '3.1-suppression-wids',
  },
  {
    id: 'd3-004',
    topic: '3.1',
    type: 'single',
    difficulty: 1,
    stem: "What does a FortiGate wireless controller do to a rogue AP that is in the Suppressed Rogue AP state?",
    options: [
      "It blocks the rogue AP's MAC address in a firewall policy so its traffic cannot reach the LAN",
      "It sends deauthentication frames to the rogue's clients as if from the rogue, and to the rogue as if from its clients",
      "It jams the rogue's channel with continuous noise from the monitor radio",
      "It shuts down the FortiSwitch port the rogue is connected to",
    ],
    answer: [1],
    explanation: "Suppression is an over-the-air attack: a monitoring radio spoofs **deauthentication** frames in both directions, so clients cannot stay associated. It does not create firewall policies, transmit noise, or touch switch ports (finding and unplugging the device is still your job, and FortiSwitch features are separate). Because it transmits against another network, check local law before using it.",
    lesson: '3.1-suppression-wids',
  },
  {
    id: 'd3-005',
    topic: '3.1',
    type: 'single',
    difficulty: 2,
    stem: "An employee plugs a consumer wireless router into a desk port. The router performs NAT for its wireless clients, so their MAC addresses never appear on the corporate LAN. Which FortiGate on-wire technique can still identify it as a rogue?",
    options: [
      "Exact MAC address match",
      "MAC adjacency",
      "Phishing SSID detection",
      "ARP inspection of the router's DHCP pool",
    ],
    answer: [1],
    explanation: "Behind NAT, only the router's own wired MAC reaches the LAN. **MAC adjacency** matches a wireless MAC (the router's BSSID) that is numerically close to a MAC seen on the wire, because vendors number a device's radio and Ethernet MACs close together (window set by `rogue-scan-mac-adjacency`, default 7). Exact MAC match needs the *same* MAC on both sides, which only happens with bridging (non-NAT) rogues. Phishing SSID detection looks at SSID names, not wiring. There is no ARP-inspection on-wire method.",
    lesson: '3.1-rogue-detection',
  },
  {
    id: 'd3-006',
    topic: '3.1',
    type: 'single',
    difficulty: 3,
    stem: "Refer to the exhibit. A technician found an unauthorised bridge-mode AP (no NAT) plugged into a LAN port on FGT-HQ's network, but the Rogue AP monitor shows it with a red down-arrow in the On-wire column. Rogue scanning with on-wire detection is enabled. What is the most likely reason?",
    exhibit: String.raw`Dashboard > WiFi > Rogue APs (extract)

State         SSID          MAC Address          On-wire   Detected By        Channel  Signal  Last Seen
Unclassified  PrinterSetup  ac:84:c6:0b:2f:10    (down)    FP231FTF20000001   1        -52     1 minute ago

Technician note: AP powered on 09:00, no devices have associated to it yet.`,
    options: [
      "On-wire detection needs at least one client associated to the suspect AP and sending traffic, and this AP has none",
      "Exact MAC match only works for APs that perform NAT",
      "The rogue's signal is above the ap-scan-threshold, so on-wire checks are skipped",
      "On-wire detection only runs on 5 GHz channels",
    ],
    answer: [0],
    explanation: "On-wire correlation compares MACs of wireless clients (and the AP) seen on the air with MACs seen on the LAN. Fortinet lists the limitation directly: at least one WiFi client must be connected to the suspect AP and continuously sending traffic. With no clients, there is nothing to correlate. Exact MAC match is the method for **non-NAT** APs, the reverse of the distractor. `ap-scan-threshold` (default -90 dBm) suppresses reporting of *weak* APs; -52 dBm is strong and was reported. On-wire detection is not limited to one band.",
    lesson: '3.1-rogue-detection',
  },
  {
    id: 'd3-007',
    topic: '3.1',
    type: 'fill',
    difficulty: 2,
    stem: "Under `config wireless-controller global`, which setting (keyword only) changes the maximum numerical difference between a suspect AP's wireless and Ethernet MAC addresses used for on-wire rogue detection?",
    answer: ['rogue-scan-mac-adjacency', 'set rogue-scan-mac-adjacency'],
    explanation: "`set rogue-scan-mac-adjacency <0-31>` (default 7) controls the MAC adjacency window. A larger value catches more NAT routers but increases the chance of false matches.",
    lesson: '3.1-rogue-detection',
  },
  {
    id: 'd3-008',
    topic: '3.1',
    type: 'match',
    difficulty: 1,
    stem: "Match each Rogue AP monitor state to its intended use.",
    pairs: [
      ['Unclassified', 'Initial state of every newly detected AP'],
      ['Accepted', 'Authorised AP or a reviewed neighbour that is not a threat'],
      ['Rogue', 'Unauthorised AP that on-wire detection shows is attached to your network'],
      ['Suppressed Rogue AP', 'Unauthorised AP that the controller actively deauthenticates'],
    ],
    explanation: "Every AP starts **Unclassified** (and can be set back if misclassified). **Accepted** hides harmless or authorised APs (use Show Accepted to see them). **Rogue** is for unauthorised APs on your wire. **Suppressed Rogue AP** triggers deauthentication-based suppression.",
    lesson: '3.1-rogue-detection',
  },
  {
    id: 'd3-009',
    topic: '3.1',
    type: 'single',
    difficulty: 2,
    stem: "Refer to the exhibit. The profile is applied to radio 1 of AP-Lobby, which serves clients on channel 6. Which statement is true?",
    exhibit: String.raw`FGT-HQ # show wireless-controller wids-profile wids-office
config wireless-controller wids-profile
    edit "wids-office"
        set sensor-mode foreign
        set ap-scan enable
        set ap-scan-threshold "-85"
    next
end`,
    options: [
      "The radio stops serving clients and scans all channels full time",
      "The radio scans the channels other than channel 6 for nearby APs and reports those at -85 dBm or stronger",
      "The radio scans only channel 6, because foreign means the home channel",
      "No scanning happens until a WIDS intrusion detection such as deauth-broadcast is also enabled",
    ],
    answer: [1],
    explanation: "`sensor-mode foreign` monitors **foreign channels**, meaning every available channel except the current operating channel (`both` adds the home channel). `ap-scan enable` turns on rogue AP detection, and `ap-scan-threshold -85` means APs weaker than -85 dBm are not reported. The radio is still in AP mode, so it scans in the background rather than full time; full-time scanning is `mode monitor`. Rogue scanning does not depend on any intrusion detection being enabled.",
    lesson: '3.1-rogue-detection',
  },
  {
    id: 'd3-010',
    topic: '3.1',
    type: 'single',
    difficulty: 2,
    stem: "Refer to the exhibit. An attacker in the car park broadcasts Corp from a laptop. FGT-HQ manages the FortiAPs that hear it. What will FGT-HQ do?",
    exhibit: String.raw`FGT-HQ # show full-configuration wireless-controller setting | grep -e phishing -e fake
    set phishing-ssid-detect enable
    set fake-ssid-action log`,
    options: [
      "Detect the fake SSID and log it, but not suppress it",
      "Detect the fake SSID, log it and send deauthentication frames to its clients",
      "Nothing, because phishing detection only applies to offending-ssid patterns",
      "Nothing, because fake SSID detection requires the attacker's AP to be on the wired network",
    ],
    answer: [0],
    explanation: "With `phishing-ssid-detect enable`, an unmanaged AP broadcasting an SSID defined on the FortiGate is a **fake SSID**. `fake-ssid-action log` (the default) only writes logs (Fake AP detected / Fake AP on air). To also attack it, set `fake-ssid-action log suppress`, after checking that local law allows it. Fake SSID detection is separate from offending patterns and does not need an on-wire match.",
    lesson: '3.1-suppression-wids',
  },
  {
    id: 'd3-011',
    topic: '3.1',
    type: 'single',
    difficulty: 2,
    stem: "Refer to the exhibit. Which detected SSID will be logged and suppressed by this configuration?",
    exhibit: String.raw`config wireless-controller setting
    set phishing-ssid-detect enable
    config offending-ssid
        edit 1
            set ssid-pattern "*corp*"
            set action log suppress
        next
    end
end`,
    options: [
      "C0rp-WiFi",
      "Free-CORP-WiFi",
      "Cor_p",
      "Visitor",
    ],
    answer: [1],
    explanation: "The offending-SSID pattern is **case-insensitive** and `*corp*` matches any SSID containing \"corp\", so Free-CORP-WiFi matches and both actions apply. C0rp-WiFi uses a zero, Cor_p has an underscore inside the word, and Visitor contains no match.",
    lesson: '3.1-suppression-wids',
  },
  {
    id: 'd3-012',
    topic: '3.1',
    type: 'multi',
    difficulty: 2,
    stem: "Which two WIDS profile detections identify denial-of-service attempts? (Choose two.)",
    options: [
      "deauth-broadcast",
      "assoc-frame-flood",
      "weak-wep-iv",
      "asleap-attack",
      "invalid-mac-oui",
    ],
    answer: [0, 1],
    explanation: "Broadcast deauthentication knocks every client off an AP, and association frame flooding (default threshold 30 requests in 10 s) exhausts the AP: both are DoS. Weak WEP IV detection flags traffic that helps crack WEP keys, asleap targets LEAP credentials, and invalid MAC OUI flags randomly generated source MACs, a spoofing indicator rather than a DoS.",
    lesson: '3.1-suppression-wids',
  },
  {
    id: 'd3-013',
    topic: '3.1',
    type: 'match',
    difficulty: 2,
    stem: "Match each WIDS profile detection to what it looks for.",
    pairs: [
      ['wireless-bridge', 'Frames with both the To DS and From DS bits set'],
      ['weak-wep-iv', 'Known weak WEP initialisation vectors in on-air traffic'],
      ['null-ssid-probe-resp', 'Probe responses carrying an empty SSID'],
      ['long-duration-attack', 'Frames that reserve the medium longer than a microsecond threshold'],
      ['asleap-attack', 'Attacks against Cisco LEAP authentication'],
    ],
    explanation: "Four-address frames (To DS and From DS set) indicate a wireless bridge, including ones you built on purpose. Weak IVs are the classic WEP-cracking pattern. Null SSID probe responses make some client drivers stop responding. Long-duration attacks abuse the duration field (threshold 1000–32767 µs, default 8200). Asleap is a LEAP cracking tool.",
    lesson: '3.1-suppression-wids',
  },
  {
    id: 'd3-014',
    topic: '3.1',
    type: 'single',
    difficulty: 1,
    stem: "A WIDS profile with spoofed-deauth and eapol-start-flood enabled is applied to a radio. When the FortiAP detects one of these attacks, what does FortiOS do?",
    options: [
      "It records a wireless event log entry for the detection",
      "It blocks the attacker's MAC address on all SSIDs until an administrator clears it",
      "It moves the radio to a different channel through DARRP",
      "It quarantines every client associated to the radio",
    ],
    answer: [0],
    explanation: "WIDS is a detection system: when an attack is detected the FortiGate records a log message (level set by `wids-log` under `config wireless-controller log`). It does not automatically blocklist MACs, change channels or quarantine clients. The only related rate control is `deauth-unknown-src-thresh`, which limits mitigation deauthentication.",
    lesson: '3.1-suppression-wids',
  },
  {
    id: 'd3-015',
    topic: '3.1',
    type: 'single',
    difficulty: 3,
    stem: "Refer to the exhibit. AP-Floor2 detects an on-wire rogue, but it is never suppressed. What is the cause?",
    exhibit: String.raw`config wireless-controller wids-profile
    edit "wids-auto"
        set sensor-mode both
        set ap-scan enable
        set ap-auto-suppress enable
    next
end
config wireless-controller wtp-profile
    edit "FAP431G-hd"
        config radio-1
            set mode ap
            set wids-profile "wids-auto"
        end
        config radio-2
            set mode ap
            set wids-profile "wids-auto"
        end
        config radio-3
            set mode disabled
        end
    next
end`,
    options: [
      "ap-auto-suppress only works when sensor-mode is foreign",
      "No radio is in Dedicated Monitor mode, which suppression requires",
      "The rogue must first be marked Accepted before it can be suppressed",
      "ap-auto-suppress applies only to fake SSIDs, not to on-wire rogues",
    ],
    answer: [1],
    explanation: "Both serving radios are in `mode ap` and radio 3 is disabled. Suppression must be performed by a radio in **Dedicated Monitor** mode (`set mode monitor`), so setting radio 3 to monitor with the WIDS profile fixes it. `ap-auto-suppress` is on-wire rogue auto-suppression and works with either sensor mode. Accepted is the opposite of what you want; fake SSIDs are handled by `fake-ssid-action` under `config wireless-controller setting`.",
    lesson: '3.1-suppression-wids',
  },
  {
    id: 'd3-016',
    topic: '3.1',
    type: 'fill',
    difficulty: 2,
    stem: "Which CLI table do you edit to set an AP's status to rogue, accepted or suppressed by BSSID and SSID? (Enter the full `config` command.)",
    answer: ['config wireless-controller ap-status'],
    explanation: "`config wireless-controller ap-status` → `edit <id>` → `set bssid`, `set ssid`, `set status rogue|accepted|suppressed` (default rogue). The Rogue AP monitor's state changes are stored here.",
    lesson: '3.1-rogue-detection',
  },
  {
    id: 'd3-017',
    topic: '3.1',
    type: 'single',
    difficulty: 2,
    stem: "After enabling a WIDS profile with many detections, the administrator sees repeated alerts for a wireless bridge, and the BSSIDs belong to the company's own FortiAP point-to-point link between two buildings. What explains this?",
    options: [
      "The point-to-point link must be misconfigured, because legitimate links never trigger WIDS",
      "The wireless bridge detection flags any frames with both To DS and From DS set, which includes bridges built on purpose",
      "The link uses DTLS on the data channel, which WIDS mistakes for an attack",
      "WIDS flags all mesh traffic as spoofed deauthentication",
    ],
    answer: [1],
    explanation: "Wireless bridge detection keys on four-address frames (To DS and From DS both set). A mesh or point-to-point bridge legitimately sends such frames, so Fortinet notes that this detection also fires on bridges you configured intentionally. CAPWAP data channel security is invisible to over-the-air WIDS, and mesh traffic is not treated as spoofed deauthentication.",
    lesson: '3.1-suppression-wids',
  },
  {
    id: 'd3-018',
    topic: '3.1',
    type: 'single',
    difficulty: 2,
    stem: "Refer to the exhibit. What is true about this log?",
    exhibit: String.raw`date=2026-10-12 time=09:14:03 logid="0104043567" type="event" subtype="wireless" level="warning" vd="root" logdesc="Fake AP detected" ssid="Corp" bssid="a2:b5:7c:11:42:90" aptype=0 rate=286 radioband="802.11ax-5G" channel=44 action="fake-ap-detected" manuf="N/A" security="WPA2 Personal" encryption="AES" signal=-61 noise=-95 live=95 age=0 onwire="no" detectionmethod="N/A" stamac="N/A" apscan="N/A" sndetected="FP431GTF20000002" radioiddetected=2 stacount=0 snclosest="FP431GTF20000002" radioidclosest=2 apstatus=0 msg="Detected Fake AP Corp a2:b5:7c:11:42:90 chan 44 live 95 age 0"`,
    options: [
      "FP431GTF20000002 is the AP broadcasting the fake Corp SSID",
      "An AP that FGT-HQ does not manage is broadcasting the Corp SSID, and FP431GTF20000002 radio 2 heard it",
      "The BSSID was found on the wired LAN by exact MAC match",
      "The fake AP is being suppressed because the log level is warning",
    ],
    answer: [1],
    explanation: "\"Fake AP detected\" (action fake-ap-detected) is written the first time an unmanaged AP is seen broadcasting an SSID defined on the FortiGate. `sndetected`/`snclosest` identify the managed FortiAP that heard it, not the offender. `onwire=\"no\"` and `detectionmethod=\"N/A\"`: it was not matched on the LAN. Suppression produces its own log (\"Rogue AP suppressed\", action rogue-ap-suppressed); the warning level says nothing about suppression.",
    lesson: '3.1-suppression-wids',
  },
  {
    id: 'd3-019',
    topic: '3.1',
    type: 'single',
    difficulty: 3,
    stem: "Refer to the exhibit. The administrator wants radios 1 and 2 of these FortiAP-431F units to background scan for rogue APs. What does the ddscan change make possible?",
    exhibit: String.raw`config wireless-controller wtp-profile
    edit "FAP431F-office"
        config platform
            set type 431F
            set ddscan disable
        end
        config radio-1
            set band 802.11ax,n,g-only
        end
        config radio-2
            set band 802.11ax-5G
        end
        config radio-3
            set mode disabled
        end
    next
end`,
    options: [
      "Radio 3 becomes a sniffer that saves a pcap of all channels",
      "The WIDS profile option becomes available on radios 1 and 2, so they can background scan while serving clients",
      "Radios 1 and 2 switch to Dedicated Monitor mode automatically",
      "Rogue scanning is disabled on the whole FortiGate",
    ],
    answer: [1],
    explanation: "On F-series profiles, dedicated scanning (`ddscan`, enabled automatically on new profiles) uses one radio for full-band scanning. Disabling it frees that radio and makes the **WIDS profile** setting available on radios 1 and 2; with radio mode AP and a WIDS profile with `ap-scan enable`, they scan in the background. Nothing becomes a sniffer or a dedicated monitor automatically, and other profiles keep their own scanning.",
    lesson: '3.1-rogue-detection',
  },
  {
    id: 'd3-020',
    topic: '3.2',
    type: 'single',
    difficulty: 2,
    stem: "Refer to the exhibit. What overall health does FortiOS assign to this client's connection?",
    exhibit: String.raw`WiFi & Switch Controller > WiFi Clients > 02:1a:2b:3c:4d:5e (summary)

SSID               Corp
FortiAP            FP431GTF20000002 (AP-Floor2)
Channel            36
Band               5 GHz
Signal Strength    -62 dBm
Signal Strength / Noise   33 dB`,
    options: [
      "Good, because the client is on the 5 GHz band",
      "Fair, because signal strength and signal-to-noise ratio both fall in the Fair range",
      "Poor, because any signal weaker than -60 dBm is Poor",
      "Good, because two of the three conditions are Good",
    ],
    answer: [1],
    explanation: "FortiOS rates signal strength Good above -56 dBm, Fair between -56 and -75 dBm, Poor below -75 dBm; SNR Good above 39, Fair 20–39, Poor below 20; band Good on 5 GHz, Fair on 2.4 GHz. -62 dBm and 33 dB are both Fair. The overall result is Good only when **all three** conditions are Good, so 5 GHz alone does not make it Good, and -62 dBm is not in the Poor range.",
    lesson: '3.2-monitoring',
  },
  {
    id: 'd3-021',
    topic: '3.2',
    type: 'match',
    difficulty: 1,
    stem: "Match each FortiGate GUI view to the question it answers best.",
    pairs: [
      ['WiFi & Switch Controller > Managed FortiAPs', 'Which APs are authorised and online, with which profile and firmware?'],
      ['WiFi & Switch Controller > WiFi Clients', 'Which clients are connected, and with what signal and SNR?'],
      ['Dashboard > WiFi > Rogue APs', 'Which unmanaged APs are on the air, and are any on the wire?'],
      ['Diagnostics and Tools (right-click an AP)', 'What is the health of this one AP, per radio, with its clients and logs?'],
    ],
    explanation: "Managed FortiAPs is the AP inventory and action list. WiFi Clients shows per-client data (signal, SNR, channel, bandwidth, association time). The Rogue AP monitor lists detected APs with their on-wire status. Diagnostics and Tools is the single-AP view with a health assessment and Radios, Clients and Logs tabs.",
    lesson: '3.2-monitoring',
  },
  {
    id: 'd3-022',
    topic: '3.2',
    type: 'single',
    difficulty: 1,
    stem: "From a wireless client's summary page in the WiFi Clients monitor, an administrator wants to block the device from the network rather than just kick it off once. Which action should the administrator use?",
    options: [
      "Disassociate",
      "Quarantine",
      "Deauthorize",
      "Suppress",
    ],
    answer: [1],
    explanation: "**Quarantine** blocks the host. **Disassociate** only removes the current association, and the client can reconnect. Deauthorize is an action on FortiAPs (Managed FortiAPs), and suppression applies to rogue APs.",
    lesson: '3.2-monitoring',
  },
  {
    id: 'd3-023',
    topic: '3.2',
    type: 'single',
    difficulty: 2,
    stem: "Refer to the exhibit. A script polls FortiAPs over their REST API. Which call returned this response?",
    exhibit: String.raw`$ curl -k -b fap.cookie https://10.10.10.21/api/v1/<call>
{
 "cpu_usage": 3,
 "memory_usage": 58
}`,
    options: [
      "GET /api/v1/sys-perf",
      "GET /api/v1/sys-status",
      "GET /api/v1/wtp-cfg",
      "POST /api/v1/cfg-set",
    ],
    answer: [0],
    explanation: "`sys-perf` returns system performance values: CPU and memory usage. `sys-status` is the equivalent of `fap-get-status` (system status), `wtp-cfg` returns the AP configuration in the control plane, and `cfg-set` is a POST that changes variables.",
    lesson: '3.2-monitoring',
  },
  {
    id: 'd3-024',
    topic: '3.2',
    type: 'fill',
    difficulty: 2,
    stem: "Which FortiAP REST API path, used with POST, reboots the FortiAP? (Enter the path only.)",
    answer: ['/api/v1/reboot', 'api/v1/reboot'],
    explanation: "`POST https://<FAP-IP>/api/v1/reboot`. Calls that change state (logincheck, logout, cfg-set, reboot) use POST; reads use GET.",
    lesson: '3.2-monitoring',
  },
  {
    id: 'd3-025',
    topic: '3.2',
    type: 'multi',
    difficulty: 2,
    stem: "Which two FortiAP REST API calls use the POST method? (Choose two.)",
    options: [
      "/logincheck",
      "/api/v1/cfg-set",
      "/api/v1/sys-status",
      "/api/v1/radio-cfg?rId=1",
      "/api/v1/vap-cfg?rId=0&wId=1",
    ],
    answer: [0, 1],
    explanation: "Logging in (`/logincheck`) and adding or changing variables (`/api/v1/cfg-set`) are POST calls, as are `/logout` and `/api/v1/reboot`. `sys-status`, `radio-cfg` and `vap-cfg` read data and use GET; the query parameters select a radio (`rId`) and WLAN (`wId`).",
    lesson: '3.2-monitoring',
  },
  {
    id: 'd3-026',
    topic: '3.2',
    type: 'single',
    difficulty: 2,
    stem: "An inventory script must read only the WTP_NAME variable from each FortiAP through the FortiAP REST API. Which request should it send after logging in?",
    options: [
      "GET /api/v1/cfg-get?names=WTP_NAME",
      "GET /api/v1/cfg-meta-get?names=WTP_NAME",
      "POST /api/v1/cfg-set with WTP_NAME in the body",
      "GET /api/v1/wtp-cfg?rId=0",
    ],
    answer: [0],
    explanation: "`cfg-get` lists effective FortiAP variables and accepts a `names=` filter (comma-separated for several, for example `names=WTP_NAME,ADMIN_TIMEOUT`). `cfg-meta-get` lists all variables, `cfg-set` changes them, and `rId` selects a radio on `radio-cfg`/`vap-cfg`, not a variable.",
    lesson: '3.2-monitoring',
  },
  {
    id: 'd3-027',
    topic: '3.2',
    type: 'single',
    difficulty: 1,
    stem: "What does enabling 802.11k on an SSID (`set 80211k enable`) do for roaming clients?",
    options: [
      "It lets the AP give clients a neighbor report of nearby APs, so they scan fewer channels before roaming",
      "It derives keys for the next AP in advance, so no 4-way handshake is needed",
      "It lets the controller force a client to roam by deauthenticating it",
      "It protects deauthentication and disassociation frames",
    ],
    answer: [0],
    explanation: "802.11k (radio resource measurement) provides **neighbor reports**, shortening the client's search for a roaming target. Fast key derivation is 802.11r, steering suggestions are 802.11v BSS transition management (a request, not a forced deauth), and protecting management frames is 802.11w PMF. FortiOS enables `80211k` by default.",
    lesson: '3.2-roaming-load-balancing',
  },
  {
    id: 'd3-028',
    topic: '3.2',
    type: 'match',
    difficulty: 2,
    stem: "Match each roaming or protection feature to its FortiOS SSID keyword.",
    pairs: [
      ['802.11r Fast BSS Transition', 'fast-bss-transition'],
      ['802.11k neighbor reports', '80211k'],
      ['802.11v BSS transition management', '80211v'],
      ['Opportunistic Key Caching', 'okc'],
      ['802.11w Protected Management Frames', 'pmf'],
    ],
    explanation: "All are `config wireless-controller vap` settings. Defaults: `fast-bss-transition` disable, `80211k` enable, `80211v` enable, `okc` enable, `pmf` disable (WPA3 modes require it).",
    lesson: '3.2-roaming-load-balancing',
  },
  {
    id: 'd3-029',
    topic: '3.2',
    type: 'single',
    difficulty: 3,
    stem: "Refer to the exhibit. After this change, voice handsets roam faster, but a few older barcode scanners can no longer connect to Corp at all. What is the most likely cause?",
    exhibit: String.raw`FGT-HQ # show wireless-controller vap corp-wlan
config wireless-controller vap
    edit "corp-wlan"
        set ssid "Corp"
        set security wpa2-only-enterprise
        set auth radius
        set radius-server "RADIUS-NPS"
        set fast-bss-transition enable
        set ft-mobility-domain 1000
        set okc enable
    next
end`,
    options: [
      "OKC cannot be combined with WPA2-Enterprise, so authentication fails",
      "Some older clients do not handle the Fast BSS Transition (802.11r) capability that the SSID now advertises",
      "ft-mobility-domain 1000 is reserved and must be changed",
      "802.11r requires a separate RADIUS server for each AP",
    ],
    answer: [1],
    explanation: "Enabling `fast-bss-transition` adds 802.11r FT to what the SSID advertises. Some legacy client drivers fail to associate to such SSIDs, and the usual fix is a separate SSID without 802.11r for them. OKC is designed for Enterprise SSIDs. 1000 is simply the default mobility domain, which must match across the APs. FT does not need per-AP RADIUS servers.",
    lesson: '3.2-roaming-load-balancing',
  },
  {
    id: 'd3-030',
    topic: '3.2',
    type: 'fill',
    difficulty: 1,
    stem: "Which `config wireless-controller vap` keyword enables 802.11r Fast BSS Transition? (Keyword only.)",
    answer: ['fast-bss-transition', 'set fast-bss-transition enable', 'set fast-bss-transition'],
    explanation: "`set fast-bss-transition enable` (default disable). Related: `ft-mobility-domain` (default 1000), `ft-over-ds` (default disable), `ft-r0-key-lifetime` (default 480 minutes).",
    lesson: '3.2-roaming-load-balancing',
  },
  {
    id: 'd3-031',
    topic: '3.2',
    type: 'single',
    difficulty: 3,
    stem: "Refer to the exhibit. FGT-HQ owns the Guest SSID subnet 10.20.20.0/24; FGT-Branch serves Guest on 10.30.20.0/24 and has L3 roaming configured with FGT-HQ. The output is from FGT-Branch. What is happening?",
    exhibit: String.raw`FGT-Branch # diagnose wireless-controller wlac -d sta online
   vf=0 wtp=3 rId=2 wlan=guest-wlan vlan_id=0 ip=10.20.20.57 ip6=:: mac=02:1a:2b:3c:4d:5e vci= host= user= group= signal=-63 noise=-95 idle=0 bw=4 use=7 chan=36 radio_type=11AC(wave2) security=wpa2_only_personal mpsk= encrypt=aes cp_authed=no l3r=0,1 0.0.0.0:0 -- 0.0.0.0:0 0,0 online=yes mimo=2`,
    options: [
      "The client roamed from an FGT-HQ AP and keeps its home address; its traffic is carried back to FGT-HQ until it is idle longer than client-idle-rehome-timeout",
      "FGT-Branch assigned the client an address from the wrong DHCP scope and must be corrected",
      "The client is still associated to an FGT-HQ AP; FGT-Branch only sees it through the mobility tunnel",
      "L3 roaming failed, so the client is in the FGT-HQ onboarding VLAN",
    ],
    answer: [0],
    explanation: "The client is online on an FGT-Branch AP (wtp=3, chan 36) but still uses 10.20.20.57 from FGT-HQ's subnet: that is inter-controller L3 roaming, where the controllers' mobility tunnel carries the traffic back to the home controller (the `l3r=` field tracks L3 roaming state). After the client stays idle longer than `client-idle-rehome-timeout` (default 20 s) it rehomes, takes a DHCP address from 10.30.20.0/24 and is handled locally. Nothing indicates a wrong scope or a NAC onboarding VLAN.",
    lesson: '3.2-roaming-load-balancing',
  },
  {
    id: 'd3-032',
    topic: '3.2',
    type: 'single',
    difficulty: 3,
    stem: "Refer to the exhibit. The peers are up, but clients that walk from FGT-HQ's APs to FGT-Branch's APs always get a new IP address immediately. Both FortiGates broadcast Guest with the same security and passphrase. What must the administrator change?",
    exhibit: String.raw`FGT-HQ # diagnose wireless-controller wlac -c ha
WC fast failover info
    mode    : disabled
    l3r     : enabled
    peer cnt: 1
              FGT60FTK20000009 192.0.2.40:5246       UP 2

FGT-HQ # show wireless-controller vap guest-wlan
config wireless-controller vap
    edit "guest-wlan"
        set ssid "Guest"
        set passphrase ENC xxxxxxxx
        set schedule "always"
    next
end`,
    options: [
      "Enable l3-roaming on the guest-wlan VAP on both FortiGates",
      "Set inter-controller-mode to 1+1",
      "Change peer-port to 5247 so data can flow",
      "Enable fast-bss-transition, because L3 roaming requires 802.11r",
    ],
    answer: [0],
    explanation: "The global part is working (`l3r : enabled`, peer UP), but L3 roaming must also be enabled on the SSID: `config wireless-controller vap` → `set l3-roaming enable` (default disable) on both controllers. `1+1` is the fast-failover mode, not roaming. The peer port defaults to 5246 and the peer is already up. 802.11r is unrelated to inter-controller L3 roaming.",
    lesson: '3.2-roaming-load-balancing',
  },
  {
    id: 'd3-033',
    topic: '3.2',
    type: 'multi',
    difficulty: 2,
    stem: "Which two statements about layer 2 roaming between FortiAPs managed by the same FortiGate are true? (Choose two.)",
    options: [
      "On a tunnel-mode SSID the client keeps the same IP address when it roams between the APs",
      "On a local-bridge SSID the client keeps its IP address only if both APs bridge it into the same subnet",
      "On a local-bridge SSID the client always keeps its IP address because the FortiGate tracks it",
      "L2 roaming requires inter-controller peers to be configured",
      "OKC must be enabled or the client cannot roam",
    ],
    answer: [0, 1],
    explanation: "Tunnel-mode traffic always terminates on the same FortiGate SSID interface, so the address survives roaming. Bridged traffic leaves at each AP, so the client keeps its address only when both APs put it in the same subnet; otherwise it needs a new DHCP lease. Inter-controller peers are for L3 roaming between FortiGates. OKC speeds up Enterprise roams but is not required to roam.",
    lesson: '3.2-roaming-load-balancing',
  },
  {
    id: 'd3-034',
    topic: '3.2',
    type: 'single',
    difficulty: 2,
    stem: "Refer to the exhibit. A dual-band laptop with a good 5 GHz signal tries to join Corp on 2.4 GHz at AP-Lobby. What happens?",
    exhibit: String.raw`config wireless-controller wtp-profile
    edit "FAP231F-office"
        set frequency-handoff enable
        set handoff-rssi 25
        config radio-1
            set band 802.11ax,n,g-only
        end
        config radio-2
            set band 802.11ax-5G
        end
    next
end`,
    options: [
      "The AP does not answer the 2.4 GHz join, so the laptop times out and joins Corp on 5 GHz",
      "The AP accepts the join on 2.4 GHz and then sends an 802.11v request after 30 seconds",
      "The AP deauthenticates the laptop every time it associates on 2.4 GHz",
      "Nothing changes, because frequency handoff only affects 2.4 GHz-only clients",
    ],
    answer: [0],
    explanation: "With frequency handoff, the controller knows from earlier probes that the laptop is dual-band and how strong it is on 5 GHz (compared with `handoff-rssi`, default 25). If the 5 GHz signal is good enough, the AP **does not reply** on 2.4 GHz; the client retries, times out and tries 5 GHz. If the 5 GHz signal is too weak, a later 2.4 GHz attempt is accepted. It does not use deauthentication, and 2.4 GHz-only clients are always allowed on 2.4 GHz.",
    lesson: '3.2-roaming-load-balancing',
  },
  {
    id: 'd3-035',
    topic: '3.2',
    type: 'single',
    difficulty: 2,
    stem: "Refer to the exhibit. AP-Floor2 already has more clients than its handoff threshold. A new client hears AP-Floor2 strongly and a neighbouring AP with a sufficient signal. A second client, already associated elsewhere, is roaming toward AP-Floor2. What does the controller do?",
    exhibit: String.raw`config wireless-controller wtp-profile
    edit "FAP431G-hd"
        set ap-handoff enable
        set handoff-rssi 25
    next
end`,
    options: [
      "AP-Floor2 ignores the new client so it joins the neighbouring AP; the roaming client is not refused, because load balancing is not applied to roaming clients",
      "AP-Floor2 refuses both clients until its client count drops",
      "AP-Floor2 accepts the new client and deauthenticates its oldest client",
      "Both clients are moved to the 5 GHz radio of AP-Floor2",
    ],
    answer: [0],
    explanation: "With AP handoff, an AP over its threshold does not answer a new client that has a sufficient signal (per `handoff-rssi`) at another AP, steering it to the less busy AP. Fortinet states that client load balancing is **not applied to roaming clients**, so the roaming client can join. AP handoff does not deauthenticate the oldest client and does not move clients between bands (that is frequency handoff).",
    lesson: '3.2-roaming-load-balancing',
  },
  {
    id: 'd3-036',
    topic: '3.2',
    type: 'order',
    difficulty: 3,
    stem: "A client roams from an FGT-HQ AP to an FGT-Branch AP with inter-controller L3 roaming enabled on the Guest SSID. Put the events in order.",
    items: [
      "The client associates to an FGT-HQ AP and receives an address from FGT-HQ's Corp subnet",
      "The client roams to an FGT-Branch AP broadcasting the same SSID with the same security",
      "FGT-Branch carries the client's traffic back to FGT-HQ through the inter-controller mobility tunnel, and the client keeps its address",
      "The client stays idle longer than client-idle-rehome-timeout",
      "The client rehomes: it obtains a DHCP address on FGT-Branch's subnet and its traffic is handled locally",
    ],
    explanation: "L3 roaming preserves the home IP while the client is active by tunnelling between controllers. The rehome happens only after the client is idle longer than `client-idle-rehome-timeout` (default 20 s); then it takes a local address on the new controller's subnet.",
    lesson: '3.2-roaming-load-balancing',
  },
  {
    id: 'd3-037',
    topic: '3.2',
    type: 'fill',
    difficulty: 2,
    stem: "In a FortiAP profile, `handoff-rssi` accepts values from 20 to 30. What is its default value?",
    answer: ['25'],
    explanation: "`handoff-rssi` defaults to 25 (range 20–30, a relative RSSI scale where higher is stronger). It is the minimum signal a client needs on the alternative band or AP before frequency or AP handoff steers it.",
    lesson: '3.2-roaming-load-balancing',
  },
  {
    id: 'd3-038',
    topic: '3.3',
    type: 'single',
    difficulty: 3,
    stem: "Refer to the exhibit. FortiAIOps fails to discover FGT-HQ. HTTPS to FGT-HQ works from a browser, and the credentials are correct. What is the most likely cause?",
    exhibit: String.raw`FortiAIOps > Inventory > Managed FortiGates > Add
  Type:            Standalone
  IP/FQDN:         fgt-hq.training.lab
  Username:        aiops-admin
  ADOM:            HQ
  HTTPS port:      443
  Timeout (ms):    5000

FortiGate HTTPS certificate (FGT-HQ):
  Issuer:                    CN=Training Lab Issuing CA
  Subject Alternative Name:  IP Address=10.0.1.1`,
    options: [
      "The FQDN entered in FortiAIOps is not in the certificate's Subject Alternative Name",
      "The HTTPS port must be 8443 for FortiAIOps connections",
      "FortiAIOps can add FortiGates only by IP address, never by FQDN",
      "The timeout must be raised above 30000 ms for the first discovery",
    ],
    answer: [0],
    explanation: "The address configured in FortiAIOps must match the FortiGate certificate's **SAN**: FQDN in FortiAIOps → FQDN in the SAN (or include both). Here the SAN has only the IP. Also make sure the issuing CA is installed in FortiAIOps. 443 is the default HTTPS port, adding by FQDN is supported, and the default 5000 ms timeout is not the issue when the certificate check fails.",
    lesson: '3.3-fortiaiops',
  },
  {
    id: 'd3-039',
    topic: '3.3',
    type: 'multi',
    difficulty: 2,
    stem: "Which two actions are part of connecting a FortiGate wireless controller to FortiAIOps so it can be monitored? (Choose two.)",
    options: [
      "Add the FortiGate in FortiAIOps with an administrator account over HTTPS",
      "Forward FortiGate logs to FortiAIOps, directly through syslog or through FortiAnalyzer",
      "Point each FortiAP's AC_IPADDR_1 at FortiAIOps so it joins over CAPWAP",
      "Register every FortiAP on FortiEdge Cloud",
      "Enable SNMPv3 traps on the FortiGate toward FortiAIOps",
    ],
    answer: [0, 1],
    explanation: "FortiAIOps polls FortiGate controllers over HTTPS (Inventory > Managed FortiGates > Add, admin credentials, default port 443) and needs FortiGate logs forwarded (`config log syslogd setting` or FortiAnalyzer log forwarding). FortiAPs stay managed by the FortiGate over CAPWAP; FortiAIOps is not a CAPWAP controller. FortiEdge Cloud manages standalone APs and is unrelated. SNMP is not the documented FortiAIOps data path.",
    lesson: '3.3-fortiaiops',
  },
  {
    id: 'd3-040',
    topic: '3.3',
    type: 'single',
    difficulty: 3,
    stem: "Refer to the exhibit. FGT-HQ runs FortiOS 7.6.5 and its FortiAPs run 7.6.3. What can FortiAIOps do for radio 2 of APs using this profile?",
    exhibit: String.raw`config wireless-controller wtp-profile
    edit "FAP431G-hd"
        config radio-2
            set band 802.11ax-5G
            set darrp disable
            set ai-darrp-support enable
        end
    next
end`,
    options: [
      "Collect channel telemetry through REST GET calls, but not change the radio's channel",
      "Push channel changes through REST POST calls, because ai-darrp-support is enabled",
      "Nothing, because ai-darrp-support only works on radio 1",
      "Run local DARRP on the FortiAP with FortiAIOps scores",
    ],
    answer: [0],
    explanation: "With `darrp disable` and `ai-darrp-support enable`, local DARRP is inactive and FortiAIOps only **collects** data with GET calls; it cannot make changes. With **both** enabled, the FortiAIOps engine takes control and triggers channel changes with POST calls, which Fortinet recommends. The setting is per radio, not limited to radio 1.",
    lesson: '3.3-fortiaiops',
  },
  {
    id: 'd3-041',
    topic: '3.3',
    type: 'fill',
    difficulty: 2,
    stem: "Besides `set darrp enable`, which radio setting in the FortiAP profile must be enabled for FortiAIOps AI-ARRP to control channels? (Keyword only.)",
    answer: ['ai-darrp-support', 'set ai-darrp-support enable', 'set ai-darrp-support'],
    explanation: "`set ai-darrp-support enable` under `config radio-N` (default disable). FortiAIOps 3.2 documents AI-ARRP as supported only on FortiOS 7.6.5 with FortiAP 7.6.3, and the keyword does not appear in the 7.6.3 CLI Reference.",
    lesson: '3.3-fortiaiops',
  },
  {
    id: 'd3-042',
    topic: '3.3',
    type: 'match',
    difficulty: 2,
    stem: "Match each FortiAIOps wireless SLA to an issue it reports.",
    pairs: [
      ['Coverage', 'Clients with low RSSI in coverage holes, or areas crowded with overlapping FortiAPs'],
      ['Time to Connect', 'Clients taking too long in the association, authentication, DHCP or DNS phase'],
      ['Connection Failure', 'Clients whose authentication fails because the RADIUS server is unreachable'],
      ['AP Health and Uptime', 'A FortiAP above its CPU, memory or temperature threshold, or rebooting'],
      ['Roaming', 'Clients whose transitions between APs take too long'],
    ],
    explanation: "Coverage = holes and crowding; Time to Connect = slow phases; Connection Failure = failed connections by stage (association, authentication, DHCP, DNS); AP Health and Uptime = AP resources and events; Roaming = slow roams with causes and suggested fixes. Throughput and WIDS are the other two wireless SLAs.",
    lesson: '3.3-fortiaiops',
  },
  {
    id: 'd3-043',
    topic: '3.3',
    type: 'single',
    difficulty: 2,
    stem: "FortiAIOps keeps reporting a Throughput SLA issue for an old 802.11b scanner that the warehouse must keep using. What should the administrator do in FortiAIOps?",
    options: [
      "Acknowledge the alert for that sub-classifier, AP or SSID, so it stops notifying and stops affecting the SLA metrics",
      "Delete the FortiGate from Inventory and add it again",
      "Disable log forwarding from the FortiGate",
      "Set ai-darrp-support disable on the AP",
    ],
    answer: [0],
    explanation: "**Acknowledge** exists for reviewed, known issues: you scope it (sub-classifier, FortiGate, AP, SSID) and choose a duration or forever, and the alert no longer triggers notifications or counts against the devices' SLA metrics. Re-adding the FortiGate, stopping logs or disabling AI-ARRP would hide or break other data without addressing the known exception.",
    lesson: '3.3-fortiaiops',
  },
  {
    id: 'd3-044',
    topic: '3.3',
    type: 'order',
    difficulty: 3,
    stem: "Put the FortiAIOps AI-ARRP workflow in order.",
    items: [
      "Collect RF statistics for every channel on each AP radio every minute",
      "Aggregate hourly and generate a daily channel-health forecast per radio using up to two weeks of history",
      "During the FortiGate's DARRP schedule window, validate candidate channels against the profile, regulatory rules, bonding and SLA or radar failures",
      "Push the recommended channels to the FortiGate",
      "FortiAPs apply the new channels in their next channel-planning cycle",
    ],
    explanation: "AI-ARRP collects per minute, analyses hourly with a daily forecast, validates during the DARRP schedule, then pushes to FortiGate; the FortiAPs pick the channels up in their next planning cycle.",
    lesson: '3.3-fortiaiops',
  },
  {
    id: 'd3-045',
    topic: '3.3',
    type: 'single',
    difficulty: 2,
    stem: "According to the FortiAIOps 3.2 User Guide, which software combination supports AI-ARRP?",
    options: [
      "FortiOS 7.6.5 with FortiAP 7.6.3",
      "Any FortiOS 7.6 build with any FortiAP 7.6 build",
      "FortiOS 7.4.0 or later with FortiAP 7.4.0 or later",
      "FortiOS 7.6.0 with FortiAP 7.6.0",
    ],
    answer: [0],
    explanation: "The guide states AI-ARRP is only supported on **FortiOS 7.6.5 and FortiAP 7.6.3**. That matches the `ai-darrp-support` keyword being absent from the FortiOS 7.6.3 CLI Reference.",
    lesson: '3.3-fortiaiops',
  },
  {
    id: 'd3-046',
    topic: '3.3',
    type: 'single',
    difficulty: 2,
    stem: "Refer to the exhibit. FortiAIOps (10.0.1.60) shows FGT-HQ as discovered with its FortiAPs, but its event-driven views such as Connection Failure stay empty. FGT-HQ does not log to FortiAnalyzer. What should the administrator do?",
    exhibit: String.raw`FGT-HQ # show full-configuration log syslogd setting | grep -e status -e server
    set status disable
    set server ''`,
    options: [
      "Enable syslogd on FGT-HQ with server 10.0.1.60 so its logs are forwarded to FortiAIOps",
      "Re-add FGT-HQ in FortiAIOps using HTTP instead of HTTPS",
      "Enable SNMP on every FortiAP profile",
      "Change the FortiAIOps ADOM to root",
    ],
    answer: [0],
    explanation: "Discovery (REST over HTTPS) is working, but FortiAIOps also needs the FortiGate's logs. Without FortiAnalyzer, forward them directly: `config log syslogd setting` → `set status enable`, `set server 10.0.1.60`. HTTP is not the documented method, SNMP is not the FortiAIOps data path, and the ADOM only groups controllers.",
    lesson: '3.3-fortiaiops',
  },
  {
    id: 'd3-047',
    topic: '3.3',
    type: 'multi',
    difficulty: 2,
    stem: "Which two are wireless SLAs monitored by FortiAIOps? (Choose two.)",
    options: [
      "Time to Connect",
      "WIDS",
      "Switch Connection Failure",
      "Interface Health",
      "FortiExtender Health",
    ],
    answer: [0, 1],
    explanation: "The wireless SLAs are Throughput, Coverage, Roaming, Time to Connect, Connection Failure, AP Health and Uptime, and WIDS. Switch Connection Failure is a switching SLA; Interface Health and FortiExtender Health are WAN SLAs.",
    lesson: '3.3-fortiaiops',
  },
  {
    id: 'd3-048',
    topic: '3.3',
    type: 'single',
    difficulty: 2,
    stem: "In FortiAIOps SLA Config, the Roaming SLA lets you set static thresholds separately for which roam types?",
    options: [
      "Fast BSS Transition (11r) roams, PMK cache roams and OKC roams",
      "Layer 2 roams, layer 3 roams and rehome events",
      "2.4 GHz roams, 5 GHz roams and 6 GHz roams",
      "Tunnel-mode roams, bridge-mode roams and mesh roams",
    ],
    answer: [0],
    explanation: "Static roaming thresholds are per roam type: **11r** (default 55 ms), **PMK cache** (default 100 ms) and **OKC** (default 100 ms). Alternatively FortiAIOps computes dynamic baselines with a scope of ADOM, FortiGate, AP or SSID. The 11r threshold only applies when the SSID has `fast-bss-transition` enabled and the clients support it.",
    lesson: '3.3-fortiaiops',
  },
];
