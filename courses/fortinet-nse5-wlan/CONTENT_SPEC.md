# Content Spec — Fortinet NSE 5 Secure Wireless LAN 7.6 Administrator

Targets the **official Fortinet NSE 5 - Secure Wireless LAN 7.6 Administrator exam
topics** in `content/blueprint.js` (training.fortinet.com exam page, checked
2026-10-29; product "FortiGate 7.6, FortiAP 7.6, and FortiPresence 2.0"; the matching
course lists FortiOS 7.6, FortiAP 7.6 and FortiAIOps 3.2). Every lesson, question and
flashcard is tagged with a blueprint topic id. **Fortinet publishes only the 12 tasks —
no sub-bullets and no weights.** Each topic's `sub` list in `blueprint.js` is a *site
checklist* taken from the course agenda/objectives; together the lessons must cover
every item, but never present those items as Fortinet's own exam bullets.

**File formats, question types, mix guide, lesson structure, callouts, exam style
and the ground rules are identical to
`courses/fortinet-nse4/CONTENT_SPEC.md` — read it
first and follow it.** Only these points differ:

1. **Product and version.** FortiOS **7.6** wireless controller and FortiAP **7.6**,
   not 8.0. References: *FortiWiFi and FortiAP 7.6 Configuration Guide*
   (docs.fortinet.com/document/fortiap/7.6.0/fortiwifi-and-fortiap-configuration-guide;
   7.6.1–7.6.7 also exist), *FortiOS 7.6 CLI Reference* (`config wireless-controller …`
   pages, 7.6.3 used here), *FortiOS 7.6 Administration Guide*, the *FortiAIOps 3.2
   User Guide* and the *FortiEdge Cloud* guide. 7.6.0 wireless additions (from the
   guide's "What's new"): RADSEC on WPA2/WPA3-Enterprise SSIDs, WPA3-SAE and
   SAE-transition in MPSK profiles, MPSK self-registration through FortiGuest,
   OpenRoaming, 802.11mc, local LAN segregation, IKEv2 for the FortiAP IPsec data
   channel. Don't teach FortiOS 8.0-only wireless features.
2. **Scope beyond the FortiGate.** The exam description names **FortiEdge Cloud
   management** and the **FortiAIOps solution**. FortiEdge Cloud (older name FortiLAN
   Cloud) manages standalone FortiAP/FortiSwitch/FortiExtender; its 26.3 guide says it
   "is transitioning to FortiManagement Cloud" — check current names and menus before
   writing. FortiAIOps facts verified in the 3.2.0 User Guide: it adds FortiGate
   controllers over HTTPS (default port 443, admin username/password, ADOM; the
   FortiGate certificate SAN must match the configured IP/FQDN), monitors wireless
   SLAs (throughput, coverage, roaming, time to connect, connection failure, AP health
   and uptime, WIDS) plus switching and WAN, and its **AI-ARRP** needs `set darrp
   enable` and `set ai-darrp-support enable` per radio — note the guide says AI-ARRP
   needs **FortiOS 7.6.5 and FortiAP 7.6.3**, so check version claims. **FortiPresence
   2.0** is in the exam's product line but not in its topic list (the 7.X exam had
   "Implement location-based presence and guest services"; 7.6 replaced it with AIOps):
   mention FortiPresence only as context in 3.2 / 3.3, no dedicated questions.
3. **RF facts the owner will check** (1.1): 802.11a/b/g/n/ac/ax/be with the Wi-Fi
   Alliance names (Wi-Fi 4 = 802.11n, 5 = 802.11ac, 6 = 802.11ax, 6E = 802.11ax in
   6 GHz, 7 = 802.11be), bands, channel widths, 2.4 GHz non-overlapping 1/6/11, 5 GHz
   UNII bands and **DFS** (radar check, channel move; FortiOS `zero-wait-dfs`), 6 GHz
   WPA3/OWE-only rule, UNII-4 (169/173/177, FortiAP G-series single-5G mode only, not
   allowed in every country), regulatory domain / country code, EIRP vs transmit
   power, RSSI/SNR/noise floor, beacons, probe/auth/assoc, BSSID vs SSID, 802.11r/k/v,
   OKC, PMF (802.11w). Security: WEP/TKIP history, WPA2 (AES-CCMP) personal and
   enterprise, WPA3-SAE (H2E, SAE-PK), SAE transition, WPA3-Enterprise and 192-bit
   mode, OWE and OWE transition, 802.1X roles (supplicant / authenticator /
   authentication server), EAP methods (EAP-TLS, PEAP-MSCHAPv2, EAP-TTLS), the 4-way
   handshake. Be exact; no hand-waving data rates — if a number appears, it must be
   the standard's maximum and say so.
