// Domain 4 — Wireless diagnostics and analytics question bank (original, exam-style).
// FortiOS 7.6 / FortiAP 7.6. Exhibit output follows the field layout of the FortiAP 7.6.0 guide and
// FortiOS 7.6.0 Administration Guide samples (wlac -c vap / -c darrp / -d sta / -c stats, CAPWAP and
// sta_filter debugs, extended wireless logs, sniffer, cw_diag -c acs, plain-ctl and sniff output).
export default [
  {
    id: 'd4-001',
    topic: '4.1',
    type: 'single',
    difficulty: 2,
    stem: "Refer to the exhibit. A user reports being connected to BSSID 06:d5:90:12:30:a8. What does the output tell you about that BSSID?",
    exhibit: String.raw`FGT-HQ # diagnose wireless-controller wlac -c vap
bssid             ssid  intf       vfid:ip-port              rId wId
04:d5:90:12:30:a8 Corp  corp-wlan  ws (0-10.10.10.21:5246)   0   0
04:d5:90:12:30:b8 Corp  corp-wlan  ws (0-10.10.10.21:5246)   1   0
06:d5:90:12:30:a8 Guest guest-wlan ws (0-10.10.10.21:5246)   0   1
04:d5:90:44:10:c8 Corp  corp-wlan  ws (0-10.10.10.22:5246)   0   0`,
    options: [
      "It is the Guest SSID (interface guest-wlan) on radio ID 0, WLAN ID 1, of the FortiAP at 10.10.10.21",
      "It is the Corp SSID on the FortiAP at 10.10.10.22",
      "It is a rogue AP, because its first octet differs from the other BSSIDs",
      "It is the Guest SSID tunnelled to UDP port 5246 on the client",
    ],
    answer: [0],
    explanation: "Each `-c vap` row is one BSSID: SSID, FortiGate VAP interface, `vdom-AP IP:CAPWAP port`, radio ID and WLAN ID. 06:d5:90:12:30:a8 is Guest/guest-wlan on 10.10.10.21, rId 0, wId 1 (the second SSID on that radio). Additional BSSIDs on a radio commonly use a locally administered variant of the radio MAC, so a different first octet is normal, and rogue APs are not listed by `-c vap`. Port 5246 is the AP's CAPWAP control port, not a client port.",
    lesson: '4.1-controller-diagnostics',
  },
  {
    id: 'd4-002',
    topic: '4.1',
    type: 'single',
    difficulty: 3,
    stem: "Refer to the exhibit. DARRP is enabled on radio 1 of both APs. AP-Lobby (FP231FTF20000001) stays on channel 6 even though a busy neighbour network also uses channel 6. What is the most likely reason?",
    exhibit: String.raw`FGT-HQ # diagnose wireless-controller wlac -c darrp
wtp_id           rId base_mac          index nr_chan vfid 5G  oper_chan age
FP231FTF20000001 0   04:d5:90:12:30:a8 0     1       0    No  6         86400
FP431GTF20000002 0   04:d5:90:44:10:c8 1     3       0    No  11        3600`,
    options: [
      "DARRP has only one candidate channel for that radio, so the FortiAP profile probably allows only channel 6",
      "DARRP works only on 5 GHz radios",
      "An age of 86400 means DARRP is disabled on that radio",
      "DARRP never changes a channel after its first selection",
    ],
    answer: [0],
    explanation: "`nr_chan` is the number of channels DARRP can choose from. AP-Lobby has 1, so the radio's channel list (in the FortiAP profile or AP override) leaves DARRP no alternative. AP-Floor2 has 3 candidates. DARRP works on 2.4 GHz radios too (5G = No here), the age is just how long ago the decision was made, and DARRP keeps monitoring Tx retries and Rx errors and runs again on its optimisation schedule.",
    lesson: '4.1-controller-diagnostics',
  },
  {
    id: 'd4-003',
    topic: '4.1',
    type: 'single',
    difficulty: 2,
    stem: "Refer to the exhibit. Which statement about this client is correct?",
    exhibit: String.raw`FGT-HQ # diagnose wireless-controller wlac -d sta online
   vf=0 wtp=4 rId=2 wlan=corp-wlan vlan_id=0 ip=10.20.10.77 ip6=:: mac=02:1a:2b:3c:4d:5e vci= host=LAPTOP-221 user= group= signal=-71 noise=-95 idle=2 bw=1 use=6 chan=100 radio_type=11AC(wave2) security=wpa2_only_personal mpsk= encrypt=aes cp_authed=no l3r=1,0 0.0.0.0:0 -- 0.0.0.0:0 0,0 online=yes mimo=2`,
    options: [
      "Its signal-to-noise ratio is 24 dB, and it uses channel 100 with two spatial streams",
      "Its signal-to-noise ratio is -166 dB, which is why its health is Poor",
      "Its signal of -71 dBm rates as Good in the FortiOS client health assessment",
      "It has been idle for 100 seconds and will be disconnected",
    ],
    answer: [0],
    explanation: "SNR is signal minus noise: -71 - (-95) = **24 dB**. `chan=100` is the channel and `mimo=2` the number of spatial streams. SNR is never computed by adding the two negative numbers. FortiOS rates -71 dBm as Fair (between -56 and -75 dBm). `idle=2` is two seconds; 100 is the channel.",
    lesson: '4.1-client-rf-fortiap-cli',
  },
  {
    id: 'd4-004',
    topic: '4.1',
    type: 'fill',
    difficulty: 2,
    stem: "Which diagnose command lists the currently online wireless clients with their IP, VLAN, signal, noise, channel and security, from the controller's data plane? (Enter the full command.)",
    answer: ['diagnose wireless-controller wlac -d sta online', 'diag wireless-controller wlac -d sta online', 'diagnose wireless-controller wlac -d sta'],
    explanation: "`diagnose wireless-controller wlac -d sta online` (the plain `-d sta` form also lists station records). `-d` selects data-plane tables; `-c` selects control-plane objects such as vap, wtp, darrp and ap-rogue.",
    lesson: '4.1-controller-diagnostics',
  },
  {
    id: 'd4-005',
    topic: '4.1',
    type: 'multi',
    difficulty: 2,
    stem: "Which two commands display wireless controller data-plane tables? (Choose two.)",
    options: [
      "diagnose wireless-controller wlac -d sta",
      "diagnose wireless-controller wlac -d vap",
      "diagnose wireless-controller wlac -c vap",
      "diagnose wireless-controller wlac -c darrp",
      "diagnose wireless-controller wlac -c ap-rogue",
    ],
    answer: [0, 1],
    explanation: "The FortiOS CLI Reference describes `wlac <-c|-d|-k|-h>` as control plane, data plane or help. `-d sta`, `-d vap` and `-d wtp` read data-plane information (extended when `ext-info-enable` is on in the FortiAP profile). `-c vap`, `-c darrp` and `-c ap-rogue` are control-plane views kept by `cw_acd`.",
    lesson: '4.1-controller-diagnostics',
  },
  {
    id: 'd4-006',
    topic: '4.1',
    type: 'single',
    difficulty: 1,
    stem: "What is the impact of running `execute wireless-controller restart-acd` on a FortiGate managing 40 FortiAPs?",
    options: [
      "Only FortiAPs in the default FortiAP group reboot",
      "The wireless controller daemon restarts and every managed FortiAP disconnects and rejoins",
      "The FortiGate reboots",
      "Clients are moved to other APs without interruption",
    ],
    answer: [1],
    explanation: "`restart-acd` restarts `cw_acd`, which holds every CAPWAP session, so all APs (and their clients) drop and rejoin. To reboot specific APs, use `execute wireless-controller reset-wtp <SN|wtp-group>`. The FortiGate itself does not reboot.",
    lesson: '4.1-controller-diagnostics',
  },
  {
    id: 'd4-007',
    topic: '4.1',
    type: 'fill',
    difficulty: 1,
    stem: "Which command lists all wireless controller (`wlac`) debug options available on the running FortiOS build? (Enter the full command.)",
    answer: ['diagnose wireless-controller wlac help', 'diag wireless-controller wlac help', 'diagnose wireless-controller wlac -h'],
    explanation: "`diagnose wireless-controller wlac help` prints the options supported by your build. Sub-options change between releases, so run it before relying on a remembered keyword.",
    lesson: '4.1-controller-diagnostics',
  },
  {
    id: 'd4-008',
    topic: '4.1',
    type: 'match',
    difficulty: 2,
    stem: "Match each `diagnose wireless-controller wlac` option to what it shows.",
    pairs: [
      ['-c vap', 'BSSID, SSID, interface, AP IP and port, radio ID and WLAN ID'],
      ['-c darrp', 'Candidate channel count and operating channel per DARRP radio'],
      ['-c stats', 'Object counts and memory use of controller tables such as rogue APs'],
      ['-c ha', 'Fast-failover and L3-roaming peer controller status'],
      ['-c sta-qtn', 'Stations currently in quarantine'],
    ],
    explanation: "These are all control-plane views from `cw_acd`. `-c stats` is the one to check when rogue or station-capability tables consume memory; `-c ha` lists inter-controller peers with their state.",
    lesson: '4.1-controller-diagnostics',
  },
  {
    id: 'd4-009',
    topic: '4.1',
    type: 'single',
    difficulty: 2,
    stem: "Refer to the exhibit. Radio 2 of FP431GTF20000002 is in Dedicated Monitor mode. What does the command do?",
    exhibit: String.raw`FGT-HQ # execute wireless-controller spectral-scan FP431GTF20000002 2 on 60 36 1000`,
    options: [
      "Starts spectrum analysis on radio 2 of that AP, on channel 36, with a duration of 60 and a report interval of 1000",
      "Starts a background rogue AP scan of channels 2 to 36",
      "Stops spectrum analysis that was running for 60 seconds",
      "Moves radio 2 to channel 36 for 1000 seconds",
    ],
    answer: [0],
    explanation: "Syntax: `execute wireless-controller spectral-scan <wtp-id> <radio-id> <mode> <duration> <channel> <report-interval>`. View the results with `diagnose wireless-controller wlac -c rf-sa FP431GTF20000002 2 36` or `get wireless-controller spectral-info FP431GTF20000002 2`, and stop with `... 2 off`. It is not a rogue scan and does not change the operating channel.",
    lesson: '4.1-controller-diagnostics',
  },
  {
    id: 'd4-010',
    topic: '4.1',
    type: 'single',
    difficulty: 2,
    stem: "A FortiAP at a home office sits behind the user's NAT router, so the administrator cannot SSH to it. The administrator needs the output of a shell command on that AP. What should the administrator use?",
    options: [
      "diagnose wireless-controller wlac wtpcmd, which sends the command through the CAPWAP tunnel and returns the result",
      "execute ssh to the router's public IP on port 5246",
      "execute wireless-controller reset-wtp, then read the boot log",
      "The FortiAP REST API on the controller's IP address",
    ],
    answer: [0],
    explanation: "`diagnose wireless-controller wlac wtpcmd <wtp_ip> <wtp_port> run|show|... [command]` sends a shell command (up to 127 bytes) to the AP over CAPWAP and shows what the AP reports back, which is exactly for APs behind NAT. Port 5246 is CAPWAP, not SSH. Rebooting does not run your command, and the FortiAP REST API lives on the AP's own address, which is unreachable here.",
    lesson: '4.1-controller-diagnostics',
  },
  {
    id: 'd4-011',
    topic: '4.1',
    type: 'single',
    difficulty: 2,
    stem: "Refer to the exhibit. Which client has the best signal-to-noise ratio?",
    exhibit: String.raw`Client  Signal (dBm)  Noise (dBm)
A       -55           -70
B       -64           -95
C       -48           -62
D       -70           -92`,
    options: [
      "A",
      "B",
      "C",
      "D",
    ],
    answer: [1],
    explanation: "SNR = signal - noise: A 15 dB, **B 31 dB**, C 14 dB, D 22 dB. C has the strongest signal but sits on a noisy channel, which is why signal strength alone is not a quality measure.",
    lesson: '4.1-client-rf-fortiap-cli',
  },
  {
    id: 'd4-012',
    topic: '4.1',
    type: 'single',
    difficulty: 2,
    stem: "A client's received signal drops from -55 dBm to -65 dBm as the user walks away from the AP. How has the received power changed?",
    options: [
      "It is one tenth of what it was",
      "It is half of what it was",
      "It is 10 milliwatts lower",
      "It is about 18% lower, because 10 is about 18% of 55",
    ],
    answer: [0],
    explanation: "Decibels are logarithmic: every 10 dB is a factor of 10 and every 3 dB roughly a factor of 2. A 10 dB drop leaves one tenth of the power. dBm values cannot be subtracted as milliwatts or treated as percentages.",
    lesson: '4.1-client-rf-fortiap-cli',
  },
  {
    id: 'd4-013',
    topic: '4.1',
    type: 'fill',
    difficulty: 1,
    stem: "On the FortiAP CLI, which command saves variables changed with `cfg -a` to flash so they survive a reboot?",
    answer: ['cfg -c'],
    explanation: "`cfg -c` commits to flash. `cfg -s` shows variables, `cfg -a VAR=value` changes one, `cfg -r` removes one, `cfg -x` resets to factory defaults.",
    lesson: '4.1-client-rf-fortiap-cli',
  },
  {
    id: 'd4-014',
    topic: '4.1',
    type: 'single',
    difficulty: 2,
    stem: "Refer to the exhibit. After the reboot, the FortiAP is back to automatic discovery and has no AC_IPADDR_1. Why?",
    exhibit: String.raw`FortiAP-231F # cfg -a AC_DISCOVERY_TYPE=1
FortiAP-231F # cfg -a AC_IPADDR_1=10.10.10.1
FortiAP-231F # reboot`,
    options: [
      "The changes were never committed to flash with cfg -c",
      "AC_DISCOVERY_TYPE=1 is DHCP, which clears static addresses",
      "AC_IPADDR_1 accepts only host names",
      "The controller overwrote the variables during the join",
    ],
    answer: [0],
    explanation: "`cfg -a` changes the running value; only `cfg -c` writes it to flash. Type 1 is static discovery (2 is DHCP), `AC_IPADDR_1..3` take IP addresses (`AC_HOSTNAME_1..3` take names), and the AP never joined anything because it rebooted before using the setting.",
    lesson: '4.1-client-rf-fortiap-cli',
  },
  {
    id: 'd4-015',
    topic: '4.1',
    type: 'match',
    difficulty: 2,
    stem: "Match each FortiAP `cw_diag` command to what it shows.",
    pairs: [
      ['cw_diag -c wtp-cfg', 'AP configuration received from the controller'],
      ['cw_diag -c vap-cfg', 'SSIDs (VAPs) currently in the control plane'],
      ['cw_diag -c radio-cfg', 'Current radio parameters'],
      ['cw_diag -c ap-scan', 'APs this FortiAP has scanned'],
      ['cw_diag -c sta-scan', 'Stations this FortiAP has scanned'],
      ['cw_diag -c ap-suppress', 'APs this FortiAP is suppressing'],
    ],
    explanation: "The `-cfg` commands show what the controller pushed (handy when the AP behaves differently from the profile you think you applied). The scan commands show the raw data behind rogue and station monitoring; `ap-suppress` confirms suppression is active.",
    lesson: '4.1-client-rf-fortiap-cli',
  },
  {
    id: 'd4-016',
    topic: '4.1',
    type: 'multi',
    difficulty: 2,
    stem: "Which two methods give an administrator a CLI session on a managed FortiAP? (Choose two.)",
    options: [
      "In Managed FortiAPs, right-click the AP and select Connect to CLI",
      "SSH to the AP's IP after enabling override-allowaccess and allowaccess ssh for that AP on the controller",
      "Telnet to the FortiGate on UDP port 5246",
      "Run execute wireless-controller led-blink with the AP's ID",
      "Browse to the FortiAIOps GUI and open the AP's CLI tab",
    ],
    answer: [0, 1],
    explanation: "**Connect to CLI** opens the AP's console through the FortiGate GUI (no password by default). SSH works once the AP allows it: `config wireless-controller wtp` → `edit <SN>` → `set override-allowaccess enable` → `set allowaccess ssh` (or set it in the profile). UDP 5246 is CAPWAP control, `led-blink` blinks the LED, and FortiAIOps is a monitoring platform, not a path to the AP shell.",
    lesson: '4.1-client-rf-fortiap-cli',
  },
  {
    id: 'd4-017',
    topic: '4.1',
    type: 'single',
    difficulty: 3,
    stem: "Refer to the exhibit. FGT-HQ's memory use keeps rising at a site surrounded by many neighbour networks. What should the administrator configure?",
    exhibit: String.raw`FGT-HQ # diagnose wireless-controller wlac -c stats
cw_rbtts_sta_cap_tree                   : cnt=1024       mem=(     248B,       0MB) tmo=0      max_cnt=524416,524416
cw_sta_cap_wtp_tree                     : cnt=1532       mem=(     296B,       0MB)
cw_rbtts_ap_rogue_tree                  : cnt=61240      mem=(     560B,      32MB) tmo=0      max_cnt=65664,65664
cw_ap_rogue_wtp_tree                    : cnt=402118     mem=(     408B,     156MB)
cw_rbtts_sta_rogue_tree                 : cnt=310        mem=(     232B,       0MB) tmo=0      max_cnt=528384,528384
cw_ble_dev_tree                         : cnt=0          mem=(     232B,       0MB) tmo=60     max_cnt=131200,131200`,
    options: [
      "Limit stored rogue AP data with max-rogue-ap and max-rogue-ap-wtp under config wireless-controller global, and set rogue-ap-cleanup under config wireless-controller timers",
      "Disable DARRP on every radio",
      "Increase discovery-interval to 180 seconds",
      "Set max-ble-device 10, because BLE entries are using the memory",
    ],
    answer: [0],
    explanation: "The rogue AP tables dominate: 61,240 rogue APs and over 400,000 per-AP sighting records using about 188 MB, with no cleanup timer (`tmo=0`). `max-rogue-ap` / `max-rogue-ap-wtp` cap what is stored and `rogue-ap-cleanup` (minutes) removes APs that are gone (default 0, keep forever). BLE has zero entries, and DARRP or the discovery interval do not affect these tables.",
    lesson: '4.1-controller-diagnostics',
  },
  {
    id: 'd4-018',
    topic: '4.1',
    type: 'single',
    difficulty: 2,
    stem: "An 802.11ac laptop shows a link rate of 866.7 Mbps, but iPerf to a wired server measures about 310 Mbps. What is the correct conclusion?",
    options: [
      "This is expected: the link rate is the PHY rate, and real throughput is much lower because of contention, acknowledgements, retries and protocol overhead",
      "The AP is faulty, because throughput should match the link rate within 5%",
      "The client must be using TKIP, which halves throughput",
      "The CAPWAP data channel must be using DTLS, which always costs 60% of throughput",
    ],
    answer: [0],
    explanation: "866.7 Mbps is the 802.11ac PHY rate for 2 spatial streams, 80 MHz, MCS 9 with short guard interval. Application throughput is always well below the PHY rate. TKIP would cap an 802.11n/ac client at legacy rates (at most 54 Mbps), far below 310 Mbps. DTLS adds processing overhead, but no fixed 60% figure exists.",
    lesson: '4.1-client-rf-fortiap-cli',
  },
  {
    id: 'd4-019',
    topic: '4.2',
    type: 'single',
    difficulty: 2,
    stem: "Refer to the exhibit. A new FortiAP at 10.10.10.23 never appears in Managed FortiAPs. What should the administrator do?",
    exhibit: String.raw`FGT-HQ # diagnose sniffer packet port5 "port 5246" 4
interfaces=[port5]
filters=[port 5246]
3.201188 port5 in 10.10.10.23.5246 -> 10.10.10.1.5246: udp 120
8.201420 port5 in 10.10.10.23.5246 -> 10.10.10.1.5246: udp 120
13.201733 port5 in 10.10.10.23.5246 -> 10.10.10.1.5246: udp 120

FGT-HQ # show system interface port5
config system interface
    edit "port5"
        set vdom "root"
        set ip 10.10.10.1 255.255.255.0
        set allowaccess ping https ssh
        set type physical
    next
end`,
    options: [
      "Add fabric (Security Fabric Connection) to allowaccess on port5",
      "Configure DHCP option 138 on port5",
      "Authorise the AP in Managed FortiAPs",
      "Change the AP's AC_CTL_PORT to 5247",
    ],
    answer: [0],
    explanation: "The AP is already sending discovery requests to 10.10.10.1:5246 every 5 seconds (the default `discovery-interval`), but the FortiGate never answers. Security Fabric Connection access (`allowaccess fabric`) is what enables CAPWAP on an interface, and it is missing. Option 138 would only help the AP find the controller, which it already has. There is nothing to authorise because the AP never appears. 5247 is the data channel, not the control port.",
    lesson: '4.2-ap-join-troubleshooting',
  },
  {
    id: 'd4-020',
    topic: '4.2',
    type: 'single',
    difficulty: 3,
    stem: "Refer to the exhibit. The AP joins and receives its configuration but never reaches the RUN state. What is the most likely cause?",
    exhibit: String.raw`<msg> JOIN_REQ (14) <== ws (0-10.10.10.22:5246)
<fsm> old CWAS_JOIN(7) ev CWAE_JOIN_REQ_RECV(12) new CWAS_JOIN(7)
<msg> CFG_STATUS (15) <== ws (0-10.10.10.22:5246)
<fsm> old CWAS_JOIN(7) ev CWAE_CFG_STATUS_REQ(13) new CWAS_CONFIG(8)
<msg> CHG_STATE_EVENT_REQ (16) <== ws (0-10.10.10.22:5246)
<fsm> old CWAS_CONFIG(8) ev CWAE_CHG_STATE_EVENT_REQ_RECV(23) new CWAS_DATA_CHAN_SETUP(10)
(no further state changes for this AP)

FortiAP profile FAP431G-hd:   set dtls-policy dtls-enabled
FortiAP FP431GTF20000002:     AC_DATA_CHAN_SEC=clear`,
    options: [
      "The data channel security on the FortiGate profile and the FortiAP do not match",
      "The AP is not authorised",
      "The DTLS control channel failed to establish",
      "port5 is missing allowaccess fabric",
    ],
    answer: [0],
    explanation: "The trace passes DTLS, join and configuration, then stops in `CWAS_DATA_CHAN_SETUP`. The profile requires a DTLS data channel while the AP is set to accept only clear text: FortiGate and FortiAP data channel settings must agree. The control-channel DTLS and the CAPWAP interface access already worked (otherwise there would be no JOIN_REQ), and the controller is exchanging configuration-stage messages with the AP; the exhibit shows a direct mismatch in the data channel settings, which is exactly the stage that never completes.",
    lesson: '4.2-ap-join-troubleshooting',
  },
  {
    id: 'd4-021',
    topic: '4.2',
    type: 'order',
    difficulty: 2,
    stem: "Put the CAPWAP states of a successful FortiAP join, as shown by the cw_acd debug, in order.",
    items: [
      "Discovery request and response",
      "CWAS_DTLS_SETUP",
      "CWAS_JOIN",
      "CWAS_CONFIG",
      "CWAS_DATA_CHAN_SETUP",
      "CWAS_DATA_CHECK",
      "CWAS_RUN",
    ],
    explanation: "Discovery, DTLS on the control channel (setup, authorise, connect), join, configuration, data channel setup and verification, then RUN, where echo requests keep the session alive.",
    lesson: '4.2-ap-join-troubleshooting',
  },
  {
    id: 'd4-022',
    topic: '4.2',
    type: 'single',
    difficulty: 2,
    stem: "Refer to the exhibit. AP-Branch3 cannot find FGT-HQ. Which change lets it discover the controller?",
    exhibit: String.raw`AP-Branch3 (FortiAP-231F)   IP 10.30.5.20/24 (DHCP from branch router, no option 138)
FGT-HQ controller           10.10.10.1 on port5, allowaccess includes fabric
Path                        Routed site-to-site VPN; unicast works both ways; no multicast routing
DNS                         No fortinet-capwap-controller record
AP setting                  AC_DISCOVERY_TYPE=0`,
    options: [
      "On the AP: cfg -a AC_IPADDR_1=10.10.10.1, then cfg -c",
      "On FGT-HQ: change discovery-mc-addr to the branch subnet's broadcast address",
      "On the AP: set AC_DISCOVERY_TYPE to broadcast",
      "On FGT-HQ: enable ap-discover on port5",
    ],
    answer: [0],
    explanation: "With automatic discovery the AP tries static, DHCP, DNS, FortiManagement Cloud, multicast and broadcast. Across a routed VPN with no option 138, no DNS record and no multicast routing, only unicast methods can work, so a static controller address (committed with `cfg -c`) solves it; option 138 on the branch DHCP server would also work. Broadcast never crosses a router, `discovery-mc-addr` is a multicast group address, and `ap-discover` (default enable) only creates entries for APs that do reach the controller.",
    lesson: '4.2-ap-join-troubleshooting',
  },
  {
    id: 'd4-023',
    topic: '4.2',
    type: 'fill',
    difficulty: 2,
    stem: "A DHCP server must hand FortiAPs the controller address 10.10.10.1 in option 138. Enter the value in the hexadecimal format FortiAP expects (8 hex digits).",
    answer: ['0A0A0A01', '0x0A0A0A01'],
    explanation: "Each octet becomes two hex digits: 10 = 0A, 10 = 0A, 10 = 0A, 1 = 01 → `0A0A0A01`. The option code itself can be changed on the AP with `AC_DISCOVERY_DHCP_OPTION_CODE` (default 138).",
    lesson: '4.2-ap-join-troubleshooting',
  },
  {
    id: 'd4-024',
    topic: '4.2',
    type: 'single',
    difficulty: 3,
    stem: "Refer to the exhibit. A teleworker's FortiAP sits behind a home router whose UDP sessions time out after 20 seconds of inactivity. The AP disconnects from FGT-HQ several times an hour. What should the administrator configure?",
    exhibit: String.raw`FortiAP-231F # cw_diag -c acs
WTP Configuration
    name                 : FortiAP-231F
    loc                  : N/A
    ap mode              : thin AP
    led state            : enable
    allowaccess          :
    lldp enable          : enable
    extension info enable: enable
    radio cnt            : 3
    sta info             : 1/0
    echo-interval        : 30
    nat-sess-keep-alive  : 0
    keep-alive-interval  : 30
...`,
    options: [
      "config wireless-controller timers, set nat-session-keep-alive to a value below 20 seconds",
      "config wireless-controller timers, set discovery-interval 180",
      "Change the data channel to IPsec so the router keeps the session open",
      "Set AC_DISCOVERY_TYPE=7 so the AP uses FortiManagement Cloud",
    ],
    answer: [0],
    explanation: "CAPWAP echo requests run every 30 s, longer than the router's 20 s UDP timeout, so the NAT mapping expires between keep-alives. `nat-session-keep-alive` (default 0, off; range 0–255 s) makes the AP send extra keep-alive messages (Fortinet's example uses 10 s), and `cw_diag -c acs` then shows the new value. The discovery interval only affects discovery, and changing the data channel or discovery type does not fix NAT ageing.",
    lesson: '4.2-ap-join-troubleshooting',
  },
  {
    id: 'd4-025',
    topic: '4.2',
    type: 'single',
    difficulty: 2,
    stem: "All FortiAPs managed by FGT-HQ disconnect and reconnect at the same moment, several times a day. The network between the APs and FGT-HQ checks out. Which command helps confirm whether the wireless controller daemon is crashing?",
    options: [
      "diagnose debug crashlog read",
      "execute wireless-controller reset-wtp all",
      "diagnose wireless-controller wlac -c vap",
      "get system performance status",
    ],
    answer: [0],
    explanation: "When every AP drops at once the controller side is the suspect, and Fortinet's checklist says to check for wireless controller daemon crashes in the crash log with `diagnose debug crashlog read`. Rebooting all APs adds an outage without diagnosing anything, `-c vap` lists BSSIDs, and the performance status shows CPU and memory but not daemon crashes.",
    lesson: '4.2-ap-join-troubleshooting',
  },
  {
    id: 'd4-026',
    topic: '4.2',
    type: 'multi',
    difficulty: 2,
    stem: "A client associates to a local-bridge SSID and completes the 4-way handshake but never receives an IP address. Which two are likely causes? (Choose two.)",
    options: [
      "The DHCP scope for that VLAN has no free addresses",
      "The SSID's VLAN is not allowed on the switch port the FortiAP is connected to",
      "The client typed the wrong passphrase",
      "802.11r is disabled on the SSID",
      "The FortiAP's CAPWAP control channel uses DTLS",
    ],
    answer: [0, 1],
    explanation: "After a successful handshake the problem is above Wi-Fi: an exhausted DHCP scope, or a bridged SSID whose VLAN never reaches the DHCP server because the AP's switch port does not carry it. A wrong passphrase would stop the 4-way handshake at message 2/4. 802.11r only affects roaming, and the control channel is always DTLS.",
    lesson: '4.2-client-rf-troubleshooting',
  },
  {
    id: 'd4-027',
    topic: '4.2',
    type: 'single',
    difficulty: 3,
    stem: "Refer to the exhibit. A handheld scanner shows a strong signal from AP-Lobby but its sessions keep timing out. What is the most likely problem and the Fortinet-recommended fix?",
    exhibit: String.raw`FortiAP profile FAP231F-office, radio-1:   set power-mode dBm
                                           set power-value 23
Scanner Wi-Fi utility:   AP-Lobby BSSID heard at -60 dBm

FGT-HQ # diagnose wireless-controller wlac -d sta online | grep 02:5c:7e:31:00:19
   vf=0 wtp=2 rId=1 wlan=iot-wlan vlan_id=0 ip=10.20.30.41 ... mac=02:5c:7e:31:00:19 ... signal=-82 noise=-95 idle=0 ... chan=6 ... security=wpa2_only_personal ... online=yes mimo=1
(output trimmed)`,
    options: [
      "Asymmetric power: the AP transmits much louder than the scanner, so lower the AP's transmit power toward the clients' level",
      "Co-channel interference: enable WIDS on radio 1",
      "Wrong passphrase: the 4-way handshake is failing",
      "The noise floor is too high, so raise the AP's power to 30 dBm",
    ],
    answer: [0],
    explanation: "The scanner hears the AP at -60 dBm, but the AP hears the scanner at only -82 dBm (13 dB SNR). That is the asymmetric power problem: a 23 dBm AP and a low-power battery client. Fortinet recommends measuring both directions and matching AP power to the weakest clients (it quotes about 10 dBm for phones and 14 dBm for laptops), so clients see a realistic cell and roam to a closer AP. The client is online with an IP, so the passphrase is fine; the noise floor (-95 dBm) is quiet; raising AP power makes the asymmetry worse.",
    lesson: '4.2-client-rf-troubleshooting',
  },
  {
    id: 'd4-028',
    topic: '4.2',
    type: 'multi',
    difficulty: 2,
    stem: "Users near the break room on 2.4 GHz report a strong signal that periodically drops out. Which two actions does Fortinet recommend as first fixes for this kind of frequency interference? (Choose two.)",
    options: [
      "Change the radio's operating channel",
      "Move capable clients to the 5 GHz band",
      "Raise the AP's transmit power to the maximum",
      "Enable TKIP alongside AES for compatibility",
      "Disable protected management frames",
    ],
    answer: [0, 1],
    explanation: "A strong signal with periodic drops is the classic interference symptom (a microwave oven fits the location). Fortinet's simplest fixes are changing the operating channel (using 1, 6 or 11 in 2.4 GHz) and, where appropriate, using 5 GHz; spectrum analysis helps locate the source. More power does not remove interference, TKIP lowers throughput, and PMF has nothing to do with RF interference.",
    lesson: '4.2-client-rf-troubleshooting',
  },
  {
    id: 'd4-029',
    topic: '4.2',
    type: 'match',
    difficulty: 2,
    stem: "Match each wireless symptom to the first thing to investigate.",
    pairs: [
      ['Only one laptop model cannot connect; other clients are fine', 'Client driver or device interoperability'],
      ['A client connects, then drops and reconnects every few minutes while idle', 'Client sleep or power-saving settings'],
      ['A client associates and authenticates but has no IP address', 'DHCP server, scope or VLAN path'],
      ['Strong signal at the client, but connectivity drops periodically', 'Frequency interference on the channel'],
      ['The client sees the AP strongly, but the AP barely hears the client', 'Asymmetric transmit power'],
    ],
    explanation: "These follow Fortinet's client-issue and signal-strength troubleshooting guidance: interop and drivers when only one device type fails; sleep and power save for periodic idle drops; DHCP for no address; interference for strong-but-dropping signals; asymmetric power when uplink and downlink signal differ widely.",
    lesson: '4.2-client-rf-troubleshooting',
  },
  {
    id: 'd4-030',
    topic: '4.2',
    type: 'single',
    difficulty: 1,
    stem: "Refer to the exhibit. All APs use 20 MHz channels in 2.4 GHz. What is wrong with this channel plan?",
    exhibit: String.raw`AP          Band     Channel
AP-Lobby    2.4 GHz  1
AP-Floor2   2.4 GHz  4
AP-East     2.4 GHz  6
AP-West     2.4 GHz  9
AP-North    2.4 GHz  11`,
    options: [
      "Channels 4 and 9 overlap their neighbours; a 2.4 GHz plan should use only 1, 6 and 11",
      "Channel 11 is a DFS channel and must not be used indoors",
      "Every AP must use the same channel so clients can roam",
      "Nothing; any five different channels avoid interference",
    ],
    answer: [0],
    explanation: "2.4 GHz channels are 5 MHz apart while a 20 MHz transmission is wider, so only 1, 6 and 11 avoid overlapping each other (in the US channel set). Channels 4 and 9 overlap both neighbours and create adjacent-channel interference. DFS applies to 5 GHz channels, and roaming does not require a shared channel.",
    lesson: '4.2-client-rf-troubleshooting',
  },
  {
    id: 'd4-031',
    topic: '4.2',
    type: 'multi',
    difficulty: 2,
    stem: "Which two actions follow Fortinet's guidance for improving throughput to 802.11n and newer clients? (Choose two.)",
    options: [
      "Use WPA2 or WPA3 with AES-CCMP instead of TKIP",
      "Keep CAPWAP fragmentation prevention such as tcp-mss-adjust in place for tunnel-mode SSIDs",
      "Enable TKIP alongside AES so older and newer clients share the same rates",
      "Enable 802.11b data rates on 5 GHz radios",
      "Disable the data channel so traffic goes over the control channel",
    ],
    answer: [0, 1],
    explanation: "TKIP limits 802.11n clients to legacy rates (Fortinet: about 54 Mbps), so use AES-CCMP. CAPWAP overhead can fragment full-size packets; the default `ip-fragment-preventing tcp-mss-adjust` makes clients send smaller TCP segments. 802.11b does not exist on 5 GHz, and client data never moves to the control channel.",
    lesson: '4.2-client-rf-troubleshooting',
  },
  {
    id: 'd4-032',
    topic: '4.2',
    type: 'multi',
    difficulty: 2,
    stem: "In a lecture hall, distant clients probe constantly and some clients cling to far-away APs with weak signals. Which two SSID settings address these problems? (Choose two.)",
    options: [
      "probe-resp-suppression with a probe-resp-threshold",
      "sticky-client-remove with per-band sticky-client thresholds",
      "multicast-enhance",
      "broadcast-suppression arp-known",
      "okc",
    ],
    answer: [0, 1],
    explanation: "Probe response suppression makes the AP ignore probes from clients weaker than `probe-resp-threshold` (default -80 dBm), saving airtime. Sticky client removal drops clients below `sticky-client-threshold-2g/5g/6g` so they roam. Multicast-to-unicast conversion and ARP broadcast suppression reduce broadcast/multicast load, and OKC speeds up Enterprise roams but does not make clients roam.",
    lesson: '4.2-client-rf-troubleshooting',
  },
  {
    id: 'd4-033',
    topic: '4.2',
    type: 'single',
    difficulty: 3,
    stem: "Refer to the exhibit. Users on AP-Floor2 complain about slow, laggy Wi-Fi. What is the most likely cause?",
    exhibit: String.raw`C:\> ping -n 4 10.20.10.1
Reply from 10.20.10.1: bytes=32 time=38ms TTL=255
Reply from 10.20.10.1: bytes=32 time=61ms TTL=255
Reply from 10.20.10.1: bytes=32 time=44ms TTL=255
Reply from 10.20.10.1: bytes=32 time=57ms TTL=255

WiFi Clients (this laptop):  Signal -52 dBm   Signal/Noise 41 dB   Channel 44   Security WPA2 (AES)
AP-Floor2 radio 2:           Clients 85        Channel utilization 93%`,
    options: [
      "AP-Floor2's radio is saturated with clients; spread the load with AP handoff or more APs",
      "The laptop's signal is too weak to reach the AP",
      "The SSID uses TKIP, which limits throughput",
      "The DHCP server is too slow to answer",
    ],
    answer: [0],
    explanation: "Fortinet treats more than about 10 ms of ping delay from a wireless client as a sign of trouble, and lists weak client signal, AP saturation, interference and weak AP power as causes. Here signal (-52 dBm) and SNR (41 dB) are good and encryption is AES, while the radio carries 85 clients at 93% utilisation: the AP is saturated. AP handoff, a client limit or more APs on other channels address that. DHCP has already succeeded (the laptop has a working address).",
    lesson: '4.2-client-rf-troubleshooting',
  },
  {
    id: 'd4-034',
    topic: '4.2',
    type: 'fill',
    difficulty: 3,
    stem: "In a FortiAP profile, which setting (keyword only) selects `tcp-mss-adjust` or `icmp-unreachable` to stop CAPWAP tunnel packets from being fragmented?",
    answer: ['ip-fragment-preventing', 'set ip-fragment-preventing'],
    explanation: "`set ip-fragment-preventing {tcp-mss-adjust | icmp-unreachable}` (tcp-mss-adjust by default), together with `tun-mtu-uplink` and `tun-mtu-downlink` (default 0, the AP's local MTU). Override per AP with `override-ip-fragment` under `config wireless-controller wtp`.",
    lesson: '4.2-ap-join-troubleshooting',
  },
  {
    id: 'd4-035',
    topic: '4.2',
    type: 'single',
    difficulty: 3,
    stem: "Refer to the exhibit. AP-Lobby's radio 1 is transmitting at 10 dBm. Its neighbour AP-East is heard by AP-Lobby at -52 dBm on its background scans. Why is AP-Lobby at 10 dBm?",
    exhibit: String.raw`config wireless-controller wtp-profile
    edit "FAP231F-office"
        config radio-1
            set auto-power-level enable
            set auto-power-high 17
            set auto-power-low 10
            set auto-power-target "-70"
        end
    next
end

FortiAP-231F # iwconfig wlan00
wlan00    IEEE 802.11ng  ESSID:"Corp"
          Mode:Master  Frequency:2.437 GHz  Access Point: 04:D5:90:12:30:A8
          Bit Rate:144 Mb/s   Tx-Power=10 dBm`,
    options: [
      "Automatic Tx power lowered the radio because a managed neighbour is heard far stronger than the -70 dBm target, and 10 dBm is the configured lower bound",
      "iwconfig reports power in milliwatts, so the radio is really at 17 dBm",
      "Automatic Tx power always starts at auto-power-low and only rises when clients complain",
      "The radio is in monitor mode, which halves transmit power",
    ],
    answer: [0],
    explanation: "With automatic Tx power, the controller compares the strongest signal of neighbouring managed APs (from background scans) with `auto-power-target` (-70 dBm). AP-East at -52 dBm is 18 dB stronger, so AP-Lobby's power is reduced until it reaches `auto-power-low` (10 dBm). With no neighbours it would sit at `auto-power-high`. `iwconfig` shows `Tx-Power` in dBm, and the output shows Mode:Master (AP), not monitor.",
    lesson: '4.2-client-rf-troubleshooting',
  },
  {
    id: 'd4-036',
    topic: '4.2',
    type: 'single',
    difficulty: 1,
    stem: "One FortiAP has stopped passing traffic but is still listed as online. The administrator wants to reboot only that AP from the FortiGate CLI. Which command should be used?",
    options: [
      "execute wireless-controller reset-wtp FP431GTF20000002",
      "execute wireless-controller restart-acd",
      "execute reboot",
      "diagnose wireless-controller wlac -c wtp FP431GTF20000002 reset",
    ],
    answer: [0],
    explanation: "`reset-wtp <SN>` restarts one managed AP (it also accepts `all` or a WTP group). `restart-acd` restarts the controller daemon and drops every AP, `execute reboot` reboots the FortiGate, and `-c wtp` displays AP information rather than rebooting.",
    lesson: '4.2-ap-join-troubleshooting',
  },
  {
    id: 'd4-037',
    topic: '4.3',
    type: 'single',
    difficulty: 2,
    stem: "Refer to the exhibit. After the last line the debug shows nothing more for this client until it disassociates. Why does the client fail to connect to the IoT SSID (WPA2-Personal)?",
    exhibit: String.raw`<ih> IEEE 802.11 mgmt::assoc_req <== 02:44:9a:10:7b:2c vap iot-wlan rId 1 wId 2 04:d5:90:12:30:ba
<ih> IEEE 802.11 mgmt::assoc_resp ==> 02:44:9a:10:7b:2c vap iot-wlan rId 1 wId 2 04:d5:90:12:30:ba resp 0
<dc> STA add 02:44:9a:10:7b:2c vap iot-wlan ws (0-10.10.10.21:5246) rId 1 wId 2 bssid 04:d5:90:12:30:ba NON-AUTH
<eh> send 1/4 msg of 4-Way Handshake
<eh> send IEEE 802.1X ver=1 type=3 (EAPOL_KEY) data len=95 replay cnt 1
<eh> IEEE 802.1X (EAPOL 99B) ==> 02:44:9a:10:7b:2c ws (0-10.10.10.21:5246) rId 1 wId 2 04:d5:90:12:30:ba
<eh> IEEE 802.1X (EAPOL 121B) <== 02:44:9a:10:7b:2c ws (0-10.10.10.21:5246) rId 1 wId 2 04:d5:90:12:30:ba
<eh> recv IEEE 802.1X ver=1 type=3 (EAPOL_KEY) data len=117
<eh> recv EAPOL-Key 2/4 Pairwise replay cnt 1`,
    options: [
      "Message 2/4 arrived but 3/4 was never sent, which points to a wrong passphrase on the client",
      "The association was rejected by the AP",
      "The RADIUS server rejected the client's credentials",
      "The DHCP server did not answer",
    ],
    answer: [0],
    explanation: "Association succeeded (`resp 0`), message 1/4 went out and 2/4 came back, but the AP never sent 3/4. The AP sends 3/4 only after it verifies the MIC in message 2/4, and the MIC fails when the client derived its key from a different passphrase. Extended logging records this as `WPA-invalid-2/4-key-msg` (\"Probably wrong password entered\"). A WPA2-Personal SSID uses no RADIUS, and DHCP comes after the handshake.",
    lesson: '4.3-logs-debugs',
  },
  {
    id: 'd4-038',
    topic: '4.3',
    type: 'single',
    difficulty: 2,
    stem: "Refer to the exhibit. What does this client debug show?",
    exhibit: String.raw`10201.114 <eh> recv EAPOL-Key 4/4 Pairwise replay cnt 2
10201.114 <dc> STA chg 02:6e:41:0c:88:91 vap iot-wlan ws (0-10.10.10.21:5246) rId 1 wId 2 bssid 04:d5:90:12:30:ba AUTH
10201.116 <eh> ***pairwise key handshake completed*** (RSN)
10201.240 <dc> DHCP Request server 0.0.0.0 <== host CAM-07 mac 02:6e:41:0c:88:91 ip 10.20.30.15
10205.251 <dc> DHCP Request server 0.0.0.0 <== host CAM-07 mac 02:6e:41:0c:88:91 ip 10.20.30.15
10213.262 <dc> DHCP Request server 0.0.0.0 <== host CAM-07 mac 02:6e:41:0c:88:91 ip 10.20.30.15`,
    options: [
      "Wi-Fi association and the 4-way handshake succeeded; the client's DHCP requests get no reply",
      "The client is using the wrong passphrase",
      "The client failed 802.1X authentication",
      "The DHCP server assigned 10.20.30.15 successfully",
    ],
    answer: [0],
    explanation: "Message 4/4 arrived, the station moved to AUTH and the pairwise handshake completed, so the Wi-Fi layer is fine. The client then repeats DHCP requests with no `DHCP Ack`, so the problem is the DHCP server or the path to it (scope, relay, VLAN). The `ip` in a request is what the client asks for, not a confirmed lease.",
    lesson: '4.3-logs-debugs',
  },
  {
    id: 'd4-039',
    topic: '4.3',
    type: 'single',
    difficulty: 2,
    stem: "Refer to the exhibit. What should the administrator investigate first?",
    exhibit: String.raw`date=2026-10-21 time=10:02:44 logid="0104043629" type="event" subtype="wireless" level="warning" vd="root" logdesc="Wireless client RADIUS authentication failure" sn="FP431GTF20000002" ap="AP-Floor2" vap="corp-wlan" ssid="Corp" radioid=2 stamac="02:1a:2b:3c:4d:5e" channel=36 security="WPA2 Enterprise" encryption="AES" action="RADIUS-auth-failure" reason="Reserved 0" msg="Client 02:1a:2b:3c:4d:5e RADIUS authentication failure" remotewtptime="0.0"`,
    options: [
      "The 802.1X authentication on the RADIUS side: the user's credentials or certificate and the RADIUS server's own logs for RADIUS-NPS",
      "The SSID passphrase configured on corp-wlan",
      "The DHCP scope of the corp-wlan interface",
      "CAPWAP connectivity between AP-Floor2 and FGT-HQ",
    ],
    answer: [0],
    explanation: "`RADIUS-auth-failure` on a WPA2-Enterprise SSID means the 802.1X exchange failed: wrong credentials, a certificate problem, a policy on the RADIUS server, or the server not answering. The RADIUS server's logs give the reason. Enterprise SSIDs have no passphrase, DHCP comes after authentication, and the AP is clearly talking to the controller (it reported the event).",
    lesson: '4.3-logs-debugs',
  },
  {
    id: 'd4-040',
    topic: '4.3',
    type: 'single',
    difficulty: 2,
    stem: "Refer to the exhibit. What is the problem?",
    exhibit: String.raw`Log & Report > System Events > WiFi Events (selected fields)
time=08:15:02 level="notice" logdesc="Wireless client sent 4/4 message of 4 way handshake" ap="AP-Lobby" ssid="Guest" stamac="02:9b:5a:20:61:7e" action="WPA-4/4-key-msg"
time=08:15:02 level="notice" logdesc="Wireless station sent DHCP DISCOVER" ap="AP-Lobby" ssid="Guest" stamac="02:9b:5a:20:61:7e" action="DHCP-DISCOVER"
time=08:15:12 level="warning" logdesc="Wireless station DHCP process failed with no server response" ap="AP-Lobby" ssid="Guest" stamac="02:9b:5a:20:61:7e" action="DHCP-no-response"`,
    options: [
      "The client is on the Wi-Fi network but no DHCP server answered its discover",
      "The client typed the wrong Guest passphrase",
      "The DHCP server refused the requested address with a NAK",
      "The AP lost its CAPWAP connection during the handshake",
    ],
    answer: [0],
    explanation: "The handshake finished (`WPA-4/4-key-msg`), the client sent `DHCP-DISCOVER`, and `DHCP-no-response` reports that no server replied. A wrong passphrase would show `WPA-invalid-2/4-key-msg`; a refusal would be `DHCP-NAK`. Check the DHCP server on the guest-wlan interface (or its relay) and the path to it.",
    lesson: '4.3-logs-debugs',
  },
  {
    id: 'd4-041',
    topic: '4.3',
    type: 'order',
    difficulty: 2,
    stem: "Put the extended wireless log actions for a successful WPA2-Personal client connection in order.",
    items: [
      "probe-req / probe-resp",
      "auth-req / auth-resp",
      "assoc-req / assoc-resp",
      "WPA-1/4-key-msg to WPA-4/4-key-msg",
      "DHCP-DISCOVER, DHCP-OFFER, DHCP-REQUEST, DHCP-ACK",
    ],
    explanation: "Probe, 802.11 open-system authentication, association, the 4-way handshake, then DHCP. On an Enterprise SSID, RADIUS-auth-success would appear between association and the 4-way handshake.",
    lesson: '4.3-logs-debugs',
  },
  {
    id: 'd4-042',
    topic: '4.3',
    type: 'order',
    difficulty: 2,
    stem: "Put the steps for capturing a CAPWAP join debug for one FortiAP in order.",
    items: [
      "diagnose wireless-controller wlac wtp_filter <SN> 0-<AP IP>:5246 2",
      "diagnose debug console timestamp enable",
      "diagnose debug application cw_acd 0x7ff",
      "diagnose debug enable",
      "Reproduce the problem (reboot or reconnect the AP) and read the output",
      "diagnose debug disable and diagnose debug reset",
    ],
    explanation: "Set the AP filter first so only that AP's messages print, add timestamps, raise the cw_acd debug level, enable debug output, reproduce, then disable and reset so the debug does not keep running.",
    lesson: '4.3-logs-debugs',
  },
  {
    id: 'd4-043',
    topic: '4.3',
    type: 'fill',
    difficulty: 1,
    stem: "Complete the command: `diagnose debug application ______ 0x7ff` enables debug output from the FortiGate wireless controller daemon.",
    answer: ['cw_acd'],
    explanation: "`cw_acd` is the access controller daemon that runs CAPWAP to the FortiAPs. Combine it with `wtp_filter` or `sta_filter` and `diagnose debug enable`.",
    lesson: '4.3-logs-debugs',
  },
  {
    id: 'd4-044',
    topic: '4.3',
    type: 'match',
    difficulty: 2,
    stem: "Match each debug line to the phase it belongs to.",
    pairs: [
      ['<ih> IEEE 802.11 mgmt::assoc_resp ==> 02:1a:2b:3c:4d:5e ... resp 0', 'Client 802.11 association'],
      ['<eh> recv EAPOL-Key 2/4 Pairwise replay cnt 1', 'Client 4-way handshake'],
      ['<dc> DHCP Ack server 10.20.10.1 ==> host mac 02:1a:2b:3c:4d:5e ip 10.20.10.31', 'Client DHCP'],
      ['<fsm> old CWAS_DTLS_CONN(5) ev CWAE_DTLS_ESTABLISHED(8) new CWAS_JOIN(7)', 'FortiAP CAPWAP join'],
      ['<msg> ECHO_REQ (21) <== ws (0-10.10.10.21:5246)', 'CAPWAP keep-alive in the RUN state'],
    ],
    explanation: "Client debugs (`sta_filter`) show association, the EAPOL key exchange and DHCP. AP debugs (`wtp_filter`) show CAPWAP messages and state transitions; echo requests keep a running AP's control session alive.",
    lesson: '4.3-logs-debugs',
  },
  {
    id: 'd4-045',
    topic: '4.3',
    type: 'single',
    difficulty: 2,
    stem: "Refer to the exhibit. FGT-HQ manages FortiAPs and clients connect normally, but no wireless events appear in the logs. What should the administrator change?",
    exhibit: String.raw`FGT-HQ # show full-configuration log eventfilter | grep -e event -e wireless
    set event enable
    set wireless-activity disable

FGT-HQ # show full-configuration wireless-controller log | grep status
    set status enable`,
    options: [
      "Set wireless-activity enable under config log eventfilter",
      "Enable ext-info-enable in every FortiAP profile",
      "Set sta-event-log to emergency",
      "Enable diagnose debug application cw_acd",
    ],
    answer: [0],
    explanation: "`wireless-activity` (default enable) under `config log eventfilter` turns wireless event logging on or off as a whole, and it is disabled here. `ext-info-enable` adds extension data to `wlac -d` diagnostics, setting a category to emergency would log *less*, and debug output is not logging.",
    lesson: '4.3-logs-debugs',
  },
  {
    id: 'd4-046',
    topic: '4.3',
    type: 'fill',
    difficulty: 2,
    stem: "Under `config wireless-controller log`, what is the default lowest severity logged for categories such as `sta-event-log` and `rogue-event-log`?",
    answer: ['notification'],
    explanation: "All categories (`sta-event-log`, `wtp-event-log`, `radio-event-log`, `rogue-event-log`, `wids-log`, `clb-log` and the rest) default to `notification`. Lower it to `information` or `debug` temporarily to see more.",
    lesson: '4.3-logs-debugs',
  },
  {
    id: 'd4-047',
    topic: '4.3',
    type: 'single',
    difficulty: 2,
    stem: "Refer to the exhibit. The administrator captured traffic with this profile, then set radio 2 back to AP mode before copying the capture file to a TFTP server. The file is gone. Why?",
    exhibit: String.raw`config wireless-controller wtp-profile
    edit "FAP431G-sniff"
        config radio-2
            set mode sniffer
            set ap-sniffer-chan 36
            set ap-sniffer-chan-width 20MHz
            set ap-sniffer-bufsize 16
            set ap-sniffer-mgmt-beacon enable
            set ap-sniffer-mgmt-probe enable
            set ap-sniffer-data enable
        end
    next
end`,
    options: [
      "The capture is stored only temporarily on the FortiAP and is deleted when the radio mode changes",
      "Sniffer captures are written to the FortiGate disk, which needs log disk enabled",
      "ap-sniffer-bufsize 16 means only 16 frames were kept",
      "Sniffer mode saves files only when ap-sniffer-ctl is enabled",
    ],
    answer: [0],
    explanation: "The over-the-air capture (`/tmp/wl_sniff.cap` on the AP) is temporary: changing the radio mode or rebooting before uploading it with TFTP deletes it. The buffer size is in MB (1–32, default 16), the file lives on the AP, not the FortiGate, and frame-type toggles only choose what is captured.",
    lesson: '4.3-logs-debugs',
  },
  {
    id: 'd4-048',
    topic: '4.3',
    type: 'single',
    difficulty: 3,
    stem: "Refer to the exhibit. What will the Wireshark host at 10.0.1.50 receive?",
    exhibit: String.raw`FGT-HQ # diagnose wireless-controller wlac sniff-cfg 10.0.1.50 23352
Current Sniff Server: 10.0.1.50, 23352

FGT-HQ # diagnose wireless-controller wlac sniff port5 FP231FTF20000001 2
WTP 0-FP231FTF20000001 Sniff: intf port5 enabled (control and data message)`,
    options: [
      "Copies of FP231FTF20000001's CAPWAP control and data messages, which it can decode as IP to see the inner traffic",
      "Only the CAPWAP control messages, because data is always encrypted",
      "Raw 802.11 frames captured over the air by the AP's radio",
      "Nothing, because the level 2 means disabled",
    ],
    answer: [0],
    explanation: "`sniff-cfg` sets the server that receives the copied traffic, and `sniff <intf> <SN> 2` forwards both control and data messages (1 = control only, 0 = off). In Wireshark you decode the traffic as IP to inspect the inner CAPWAP. Over-the-air 802.11 frames need a radio in sniffer mode instead.",
    lesson: '4.3-logs-debugs',
  },
  {
    id: 'd4-049',
    topic: '4.3',
    type: 'single',
    difficulty: 2,
    stem: "Refer to the exhibit. What is the purpose of these two commands?",
    exhibit: String.raw`FGT-HQ # diagnose wireless-controller wlac plain-ctl FP231FTF20000001 1
WTP 0-FP231FTF20000001 Plain Control: enabled

FortiAP-231F # cw_diag plain-ctl 1
Current Plain Control: enabled`,
    options: [
      "They send CAPWAP control traffic on UDP 5246 unencrypted so a packet capture can read it",
      "They disable DTLS on the data channel to improve throughput",
      "They make the AP use plain-text discovery instead of DHCP option 138",
      "They remove the AP's admin password",
    ],
    answer: [0],
    explanation: "The CAPWAP control channel is normally DTLS-encrypted. Enabling plain control on both the controller and the AP sends it in clear text so a sniffer capture shows the control messages. It is a temporary troubleshooting setting; the data channel is controlled separately by `dtls-policy`.",
    lesson: '4.3-logs-debugs',
  },
  {
    id: 'd4-050',
    topic: '4.3',
    type: 'multi',
    difficulty: 2,
    stem: "Refer to the exhibit. Which two statements are true? (Choose two.)",
    exhibit: String.raw`91155.197 <ih> IEEE 802.11 mgmt::assoc_req <== 02:1a:2b:3c:4d:5e vap corp-wlan rId 1 wId 0 04:d5:90:12:30:b8
91155.197 <ih> IEEE 802.11 mgmt::assoc_resp ==> 02:1a:2b:3c:4d:5e vap corp-wlan rId 1 wId 0 04:d5:90:12:30:b8 resp 0
91155.199 <eh> send 1/4 msg of 4-Way Handshake
91155.217 <eh> recv EAPOL-Key 2/4 Pairwise replay cnt 1
91155.218 <eh> send 3/4 msg of 4-Way Handshake
91155.223 <eh> recv EAPOL-Key 4/4 Pairwise replay cnt 2
91155.226 <eh> ***pairwise key handshake completed*** (RSN)
91155.257 <dc> DHCP Request server 0.0.0.0 <== host LAPTOP-114 mac 02:1a:2b:3c:4d:5e ip 10.20.10.31
91155.258 <dc> DHCP Ack server 10.20.10.1 ==> host mac 02:1a:2b:3c:4d:5e ip 10.20.10.31 mask 255.255.255.0 gw 10.20.10.1`,
    options: [
      "The client completed the 4-way handshake and has pairwise keys",
      "The client received 10.20.10.31/24 with gateway 10.20.10.1",
      "The client authenticated with 802.1X through a RADIUS server",
      "The association was rejected and the client retried",
      "The client is connected to BSSID 04:d5:90:12:30:a8",
    ],
    answer: [0, 1],
    explanation: "Messages 1/4 to 4/4 complete and the pairwise handshake is reported complete; the DHCP Ack gives 10.20.10.31 with mask 255.255.255.0 and gateway 10.20.10.1. No EAP exchange appears between association and the handshake, so this is a PSK SSID. `resp 0` is a successful association response, and the BSSID in the trace is 04:d5:90:12:30:b8.",
    lesson: '4.3-logs-debugs',
  },
  {
    id: 'd4-051',
    topic: '4.3',
    type: 'single',
    difficulty: 2,
    stem: "Refer to the exhibit. What produced this log?",
    exhibit: String.raw`date=2026-10-22 time=02:00:31 logid="0104043711" type="event" subtype="wireless" level="notice" vd="root" logdesc="SAM ping test result" sn="FP231FTF20000001" ap="FP231FTF20000001" vap="iot-wlan" ssid="IoT" stamac="02:c4:7d:18:00:01" radioid=2 channel=36 security="WPA3 SAE" encryption="AES" action="sam-ping-result" msg="Connected to AP FP431GTF20000002, 0.0% packet loss" remotewtptime="711.204118"`,
    options: [
      "Radio 2 of FP231FTF20000001 in SAM mode joined the IoT SSID on FP431GTF20000002 as a client and ran a ping test",
      "A user's laptop pinged the FortiGate from the IoT SSID",
      "DARRP tested channel 36 for radar before using it",
      "The controller pinged FP431GTF20000002 over CAPWAP",
    ],
    answer: [0],
    explanation: "Service Assurance Management (`set mode sam` on a radio, with `sam-ssid`, `sam-security-type`, `sam-test ping|iperf`, `sam-server-ip` and `sam-report-intv`) turns a FortiAP radio into a test client of another AP. Results are written as WiFi event logs such as \"SAM ping test result\" and \"SAM iperf test result\". The reporting AP (`sn`) is the test client; the message names the AP it connected to.",
    lesson: '4.3-logs-debugs',
  },
  {
    id: 'd4-052',
    topic: '4.3',
    type: 'single',
    difficulty: 1,
    stem: "Where in the FortiOS 7.6 GUI does an administrator view wireless event logs such as client association and DHCP failures?",
    options: [
      "Log & Report > System Events, WiFi Events",
      "Log & Report > Security Events, Intrusion Prevention",
      "WiFi & Switch Controller > WIDS Profiles",
      "Dashboard > WiFi > Rogue APs",
    ],
    answer: [0],
    explanation: "Wireless events are event logs (`subtype=\"wireless\"`) listed under Log & Report > System Events as WiFi Events. Security Events hold security-profile (UTM) logs, WIDS Profiles is configuration, and the Rogue AP monitor lists detected APs, not client events.",
    lesson: '4.3-logs-debugs',
  },
];
