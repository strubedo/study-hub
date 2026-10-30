// Cheat-sheet tables for the Reference page. Cells are inline markdown. FortiGate 7.6 / FortiAP 7.6.
// Verified 2026-10-29 against docs.fortinet.com: FortiWiFi and FortiAP 7.6.0 Configuration Guide
// (Advanced WiFi controller discovery, Discovery and authorization of APs, Configuring the FortiGate
// interface to manage FortiAP units, Data channel security, Defining a wireless network interface (SSID),
// WPA2 Security, WPA3 Security, WPA2 and WPA3 Enterprise authentication, VLAN assignment by RADIUS /
// by VLAN pool, Configuring wireless NAC support, Monitoring rogue APs, Suppressing rogue APs, Debug
// commands, FortiAP connection issues, Client connection issues, FortiAP CLI configuration and
// diagnostics commands, Setting your geographic location) and the FortiOS 7.6.3 CLI Reference
// (config wireless-controller vap / wtp-profile / wids-profile, execute wireless-controller).
// The Wi-Fi generation rows are IEEE 802.11 / Wi-Fi Alliance facts, not Fortinet documentation.
export default [
  {
    id: 'wifi-standards', title: '802.11 standards, bands and channels', topic: '1.1',
    columns: ['Standard (Wi-Fi Alliance name)', 'Bands, widths and key features'],
    rows: [
      ['802.11b', '2.4 GHz, 22 MHz DSSS/CCK channels, up to 11 Mbps'],
      ['802.11a / 802.11g', '802.11a: 5 GHz OFDM, up to 54 Mbps. 802.11g: 2.4 GHz OFDM, up to 54 Mbps, backward compatible with 802.11b'],
      ['802.11n (Wi-Fi 4)', '2.4 and 5 GHz, 20/40 MHz, MIMO up to 4 spatial streams, up to 600 Mbps'],
      ['802.11ac (Wi-Fi 5)', '5 GHz only in the standard, 20–160 MHz, 256-QAM, downlink MU-MIMO. (FortiOS also offers an `802.11ac-2G` band option)'],
      ['802.11ax (Wi-Fi 6 / Wi-Fi 6E)', '2.4 and 5 GHz; **Wi-Fi 6E** is 802.11ax in 6 GHz. OFDMA, 1024-QAM, BSS coloring (`bss-color`), target wake time, up to 160 MHz'],
      ['802.11be (Wi-Fi 7)', '2.4, 5 and 6 GHz, 320 MHz channels (6 GHz only), 4096-QAM, multi-link operation (MLO)'],
      ['2.4 GHz channels', 'Channels 1–11 (US) or 1–13; only **1, 6 and 11** do not overlap at 20 MHz. 40 MHz in 2.4 GHz leaves no clean channel plan'],
      ['5 GHz and DFS', 'UNII-2 (52–64) and UNII-2e (100–144) are DFS channels: the AP must check for radar before use and leave the channel when it detects radar. FortiOS radio setting `zero-wait-dfs` (default enable)'],
      ['6 GHz rules', 'Wi-Fi Alliance requires WPA3 or OWE with PMF in 6 GHz: no open or WPA2 SSIDs'],
      ['Country / regulatory domain', 'Permitted channels and power depend on the country. FortiGate default is the United States: `config wireless-controller setting` → `set country <code>`. Remove all FortiAP profiles before changing it. `cw_diag -c all-countries` on a FortiAP lists the codes'],
    ],
    note: 'FortiOS radio `band` values pair the standard and band, e.g. `802.11ax-5G`, `802.11ax-6G`, `802.11be-6G`; `channel-bonding` offers 20/40/80/160/240/320MHz (default 20MHz).',
  },
  {
    id: 'discovery', title: 'FortiAP discovery, authorization and CAPWAP', topic: '1.2',
    columns: ['Item', 'Detail'],
    rows: [
      ['Discovery order (`AC_DISCOVERY_TYPE=0`, auto)', 'Static → DHCP → DNS → FortiManagement Cloud → multicast → broadcast. Each type: up to 3 requests, `discovery-interval` default 5 s (2–180). After the last type fails the AP goes to SULKING, then restarts discovery'],
      ['Static', 'AP CLI `cfg -a AC_IPADDR_1=<ip>` (up to `AC_IPADDR_3`), unicast request; routing must work both ways'],
      ['DHCP', 'Option **138** carries the controller IP(s) in hex (192.168.0.1 = `C0A80001`); change the code with `AC_DISCOVERY_DHCP_OPTION_CODE`'],
      ['DNS', 'Default hostname `fortinet-capwap-controller` plus the domain from DHCP option 15; customise with `AC_HOSTNAME_1..3`'],
      ['FortiManagement Cloud', 'DNS lookup of `apctrl1.forticloud.com`, then HTTPS to get the controller address'],
      ['Multicast / broadcast', 'Multicast to **224.0.1.140** (`config wireless-controller global` → `set discovery-mc-addr`, AP `AC_DISCOVERY_MC_ADDR`; both must match). Broadcast needs the AP and controller in the same broadcast domain'],
      ['FortiGate interface', 'Administrative access **Security Fabric Connection** (`set allowaccess fabric`) enables CAPWAP. `ap-discover` (create entries for new APs) default enable; `auto-auth-extension-device` (auto-authorize) default disable'],
      ['Authorization', 'Discovered APs appear in WiFi & Switch Controller > Managed FortiAPs within about two minutes; authorize them, or pre-authorize by serial or wildcard serial (`FP231F****000001`). Authorized APs get the model\'s default FortiAP profile unless you assign one'],
      ['CAPWAP channels', 'Control channel UDP **5246** (`AC_CTL_PORT`), always DTLS-encrypted. Data channel (UDP 5247 per RFC 5415) uses `dtls-policy` in the FortiAP profile: `clear-text` (default, highest throughput, can be offloaded), `dtls-enabled`, `ipsec-vpn`, `ipsec-sn-vpn`; FortiGate and FortiAP settings must agree'],
    ],
    note: 'Fortinet\'s pages disagree on the numbers for the last two types: the discovery page writes 5 (multicast) and 6 (broadcast), the FortiAP CLI variable table lists 5 = Broadcast and 6 = Multicast. Learn the order by name.',
  },
  {
    id: 'ssid-security', title: 'SSID traffic modes, security modes and VLANs', topic: '2.2',
    columns: ['Setting (CLI under `config wireless-controller vap`)', 'Behaviour'],
    rows: [
      ['Tunnel (default)', 'Client data goes through the CAPWAP data channel to the FortiGate, which routes and inspects it. Clients keep their IP when roaming between APs on the same controller'],
      ['Local bridge (`set local-bridging enable`)', 'The FortiAP bridges WiFi to its Ethernet port; traffic does not cross the controller. Mesh: the radio carries the SSID over a mesh backhaul SSID'],
      ['`security` default', '`wpa2-only-personal` (AES; `set encrypt TKIP-AES` for old clients). `wpa-personal` = WPA/WPA2'],
      ['WPA3-SAE (`wpa3-sae`)', '`sae-password`; PMF required (`set pmf enable`). Options: `sae-h2e-only`, SAE-PK'],
      ['SAE transition (`wpa3-sae-transition`)', 'Two secrets: WPA2 clients use `passphrase`, WPA3 clients use `sae-password`; `pmf optional`'],
      ['WPA3 Enterprise modes', '`wpa3-enterprise` = 192-bit, PMF mandatory; `wpa3-only-enterprise` = PMF mandatory; `wpa3-enterprise-transition` = PMF optional'],
      ['WPA2 Enterprise (`wpa2-only-enterprise`)', '802.1X with `set auth radius` + `radius-server`, or `set auth usergroup` (FortiGate user groups). Captive portal is not supported with Enterprise modes'],
      ['OWE (`owe`)', 'Encryption without a password; `owe-transition` pairs it with an open SSID for older clients'],
      ['`pmf`', '`disable` (default), `enable` (deny clients without PMF), `optional`'],
      ['Dynamic VLAN (`set dynamic-vlan enable`)', 'RADIUS returns Tunnel-Type (64) = 13 (VLAN), Tunnel-Medium-Type (65) = 6 (802), Tunnel-Private-Group-ID (81) = VLAN ID. No VLAN in the reply = SSID default VLAN'],
      ['VLAN pooling (`vlan-pooling`)', '`wtp-group`, `round-robin`, `hash` or `disable` (default). Load-balancing pools work only on tunnel-mode SSIDs'],
      ['Wireless NAC', '`config wireless-controller nac-profile` → `set onboarding-vlan`; SSID `set nac enable` + `set nac-profile`. Clients join the onboarding VLAN, and a client that matches a NAC policy is disconnected and reconnects into the policy\'s VLAN'],
    ],
    note: 'Roaming options on the SSID: `fast-bss-transition` (802.11r, default disable), `80211k` and `80211v` (default enable), `okc` (default enable).',
  },
  {
    id: 'rogue-wids', title: 'Rogue APs, radio modes and WIDS', topic: '3.1',
    columns: ['Item', 'Detail'],
    rows: [
      ['Radio `mode` (FortiAP profile)', '`ap` (default), `monitor` (dedicated rogue AP scanner), `sniffer` (captures frames over the air), `sam` (station that tests a neighbouring AP), `disabled`'],
      ['Background scanning', 'An AP-mode radio with a WIDS profile (`ap-scan enable`) briefly leaves its channel to scan while serving clients. FortiOS 7.6.3 CLI Reference defaults (WIDS profile): `ap-bgscan-period` 600 s between scans, `ap-bgscan-intv` 3 s between channels, `ap-bgscan-duration` 30 ms per channel, `ap-bgscan-idle` 20 ms of channel inactivity before leaving it, `ap-bgscan-report-intv` 30 s. (The FortiAP 7.6 guide\'s rogue-AP page still says "every 300 seconds, 20 ms per channel"; check `show full-configuration` on your build)'],
      ['Rogue AP states', 'Unclassified (initial), Accepted, Rogue, Suppressed Rogue AP. Dashboard > WiFi > Rogue APs'],
      ['On-wire detection', '**Exact MAC match** (the same MAC on the LAN and on WiFi, for non-NAT APs) and **MAC adjacency** (WiFi MAC close to the wired MAC, for NAT routers). Needs at least one client sending traffic through the suspect AP'],
      ['Suppression', 'The controller sends deauthentication frames to the rogue AP\'s clients and to the rogue AP. Needs on-wire detection enabled and the monitoring radio in Dedicated Monitor mode. CLI: `config wireless-controller ap-status` → `set status suppressed`. Check local law first'],
      ['WIDS profile', '`config wireless-controller wids-profile`, applied per radio with `set wids-profile`. Detections are off by default: e.g. `deauth-broadcast`, `spoofed-deauth`, `eapol-start-flood`, `asleap-attack`, `ap-spoofing`, `ap-impersonation`, `null-ssid-probe-resp`, `weak-wep-iv`; plus `ap-scan` and `ap-auto-suppress` (on-wire auto-suppression)'],
      ['Logging', 'Rogue APs log at alert level, unknown APs at warning level'],
    ],
  },
  {
    id: 'diagnose', title: 'Wireless diagnose and FortiAP commands', topic: '4.1',
    columns: ['Command', 'Shows / does'],
    rows: [
      ['`diagnose wireless-controller wlac help`', 'All controller (`wlac`) debug options on this build'],
      ['`diagnose wireless-controller wlac -c vap`', 'Every BSSID: SSID, interface, AP IP:port (`ws (0-192.168.3.33:5246)`), radio ID and WLAN ID'],
      ['`diagnose wireless-controller wlac -c darrp`', 'DARRP state per radio: AP serial, number of candidate channels, operating channel'],
      ['`diagnose wireless-controller wlac -d sta online`', 'Online clients from the data plane; `-d wtp|vap|sta` show extension info when `ext-info-enable` is set in the profile'],
      ['`diagnose wireless-controller wlac wtp_filter <SN> 0-<AP-IP>:5246 2`', 'With `diagnose debug application cw_acd 0x7ff` and `diagnose debug enable`: CAPWAP join debug for one AP (DISCOVERY_REQ/RESP, DTLS, JOIN_REQ, CFG_STATUS, DATA_CHAN, RUN)'],
      ['`diagnose wireless-controller wlac sta_filter <client-MAC> 2`', 'Client debug: assoc_req/resp, the 4-way handshake (EAPOL 1/4–4/4) and DHCP'],
      ['`diagnose sniffer packet <intf> "port 5246" 4`', 'Confirms CAPWAP control traffic between AP and controller (verbosity 6 for a PCAP export)'],
      ['`get wireless-controller wtp`', 'Serial numbers of discovered and managed APs'],
      ['`execute wireless-controller reset-wtp <all|SN|wtp-group>` / `restart-acd`', 'Reboot APs / restart the controller daemon (`cw_acd`; restarting it drops every AP)'],
      ['FortiAP `cfg -s` / `cfg -a VAR=value` / `cfg -c`', 'Show variables / change one / commit to flash (`cfg -x` = factory reset)'],
      ['FortiAP `cw_diag -c wtp-cfg | vap-cfg | radio-cfg`', 'AP, SSID and radio configuration received from the controller'],
      ['FortiAP `cw_diag -c ap-scan | sta-scan | wids | ap-suppress`', 'Scanned APs, scanned stations, WIDS detections, suppressed APs'],
    ],
    note: '`diagnose wireless-controller wlac -c wtp [SN]` (per-AP record) appears in the 7.6 guide only inside examples (temperature and background-scan checks), and the CLI Reference documents `wlac` only as `<-c|-d|-k|-h>` (control plane, data plane, help); run `wlac help` on a 7.6 FortiGate before quoting other sub-options.',
  },
];