4. **Wireless CLI must be real.** Config trees (verified in the 7.6.3 CLI Reference):
   `config wireless-controller setting` (`country`), `global` (`discovery-mc-addr`),
   `timers` (`discovery-interval`), `wtp` (`admin`, `wtp-profile`, `override-allowaccess`,
   `allowaccess`), `wtp-profile` (`ap-country`, `dtls-policy` default `clear-text` /
   `dtls-enabled` / `ipsec-vpn` / `ipsec-sn-vpn`, `frequency-handoff`, `ap-handoff`,
   `handoff-rssi` (20–30, default 25), `handoff-sta-thresh`, `handoff-roaming`,
   `ext-info-enable`, and per radio `config radio-1..4`: `mode` (ap / monitor /
   sniffer / sam / disabled), `band`, `channel`, `channel-bonding` (default 20MHz),
   `darrp` (default disable), `arrp-profile`, `auto-power-level` / `-high` / `-low`,
   `power-mode` (percentage default / dBm), `power-level`, `power-value`, `vap-all`
   (tunnel default / bridge / manual), `vaps`, `wids-profile`, `zero-wait-dfs`,
   `bss-color`), `vap` (`ssid`, `security` default `wpa2-only-personal`, `passphrase`,
   `sae-password`, `pmf`, `auth radius|usergroup`, `radius-server`, `local-bridging`,
   `dynamic-vlan`, `vlanid`, `vlan-pooling`, `config vlan-pool`, `nac`, `nac-profile`,
   `captive-portal`, `portal-type`, `intra-vap-privacy`, `broadcast-ssid`,
   `fast-bss-transition`, `80211k`, `80211v`, `okc`, `owe-transition`),
   `wids-profile`, `ap-status` (`set status suppressed`), `nac-profile`
   (`onboarding-vlan`), `arrp-profile`, `wtp-group`, `vap-group`, `mpsk-profile`.
   Controller diagnostics (FortiAP 7.6.0 guide): `diagnose wireless-controller wlac
   help`, `wlac -c vap`, `wlac -c darrp`, `wlac -c wlan <vap>`, `wlac -d sta online`,
   `wlac -d wtp|vap|sta`, `wlac wtp_filter <SN> <ip>:5246 2`, `wlac sta_filter <mac> 2`,
   `diagnose wireless-controller wlac_hlp -c sta-nac`, `diagnose debug application
   cw_acd 0x7ff`, `diagnose sniffer packet <intf> "port 5246" 4`, `diagnose debug
   crashlog read`, `get wireless-controller wtp`, `execute wireless-controller
   reset-wtp | restart-acd | led-blink | spectral-scan | upload-wtp-image |
   list-wtp-image`. FortiAP CLI: `cfg -s|-a|-c|-x|-r|-e|-h`, variables `AC_IPADDR_1`,
   `AC_DISCOVERY_TYPE`, `AC_DISCOVERY_DHCP_OPTION_CODE`, `AC_DISCOVERY_MC_ADDR`,
   `AC_CTL_PORT`, `AC_DATA_CHAN_SEC`, `ADDR_MODE`, `AP_MGMT_VLAN_ID`, `MESH_AP_TYPE`,
   `WANLAN_MODE`; `cw_diag -c wtp-cfg|vap-cfg|radio-cfg|ap-scan|sta-scan|wids|
   ap-suppress|darrp|mesh|all-countries|acs-chan-stats`, `cw_diag help`, `fap-tech`.
   **Lab-verify before quoting output:** `diagnose wireless-controller wlac -c wtp` and
   `-c sta` (Fortinet Community only, not the 7.6 guide), and `get wireless-controller
   wtp-status`, `vap-status`, `scan`, `rf-analysis` (common in older guides, not found
   in the 7.6 pages checked). Run `wlac help` on a 7.6 FortiGate. Exhibits must copy the
   field layout of the guide's samples (e.g. `-c vap` columns `bssid ssid intf
   vfid:ip-port rId wId`; CAPWAP debug lines `<msg> DISCOVERY_REQ (12) <== ws
   (0-192.168.35.1:5246)`, `<fsm> old CWAS_JOIN(7) ev … new CWAS_CONFIG(8)`; client
   debug `<ih> IEEE 802.11 mgmt::assoc_req <==`, `<eh> recv EAPOL-Key 2/4 Pairwise`,
   `<dc> DHCP Ack`).
5. **Facts that must be exact** (all from the 7.6.0 guide unless noted): discovery
   order static → DHCP → DNS → FortiManagement Cloud → multicast → broadcast (the
   guide's discovery page and its CLI-variable table disagree on whether 5/6 mean
   multicast or broadcast — teach names, not numbers), DHCP option 138 in hex, DNS
   name `fortinet-capwap-controller`, `apctrl1.forticloud.com`, multicast
   224.0.1.140, `discovery-interval` default 5 s, SULKING state; interface access
   "Security Fabric Connection" (`allowaccess fabric`) enables CAPWAP (the guide's
   example writes `set allow-access fabric` — a typo; the CLI keyword is
   `allowaccess`), `ap-discover` default enable, `auto-auth-extension-device` default
   disable; wildcard serial pre-authorization; CAPWAP control UDP 5246 always DTLS,
   data channel default clear text (UDP 5247 is from RFC 5415); traffic modes tunnel
   (default) / local bridge / mesh; captive portal not supported with Enterprise
   modes; WPA3 mode list and PMF rules; dynamic VLAN RADIUS attributes 64/65/81;
   VLAN-pool load balancing only in tunnel mode; NAC onboarding VLAN then
   disconnect/reconnect into the policy VLAN; rogue AP states and on-wire methods;
   suppression needs on-wire detection and a dedicated-monitor radio; background scan
   defaults per the 7.6.3 CLI Reference WIDS profile: `ap-bgscan-period` 600 s,
   `ap-bgscan-intv` 3 s, `ap-bgscan-duration` 30 ms, `ap-bgscan-idle` 20 ms (the guide's
   rogue-AP page still says 300 s / 20 ms per channel — doc conflict, don't test the
   numbers); DARRP thresholds (`threshold-ap` 250,
   `threshold-noise-floor` -85, `threshold-channel-load` 60, `threshold-spectral-rssi`
   -65); frequency and AP handoff (not applied to roaming clients). **Known doc
   conflicts — state the CLI Reference value and flag it:** `handoff-sta-thresh`
   default (guide: 55; CLI Reference 7.6.3: 0), IPsec data-channel keyword (guide:
   `ipsec-vpn-sn`; CLI Reference: `ipsec-sn-vpn`), `auto-power-level` default (CLI
   text says enable, default column says disable), VLAN pool "round robin" description
   (least busy VLAN vs next VLAN). Check each on a lab unit before writing a question
   that depends on it.
6. **Exhibit names.** Controller `FGT-HQ` (FortiGate) or `FWF-Branch` (FortiWiFi);
   APs by serial-like names `FP231FTF20000001`, `FP431GTF20000002` or friendly names
   `AP-Lobby`, `AP-Floor2`; FortiAP profiles `FAP231F-office`, `FAP431G-hd`; SSIDs
   (interface/VAP name → broadcast SSID) `corp-wlan` → `Corp`, `guest-wlan` →
   `Guest`, `iot-wlan` → `IoT`; AP management network `10.10.10.0/24` on `port5`,
   tunnel SSIDs `10.20.x.0/24`, VLANs 100/200/300; RADIUS server `RADIUS-NPS` at
   `10.0.1.20` (or FortiAuthenticator `FAC-HQ`); client MACs from the locally
   administered range (e.g. `02:1a:2b:3c:4d:5e`); rogue BSSIDs any realistic OUI
   but never a real customer's. Public IPs from RFC 5737 only.
7. **Lab reality.** FortiAP features need hardware: a FortiAP (or FortiWiFi), ideally
   with a PoE switch or injector. The owner's free lab is the **FortiGate-VM permanent
   trial** (7.6.x): 1 vCPU / 2 GB, max 3 interfaces / 3 firewall policies / 3 routes,
   low encryption only, no FortiGuard. **Unverified:** whether the trial VM shows the
   WiFi & Switch Controller menus and lets you authorize a real FortiAP (check System >
   Feature Visibility and the VM's FortiAP limit on a real VM before promising it). It
   is safe to say the VM lets you practise the controller-side CLI (`config
   wireless-controller vap`, `wtp-profile`, `wids-profile`, `nac-profile`, `setting`),
   SSID interfaces, DHCP scopes and firewall policies for SSIDs. Radio behaviour,
   CAPWAP joins, rogue detection, client debugs and FortiAIOps need real APs or
   Fortinet's paid on-demand labs; label such lab steps clearly. FortiAIOps 3.2 runs
   as a VM (VMware ESXi 7.0.3+, Hyper-V or KVM; see the guide's pre-installation
   requirements for sizing) and needs a licence — treat it as read-and-understand,
   not lab.

Validate with `node scripts/validate-content.mjs <domain>` until it prints OK.
