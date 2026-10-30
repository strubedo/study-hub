// Domain 4 — Monitoring and troubleshooting question bank. FortiOS 7.6 / FortiSwitchOS 7.6.
// Exhibits follow the layouts shown in the FortiLink Guide 7.6.1 (get-conn-status, get-upgrade-status,
// port-stats, mclag icl), the FortiSwitchOS 7.6.1 Administration Guide (cable-diag, modules status,
// sniffer-profile) and the FortiOS 7.6 sample logs. Names, serials and addresses are fictional.
export default [
  // ------------------------------------------------------------------ 4.1 Packet capture and mirroring
  {
    id: "d4-001",
    topic: "4.1",
    type: "single",
    difficulty: 2,
    stem: "Refer to the exhibit. FSW-Access2 has serial number S124EN5918000105. Which traffic does FSW-Access2 copy toward the FortiGate?",
    exhibit: String.raw`FGT-HQ # show switch-controller traffic-sniffer
config switch-controller traffic-sniffer
    set mode rspan
    config target-port
        edit "S124EN5918000105"
            set in-ports "port7"
            set out-ports "port12"
        next
    end
end`,
    options: [
      "Frames received on port7 and frames transmitted out of port12",
      "Frames transmitted out of port7 and frames received on port12",
      "All frames received and transmitted on both port7 and port12",
      "Only frames that enter port7 and leave the switch through port12",
    ],
    answer: [0],
    explanation: "In the traffic sniffer, `in-ports` selects traffic sent **to** the listed ports (the ingress source ports; the one-arm sniffer procedure calls them the ingress ports for mirroring) and `out-ports` selects traffic sent **from** the listed ports (egress). So port7 is mirrored in the receive direction and port12 in the transmit direction, and the copies go to the FortiGate in the RSPAN VLAN.\n\n- Swapping the directions reverses the meaning of the two keywords.\n- Neither port is mirrored in both directions; that would need the port in both lists.\n- The targets are independent: any match is mirrored. The sniffer doesn't require a frame to match both ports.",
    lesson: "4.1-mirroring-one-arm-sniffer",
  },
  {
    id: "d4-002",
    topic: "4.1",
    type: "single",
    difficulty: 2,
    stem: "Refer to the exhibit. A technician's laptop on port20 of FSW-Access1 runs a packet analyzer and sees the port5 traffic. However, the laptop cannot reach the FortiGate GUI through port20 while the mirror is active. Which change lets the laptop keep normal network access while it captures?",
    exhibit: String.raw`FGT-HQ # show switch-controller managed-switch FSW-Access1
config switch-controller managed-switch
    edit "FSW-Access1"
        ...
        config mirror
            edit "pc-debug"
                set status active
                set dst "port20"
                set switching-packet disable
                set src-ingress "port5"
                set src-egress "port5"
            next
        end
    next
end`,
    options: [
      "Set switching-packet to enable in the pc-debug mirror",
      "Set status to inactive in the pc-debug mirror",
      "Add port20 to src-ingress so that its own traffic is mirrored too",
      "Change config switch-controller traffic-sniffer to mode rspan",
    ],
    answer: [0],
    explanation: "`switching-packet enable` lets the mirror destination port keep switching normal traffic. Fortinet suggests it exactly for this case: a laptop that runs a sniffer and also needs network access (for example to the management GUI). With it disabled, the destination port only receives mirrored copies.\n\n- Setting the mirror `inactive` restores access but stops the capture.\n- A mirror destination can't also be a mirror source.\n- RSPAN sends the copies to the FortiGate instead of the laptop; it doesn't fix the destination port behaviour.",
    lesson: "4.1-mirroring-one-arm-sniffer",
  },
  {
    id: "d4-003",
    topic: "4.1",
    type: "single",
    difficulty: 3,
    stem: "Refer to the exhibit. The ERSPAN collector 10.10.99.30 is a server in VLAN 99 (interface vlan99-mgmt, 10.10.99.0/24). It receives no mirrored traffic. FSW-Access1 (serial S124EN5918000103) is Authorized/Up, and a ping from the FSW-Access1 CLI to 10.10.99.30 fails. The FortiGate has only two firewall policies, both from user VLANs to wan1. What is the most likely fix?",
    exhibit: String.raw`FGT-HQ # show switch-controller traffic-sniffer
config switch-controller traffic-sniffer
    set mode erspan-auto
    set erspan-ip 10.10.99.30
    config target-port
        edit "S124EN5918000103"
            set in-ports "port3"
        next
    end
end`,
    options: [
      "Add a firewall policy that allows traffic from the fortilink interface to vlan99-mgmt so that the switch can reach the collector",
      "Change the mode to rspan, because ERSPAN cannot leave the FortiLink network",
      "Set erspan-ip to the FortiLink interface address 10.255.1.1",
      "Add set out-ports port3 so that traffic is mirrored in both directions",
    ],
    answer: [0],
    explanation: "ERSPAN sends GRE-encapsulated copies to the collector IP, and the collector must be reachable from the switch with IPv4 ping. The FortiLink Guide notes that a firewall policy might be required on the FortiGate: the managed switch reaches other subnets through the FortiGate, and with no policy from the FortiLink side to vlan99-mgmt, both the ping and the ERSPAN traffic are dropped.\n\n- ERSPAN is designed to cross layer-3 boundaries; RSPAN is the layer-2 option.\n- Pointing ERSPAN at the FortiLink address sends the copies to the FortiGate, not to the collector.\n- Adding egress mirroring changes what is copied, not whether the copies arrive.",
    lesson: "4.1-mirroring-one-arm-sniffer",
  },
  {
    id: "d4-004",
    topic: "4.1",
    type: "single",
    difficulty: 1,
    stem: "An administrator configures the switch-controller traffic sniffer in RSPAN mode for a managed FortiSwitch. Where does the administrator capture and download the mirrored packets?",
    options: [
      "On the FortiGate, in Network > Diagnostics > Packet Capture, capturing on the rspan VLAN interface",
      "On the FortiGate, in Log & Report > Sniffer Traffic",
      "On the managed FortiSwitch GUI, in System > Packet Capture, on the mirror destination port",
      "On the FortiGate, in WiFi & Switch Controller > FortiSwitch Ports > View Statistics",
    ],
    answer: [0],
    explanation: "In RSPAN mode the copies are carried in VLAN 4092 to the FortiGate. The FortiLink Guide says to capture them in **Network > Diagnostics > Packet Capture** on the **rspan** VLAN, where they can also be downloaded as a PCAP file.\n\n- Sniffer Traffic logs exist only when the one-arm sniffer inspects the mirrored traffic; they are logs, not packets.\n- The switch-side packet-capture profile is a different tool, and in FortiLink mode the RSPAN destination is chosen automatically.\n- View Statistics shows counters, not packets.",
    lesson: "4.1-mirroring-one-arm-sniffer",
  },
  {
    id: "d4-005",
    topic: "4.1",
    type: "multi",
    difficulty: 2,
    stem: "Refer to the exhibit. The traffic sniffer already mirrors port6 of a managed switch in RSPAN mode. Which two statements about this configuration are true? (Choose two.)",
    exhibit: String.raw`config system interface
    edit "rspan"
        set ips-sniffer-mode enable
    next
end
config firewall sniffer
    edit 1
        set logtraffic all
        set interface "rspan"
        set ips-sensor-status enable
        set ips-sensor "sniffer-profile"
    next
end`,
    options: [
      "IPS matches in the mirrored traffic are logged, and the original traffic is not blocked",
      "Antivirus scanning is not applied to the mirrored traffic",
      "Traffic that matches an IPS signature is dropped on the FortiSwitch port",
      "A firewall policy with rspan as the destination interface is required before anything is inspected",
      "This feature requires FortiOS 8.0 and FortiSwitchOS 8.0",
    ],
    answer: [0, 1],
    explanation: "This is the FortiOS one-arm sniffer (FortiOS 7.4.1 / FortiSwitchOS 7.4.1 and later). It works as an IDS: matches against the enabled profiles are logged, and sniffing does not deny or influence the real traffic. In `config firewall sniffer`, every security profile is **disabled by default**, and only `ips-sensor-status` is enabled here, so no antivirus scanning happens.\n\n- Nothing is blocked; the sniffer only reports.\n- The inspection is defined by the `config firewall sniffer` entry, not by a regular firewall policy.\n- The feature exists since FortiOS 7.4.1.",
    lesson: "4.1-mirroring-one-arm-sniffer",
  },
  {
    id: "d4-006",
    topic: "4.1",
    type: "single",
    difficulty: 2,
    stem: "Refer to the exhibit. Why do both srcintf and dstintf show rspan in this log entry?",
    exhibit: String.raw`FGT-HQ # execute log display
1: date=2026-10-30 time=10:12:44 eventtime=1793380364118274000 tz="-0700" logid="0004000017" type="traffic" subtype="sniffer" level="notice" vd="root" srcip=10.10.10.25 srcport=51544 srcintf="rspan" srcintfrole="undefined" dstip=203.0.113.80 dstport=443 dstintf="rspan" dstintfrole="undefined" sessionid=5521 proto=6 action="accept" policyid=1 policytype="sniffer" service="HTTPS" duration=180 sentbyte=5321 rcvdbyte=0 sentpkt=9 rcvdpkt=0`,
    options: [
      "It is a one-arm sniffer log for a mirrored copy received on the rspan interface; it records what the sniffer saw, not a forwarding decision",
      "The FortiGate hairpinned the session back out of the interface it arrived on because no route to 203.0.113.80 exists",
      "Firewall policy 1 allowed the session from the rspan VLAN to the Internet with SNAT",
      "The FortiSwitch dropped the session and reported it to the FortiGate through the rspan VLAN",
    ],
    answer: [0],
    explanation: "`subtype=\"sniffer\"` and `policytype=\"sniffer\"` identify a log from the FortiOS one-arm sniffer (policy 1 is the `config firewall sniffer` entry). The sniffer receives mirrored copies on the RSPAN VLAN interface, so both interface fields name that interface. The sniffer only reports; it doesn't forward or block the copy, and the real session took its own path.\n\n- A hairpinned or Internet-bound session would be a forward traffic log with a real egress interface.\n- The FortiSwitch doesn't drop traffic because of the sniffer, and switch events don't appear as traffic logs.",
    lesson: "4.1-mirroring-one-arm-sniffer",
  },
  {
    id: "d4-007",
    topic: "4.1",
    type: "single",
    difficulty: 2,
    stem: "Refer to the exhibit. The last command does not delete the capture file. Why?",
    exhibit: String.raw`FSW-Lab # config system sniffer-profile
FSW-Lab (sniffer-profile) # edit dhcp-port5
FSW-Lab (dhcp-port5) # set switch-interface port5
FSW-Lab (dhcp-port5) # set filter "udp and port 67"
FSW-Lab (dhcp-port5) # set max-pkt-count 200
FSW-Lab (dhcp-port5) # end
FSW-Lab # execute system sniffer-profile start dhcp-port5
FSW-Lab # execute system sniffer-profile pause dhcp-port5
FSW-Lab # execute system sniffer-profile delete-capture dhcp-port5`,
    options: [
      "A capture can be deleted only after it is stopped, and this one is paused",
      "The capture must be uploaded to an FTP or TFTP server before it can be deleted",
      "delete-capture needs the .pcap file name, not the profile name",
      "Captures on a switch interface can be deleted only from the GUI",
    ],
    answer: [0],
    explanation: "The FortiSwitchOS guide states that the .pcap can be deleted only after the packet capture is **stopped**; it can't be deleted while the capture is running or paused. Run `execute system sniffer-profile stop dhcp-port5` first.\n\n- Uploading is optional.\n- `delete-capture` takes the profile name (`execute system sniffer-profile delete-capture <profile_name>`).\n- The CLI and the GUI can both delete captures.",
    lesson: "4.1-packet-capture",
  },
  {
    id: "d4-008",
    topic: "4.1",
    type: "order",
    difficulty: 1,
    stem: "Place the FortiSwitchOS packet-capture tasks in the documented order, from first to last.",
    items: [
      "Create a profile under config system sniffer-profile with an interface, filter and packet limits",
      "Run execute system sniffer-profile start <profile>",
      "Run execute system sniffer-profile stop <profile>",
      "Run execute system sniffer-profile upload tftp <profile> <file.pcap> <server>",
      "Run execute system sniffer-profile delete-capture <profile>",
    ],
    explanation: "The FortiSwitchOS workflow is: create the packet-capture profile, start the capture, pause or stop it, display it (`get system sniffer-profile capture`) or upload the .pcap to FTP/TFTP, and finally delete the capture file. Deleting is possible only once the capture is stopped, and every .pcap is lost at power cycle, so upload before rebooting.",
    lesson: "4.1-packet-capture",
  },
  {
    id: "d4-009",
    topic: "4.1",
    type: "fill",
    difficulty: 2,
    stem: "On a standalone FortiSwitch, which CLI command displays the parsed packets captured by the packet-capture profile named dhcp-port5? Type the full command.",
    answer: [
      "get system sniffer-profile capture dhcp-port5",
      "get system sniffer-profile capture",
    ],
    explanation: "`get system sniffer-profile capture <profile_name>` prints the parsed capture on the CLI. To analyze the file elsewhere, use `execute system sniffer-profile upload {ftp | tftp} <profile> <file.pcap> <server>`.",
    lesson: "4.1-packet-capture",
  },
  {
    id: "d4-010",
    topic: "4.1",
    type: "single",
    difficulty: 1,
    stem: "A technician ran a packet-capture profile on a FortiSwitch 248E, stopped the capture, and planned to upload the .pcap file the next morning. Overnight the switch lost power and restarted. What happened to the capture?",
    options: [
      "It was deleted, because all packet-capture files are deleted when the switch is power cycled",
      "It is still on the switch, because stopped captures are moved to flash",
      "It was uploaded to the FortiGate automatically before the switch went down",
      "It is still on the switch, but the profile must be started again to read it",
    ],
    answer: [0],
    explanation: "Packet captures are kept on a RAM disk (50 MB on 2xx models), and the FortiSwitchOS guide states that all .pcap files are deleted when you power cycle the switch. Upload important captures right after stopping them.\n\n- Nothing moves captures to flash.\n- There is no automatic upload to the FortiGate.",
    lesson: "4.1-packet-capture",
  },
  {
    id: "d4-011",
    topic: "4.1",
    type: "single",
    difficulty: 2,
    stem: "Refer to the exhibit. PC1 (10.10.10.25, FSW-Access1 port5) and PC2 (10.10.10.26, FSW-Access1 port6) are both in VLAN 10 and are copying files between each other successfully. The FortiGate sniffer captures nothing. What explains this, and how can the administrator capture the traffic?",
    exhibit: String.raw`FGT-HQ # diagnose sniffer packet vlan10-data 'host 10.10.10.25 and host 10.10.10.26' 4 0 l
interfaces=[vlan10-data]
filters=[host 10.10.10.25 and host 10.10.10.26]
^C
0 packets received by filter
0 packets dropped by kernel`,
    options: [
      "Same-VLAN traffic is switched by FSW-Access1 and never reaches the FortiGate; mirror port5 or port6 (SPAN to a local analyzer or RSPAN to the FortiGate)",
      "diagnose sniffer packet cannot capture on FortiLink VLAN interfaces; sniff the fortilink interface instead",
      "Verbosity 4 does not show intra-VLAN packets; use verbosity 6",
      "Intra-VLAN traffic blocking is enabled on VLAN 10, so the FortiGate drops the packets before the sniffer sees them",
    ],
    answer: [0],
    explanation: "Traffic between two hosts in the same VLAN on the same switch is forwarded by the FortiSwitch hardware, so it never crosses the FortiLink to the FortiGate. To see it, copy it with port mirroring: SPAN to a local analyzer port, or RSPAN to the FortiGate and capture on the rspan interface.\n\n- The FortiGate can sniff FortiLink VLAN interfaces; it just has nothing to see here.\n- Verbosity changes how much of each packet is printed, not which packets match.\n- The transfer is working, so the traffic isn't being blocked.",
    lesson: "4.1-packet-capture",
  },
  {
    id: "d4-012",
    topic: "4.1",
    type: "match",
    difficulty: 2,
    stem: "Match each FortiSwitchOS mirror mode (config switch mirror) with its description.",
    pairs: [
      ["SPAN", "Copies traffic to a local destination port without encapsulation"],
      ["RSPAN", "Adds a VLAN header (encap-vlan-id) so the copies can cross layer-2 switches"],
      ["ERSPAN-auto", "Builds the GRE and IPv4 headers automatically; you only give the collector IP"],
      ["ERSPAN-manual", "You set the destination port and the MAC and IPv4 header values yourself"],
    ],
    explanation: "- **SPAN**: supported on all FortiSwitch models; mirrors to a destination interface without encapsulation.\n- **RSPAN**: encapsulates the copies in a VLAN (`encap-vlan-id`, `encap-vlan-tpid` default 0x8100).\n- **ERSPAN-auto**: header contents are automatic; you can't choose a destination interface, only `erspan-collector-ip`.\n- **ERSPAN-manual**: you set `dst`, `encap-ipv4-src`, `encap-mac-src` and `encap-mac-dst` (the next hop toward the collector).",
    lesson: "4.1-mirroring-one-arm-sniffer",
  },
  {
    id: "d4-013",
    topic: "4.1",
    type: "multi",
    difficulty: 2,
    stem: "Refer to the exhibit. Which two statements about this mirroring configuration are true? (Choose two.)",
    exhibit: String.raw`config switch-controller traffic-sniffer
    set mode erspan-auto
    set erspan-ip 10.10.99.30
    config target-ip
        edit 10.10.20.50
        next
    end
end`,
    options: [
      "The mirrored frames are encapsulated in Ethernet, IPv4 and GRE headers",
      "The managed switches must be able to ping 10.10.99.30",
      "The copies are carried in VLAN 4092 and captured on the rspan interface",
      "A port-based SPAN mirror can be active at the same time on the same switch",
      "The administrator must set the destination port that leads toward the collector",
    ],
    answer: [0, 1],
    explanation: "In ERSPAN mode the copies get Ethernet, IPv4 and GRE headers and go to the collector address; the collector must be reachable from the FortiSwitch with IPv4 ping (a firewall policy may be needed). If no collector IP is set, nothing is mirrored.\n\n- VLAN 4092 and the rspan interface are the RSPAN mechanism.\n- ERSPAN can't be used together with SPAN or RSPAN, and only one ERSPAN session is possible.\n- In FortiLink mode the destination is chosen automatically; `traffic-sniffer` has no destination setting.",
    lesson: "4.1-mirroring-one-arm-sniffer",
  },
  {
    id: "d4-014",
    topic: "4.1",
    type: "fill",
    difficulty: 1,
    stem: "In FortiLink mode, which VLAN ID carries RSPAN-mirrored traffic from the managed FortiSwitch toward the FortiGate? Type the number.",
    answer: ["4092"],
    explanation: "The FortiLink Guide states that in RSPAN mode traffic is encapsulated in **VLAN 4092** and sent toward the FortiGate, where it can be captured on the rspan VLAN interface. (VLAN 4094 is the default FortiLink management VLAN.)",
    lesson: "4.1-mirroring-one-arm-sniffer",
  },

  // ------------------------------------------------------------------ 4.2 FortiLink troubleshooting
  {
    id: "d4-015",
    topic: "4.2",
    type: "single",
    difficulty: 2,
    stem: "Refer to the exhibit. A new FortiSwitch was cabled to a free port on FSW-Access1 ten minutes ago. What must the administrator do so that the FortiGate manages it?",
    exhibit: String.raw`FGT-HQ # execute switch-controller get-conn-status
Managed-devices in current vdom root:
FortiLink interface : fortilink
SWITCH-ID         VERSION           STATUS         FLAG   ADDRESS        JOIN-TIME                   SERIAL
FSW-Core1         v7.6.1 (1047)     Authorized/Up   2    10.255.1.2      Thu Oct 30 07:58:12 2026    S248EPTF18000101
FSW-Core2         v7.6.1 (1047)     Authorized/Up   2    10.255.1.3      Thu Oct 30 07:58:20 2026    S248EPTF18000102
FSW-Access1       v7.6.1 (1047)     Authorized/Up   2    10.255.1.4      Thu Oct 30 08:03:41 2026    S124EN5918000103
S124EN5918000106  N/A               Discovered/Down 2                    N/A                         S124EN5918000106
Flags: C=config sync, U=upgrading, S=staged, D=delayed reboot pending, E=config sync error, 2=L2, 3=L3, V=VXLAN, T=tunnel, X=External
Managed-Switches: 4 (UP: 3 DOWN: 1 MAX: 32)`,
    options: [
      "Authorize the switch, for example with set fsw-wan1-admin enable under its managed-switch entry",
      "Run execute factoryreset on the new switch and reconnect it",
      "Upgrade the new switch to FortiSwitchOS 7.6.1 before it can join",
      "Run diagnose switch-controller trigger config-sync S124EN5918000106",
    ],
    answer: [0],
    explanation: "`Discovered/Down` means the FortiGate has detected the switch over FortiLink but it is **not authorized**, which happens when automatic authorization (`auto-auth-extension-device`) is disabled on the FortiLink interface. Authorize it in **WiFi & Switch Controller > Managed FortiSwitches** or with `config switch-controller managed-switch` → `edit S124EN5918000106` → `set fsw-wan1-admin enable`.\n\n- A factory reset is for switches that don't show up at all; this one was already discovered.\n- Its version shows N/A because it never joined; nothing shows a firmware problem.\n- Config sync applies to managed (authorized) switches.",
    lesson: "4.2-fortilink-status-discovery",
  },
  {
    id: "d4-016",
    topic: "4.2",
    type: "multi",
    difficulty: 2,
    stem: "Refer to the exhibit. Which two statements are true? (Choose two.)",
    exhibit: String.raw`FGT-HQ # execute switch-controller get-conn-status
Managed-devices in current vdom root:
FortiLink interface : fortilink
SWITCH-ID         VERSION           STATUS         FLAG   ADDRESS        JOIN-TIME                   SERIAL
FSW-Core1         v7.6.1 (1047)     Authorized/Up   2    10.255.1.2      Thu Oct 30 07:58:12 2026    S248EPTF18000101
FSW-Core2         v7.6.1 (1047)     Authorized/Up   2    10.255.1.3      Thu Oct 30 07:58:20 2026    S248EPTF18000102
FSW-Access1       v7.6.1 (1047)     Authorized/Up   2E   10.255.1.4      Thu Oct 30 08:03:41 2026    S124EN5918000103
FSW-Access3       v7.6.1 (1047)     Authorized/Up   3    10.20.5.10      Thu Oct 30 08:10:02 2026    S248EPTF18000107
Flags: C=config sync, U=upgrading, S=staged, D=delayed reboot pending, E=config sync error, 2=L2, 3=L3, V=VXLAN, T=tunnel, X=External
Managed-Switches: 4 (UP: 4 DOWN: 0 MAX: 32)`,
    options: [
      "FSW-Access1 has a configuration synchronization error",
      "FSW-Access3 is managed over a layer-3 network",
      "FSW-Access1 is waiting for a delayed reboot",
      "FSW-Access3 has been discovered but is not authorized yet",
      "This FortiGate cannot manage more than four FortiSwitch units",
    ],
    answer: [0, 1],
    explanation: "The FLAG column uses the legend under the table: **E** = config sync error (FSW-Access1) and **3** = L3, so FSW-Access3 is managed over a layer-3 network (its address is outside the FortiLink subnet, as expected).\n\n- A delayed reboot would show **D**.\n- FSW-Access3's STATUS is `Authorized/Up`.\n- The summary line shows 4 managed switches and **MAX: 32**, the model's limit.",
    lesson: "4.2-fortilink-status-discovery",
  },
  {
    id: "d4-017",
    topic: "4.2",
    type: "single",
    difficulty: 2,
    stem: "Refer to the exhibit. Two weeks after this session on the FSW-Access1 console, the switch restarted after a power outage, and port10 is back in VLAN 10 (vlan10-data). FSW-Access1 is a managed switch. Why?",
    exhibit: String.raw`FSW-Access1 # config switch interface
FSW-Access1 (interface) # edit port10
FSW-Access1 (port10) # set native-vlan 30
FSW-Access1 (port10) # end`,
    options: [
      "Changes made directly on a managed switch are unknown to the FortiGate and are lost when the switch restarts; the VLAN must be set on the FortiGate",
      "VLAN 30 does not exist on FSW-Access1, so the switch ignored the command at boot",
      "The power outage returned FSW-Access1 to its factory default configuration",
      "Native VLAN changes on FortiSwitchOS take effect only until the next MAC-sync interval",
    ],
    answer: [0],
    explanation: "In FortiLink mode the FortiGate owns the switch configuration. Fortinet warns that changes made directly on a managed FortiSwitch are unknown to the FortiGate and are lost when the switch restarts. Configure the port under `config switch-controller managed-switch` → `edit FSW-Access1` → `config ports` → `edit port10` → `set vlan vlan30-guest` (or in the FortiSwitch Ports GUI page).\n\n- The command was accepted; the problem is who owns the configuration.\n- A restart doesn't factory-reset a switch; it came back as a managed switch with the FortiGate's configuration.\n- The MAC sync interval controls MAC table synchronization, not port configuration.",
    lesson: "4.2-sync-topology-firmware",
  },
  {
    id: "d4-018",
    topic: "4.2",
    type: "single",
    difficulty: 2,
    stem: "Refer to the exhibit. What is the state of the three switches?",
    exhibit: String.raw`FGT-HQ # execute switch-controller switch-action restart delay all
Delayed restart operation is requested for FortiSwitch S124EN5918000103 ...
Delayed restart operation is requested for FortiSwitch S124EN5918000105 ...
Delayed restart operation is requested for FortiSwitch S248EPTF18000107 ...

FGT-HQ # execute switch-controller get-conn-status
Managed-devices in current vdom root:
FortiLink interface : fortilink
SWITCH-ID         VERSION           STATUS         FLAG   ADDRESS        JOIN-TIME                   SERIAL
FSW-Access1       v7.6.1 ()         Authorized/Down 2D   0.0.0.0         N/A                         S124EN5918000103
FSW-Access2       v7.6.1 ()         Authorized/Down 2D   0.0.0.0         N/A                         S124EN5918000105
FSW-Access3       v7.6.1 ()         Authorized/Down 2D   0.0.0.0         N/A                         S248EPTF18000107
Flags: C=config sync, U=upgrading, S=staged, D=delayed reboot pending, E=config sync error, 2=L2, 3=L3, V=VXLAN, T=tunnel, X=External
Managed-Switches: 3 (UP: 0 DOWN: 3 MAX: 32)`,
    options: [
      "They are rebooting after the delayed restart request; wait and check again until they return to Authorized/Up",
      "They lost their authorization and must be authorized again",
      "They have configuration sync errors and need diagnose switch-controller trigger config-sync",
      "Their firmware is incompatible, and the upgrade must be cancelled with switch-software cancel",
    ],
    answer: [0],
    explanation: "`restart delay all` restarts all managed switches after a two-minute delay. The **D** flag means a delayed reboot is pending, and while the switches restart they show `Authorized/Down` with address 0.0.0.0 and no join time. They stay authorized; once back, they return to `Authorized/Up`.\n\n- Deauthorized switches wouldn't show `Authorized`.\n- A sync error is flag **E**.\n- Nothing indicates an upgrade or incompatibility.",
    lesson: "4.2-sync-topology-firmware",
  },
  {
    id: "d4-019",
    topic: "4.2",
    type: "single",
    difficulty: 3,
    stem: "Refer to the exhibit. The administrator staged FortiSwitchOS 7.6.1 on all FS-124E switches. Which statement is correct?",
    exhibit: String.raw`FGT-HQ # execute switch-controller get-upgrade-status
Device    Running-version                                Status      Next-boot
========================================================================================
VDOM : root
S124EN5918000103  S124EN-v7.4.4-build0861,240611 (GA)            (37/0/0)   S124EN-v7.6-build1047      (Staging)
S124EN5918000105  S124EN-v7.4.4-build0861,240611 (GA)            (0/100/100)   S124EN-v7.6-build1047    (Idle)`,
    options: [
      "S124EN5918000105 has the new image staged and will run it after its next restart; S124EN5918000103 is still downloading the image",
      "Both switches are already running build 1047",
      "S124EN5918000103 failed to stage the image and must be upgraded manually",
      "Both switches restart automatically as soon as staging is complete",
    ],
    answer: [0],
    explanation: "The Status triplet is download % / erase % / save %. `(37/0/0)` with `(Staging)` means the image is still downloading to S124EN5918000103. `(0/100/100)` with Next-boot showing build 1047 and `(Idle)` means S124EN5918000105 has written the image and waits for a restart, for example `execute switch-controller switch-action restart delay all`.\n\n- Running-version still shows 7.4.4 build 0861 on both.\n- Staging in progress is not a failure.\n- Staging doesn't restart switches; the documented procedure restarts them afterwards.",
    lesson: "4.2-sync-topology-firmware",
  },
  {
    id: "d4-020",
    topic: "4.2",
    type: "order",
    difficulty: 2,
    stem: "Place the steps of a staged FortiSwitch firmware upgrade from the FortiGate CLI in order, from first to last.",
    items: [
      "execute switch-controller switch-software upload tftp <image_file> <tftp_server>",
      "execute switch-controller switch-software list-available",
      "execute switch-controller switch-software stage all <image_name>",
      "execute switch-controller get-upgrade-status (until Next-boot shows the new build and Idle)",
      "execute switch-controller switch-action restart delay all",
      "execute switch-controller get-conn-status (confirm the new version and Authorized/Up)",
    ],
    explanation: "This follows the FortiLink Guide's stacked/tiered upgrade procedure: upload each model's image to the FortiGate, verify it with `list-available`, stage it (`stage all` stages it on every compatible switch), watch `get-upgrade-status` until staging is complete, restart (here after the 2-minute delay), and verify the result with `get-upgrade-status` and `get-conn-status`.",
    lesson: "4.2-sync-topology-firmware",
  },
  {
    id: "d4-021",
    topic: "4.2",
    type: "order",
    difficulty: 3,
    stem: "Place the steps of the recommended MCLAG peer firmware upgrade in order, from first to last.",
    items: [
      "Disable MCLAG split-brain protection on both peers if it is enabled",
      "Run diagnose switch mclag icl to find the peer with the lower MAC address",
      "Stage the new image on both switches",
      "Restart the switch with the lower MAC address",
      "Wait until that switch is back and its links are up",
      "Restart the other switch",
      "Re-enable split-brain protection if it was enabled before",
    ],
    explanation: "Fortinet's procedure minimizes downtime (expected impact within about 20 seconds): disable split-brain protection, identify the lower-MAC peer with `diagnose switch mclag icl`, stage the image on both, restart the lower-MAC switch first, wait for it and its links (LACP trunks can be down for a moment), restart the other switch, then re-enable split-brain protection.",
    lesson: "4.2-sync-topology-firmware",
  },
  {
    id: "d4-022",
    topic: "4.2",
    type: "single",
    difficulty: 3,
    stem: "Refer to the exhibit, taken on FSW-Core1 (serial S248EPTF18000101). FSW-Core2 is its MCLAG peer. Following the recommended MCLAG upgrade procedure, which switch should be restarted first after the image is staged on both?",
    exhibit: String.raw`FSW-Core1 # diagnose switch mclag icl
_FlInK1_ICL0_
icl-ports            49-50
egress-block-ports   1-4,51-52
interface-mac        70:4c:a5:12:34:81
local-serial-number  S248EPTF18000101
peer-mac             70:4c:a5:12:34:01
peer-serial-number   S248EPTF18000102
Local uptime         12 days 3h:40m:11s
Peer uptime          12 days 3h:40m:02s
MCLAG-STP-mac        70:4c:a5:12:34:00
keepalive interval   1
keepalive timeout    60
dormant candidate    Local
split-brain          Disabled`,
    options: [
      "FSW-Core2, because its MAC address (peer-mac) is lower",
      "FSW-Core1, because the command was run on it",
      "FSW-Core1, because it has the longer uptime",
      "Both at the same time, because split-brain protection is disabled",
    ],
    answer: [0],
    explanation: "The procedure restarts the switch with the **lower MAC address** first. `interface-mac` is the local switch (…:34:81) and `peer-mac` is FSW-Core2 (…:34:01), so FSW-Core2 has the lower MAC and goes first. After it is back with its links up, restart FSW-Core1.\n\n- Where the command was run doesn't matter.\n- Uptime isn't part of the rule.\n- Restarting both together takes down the whole MCLAG; split-brain protection is disabled for the upgrade on purpose, not as a reason to restart both.",
    lesson: "4.2-sync-topology-firmware",
  },
  {
    id: "d4-023",
    topic: "4.2",
    type: "single",
    difficulty: 3,
    stem: "A new FortiGate running FortiOS 7.6.1 uses the default FortiLink interface settings. The FortiLink aggregate has two members, port9 to FSW-Core1 and port10 to FSW-Core2, with the FortiLink split interface enabled and no MCLAG. The administrator notices that port10 shows link up even though only one link should be active. What explains this?",
    options: [
      "FortiOS 7.6.1 uses LLDP neighbor detection by default; with LLDP the standby link of a split interface stays up but LACP is inactive on it",
      "The split interface failed and both links now forward traffic, creating a loop",
      "FSW-Core1 and FSW-Core2 automatically formed an MCLAG, which disabled the split interface",
      "port10 was converted to an HA heartbeat port, which always shows link up",
    ],
    answer: [0],
    explanation: "Starting in FortiOS 7.6.1 the default `fortilink-neighbor-detect` is `lldp` (earlier releases used `fortilink`). The FortiLink Guide states that with the split interface enabled, `fortilink` detection leaves the standby link down, while `lldp` detection leaves it up with LACP inactive. Only one link is used either way.\n\n- An up link with LACP inactive doesn't forward FortiLink traffic, so there is no loop.\n- MCLAG to the FortiGate is formed deliberately (ICL profile, then the split interface is disabled); it isn't automatic.\n- FortiLink can't use HA ports.",
    lesson: "4.2-fortilink-status-discovery",
  },
  {
    id: "d4-024",
    topic: "4.2",
    type: "single",
    difficulty: 2,
    stem: "Refer to the exhibit. Factory-default FortiSwitch units cabled to port9 and port10 are not detected by the FortiGate. Which change should the administrator make?",
    exhibit: String.raw`FGT-HQ # show system interface fortilink
config system interface
    edit "fortilink"
        set vdom "root"
        set fortilink enable
        set ip 10.255.1.1 255.255.255.0
        set allowaccess ping fabric
        set type aggregate
        set member "port9" "port10"
        set lldp-reception disable
        set lldp-transmission enable
        set fortilink-neighbor-detect lldp
        set auto-auth-extension-device enable
    next
end`,
    options: [
      "Enable lldp-reception on the fortilink interface",
      "Disable auto-auth-extension-device so that the switches can be authorized manually",
      "Disable fortilink-split-interface",
      "Add https to allowaccess on the fortilink interface",
    ],
    answer: [0],
    explanation: "The interface uses LLDP for FortiLink neighbor detection, and the FortiLink Guide says that LLDP detection needs both LLDP reception and LLDP transmission enabled on the FortiLink interface. Reception is disabled here, so the FortiGate can't learn its LLDP neighbors.\n\n- Manual authorization only matters after a switch is discovered.\n- The split interface controls how many links are active, not detection.\n- Management access settings on the FortiGate interface don't affect discovery.",
    lesson: "4.2-fortilink-status-discovery",
  },
  {
    id: "d4-025",
    topic: "4.2",
    type: "multi",
    difficulty: 2,
    stem: "Which two conditions prevent a FortiGate from discovering a factory-default FortiSwitch through FortiLink? (Choose two.)",
    options: [
      "The FortiGate (or its VDOM) is running in transparent mode",
      "The only FortiLink interface member is the FortiGate's dedicated HA port",
      "Automatic authorization is disabled on the FortiLink interface",
      "The FortiLink split interface is enabled",
      "The switch-controller management VLAN is left at its default of 4094",
    ],
    answer: [0, 1],
    explanation: "FortiLink is **not supported in transparent mode**, and FortiLink is supported on all Ethernet ports **except HA and MGMT** ports.\n\n- With automatic authorization disabled the switch is still discovered; it just stays `Discovered/Down` until you authorize it.\n- The split interface is enabled by default and is a normal setting.\n- VLAN 4094 is the default FortiLink management VLAN.",
    lesson: "4.2-fortilink-status-discovery",
  },
  {
    id: "d4-026",
    topic: "4.2",
    type: "single",
    difficulty: 3,
    stem: "Refer to the exhibit. FSW-Access3, a new switch, is connected to port49 of FSW-Access1. An ISL forms between them, but users connected to FSW-Access3 have no connectivity in any user VLAN. What is the most likely explanation?",
    exhibit: String.raw`config switch-controller lldp-profile
    edit "secure-isl"
        set auto-isl-auth relax
        set auto-isl-auth-user "Fortinet_Factory"
        set auto-isl-auth-identity "fortilink"
        set auto-isl-auth-encrypt mixed
    next
end
config switch-controller managed-switch
    edit "FSW-Access1"
        config ports
            edit "port49"
                set lldp-profile "secure-isl"
            next
        end
    next
end`,
    options: [
      "Authentication of FSW-Access3 failed, so FortiOS formed a restricted ISL that carries no user VLANs",
      "Authentication failed, so FortiOS formed no ISL at all",
      "Mixed encryption removed port49 from the ISL because it does not support MACsec",
      "FortiLink secure fabric requires a static ISL on port49",
    ],
    answer: [0],
    explanation: "With `auto-isl-auth relax`, a successful authentication gives a secure ISL; a **failed** authentication gives a **restricted ISL**, which is a normal ISL to which FortiOS adds no user VLANs. That matches an ISL that is up while users have no VLAN connectivity. `execute switch-controller get-physical-conn` shows which ports are authenticated, secured or restricted.\n\n- No ISL at all is the `strict` failure behaviour.\n- `mixed` keeps non-MACsec members as unencrypted ISL links; removal from the ISL is the `must` behaviour.\n- Static ISLs don't support authentication.",
    lesson: "4.2-sync-topology-firmware",
  },
  {
    id: "d4-027",
    topic: "4.2",
    type: "fill",
    difficulty: 2,
    stem: "Which FortiGate CLI command synchronizes the full FortiGate configuration to the managed switch FSW-Access1 again? Type the full command.",
    answer: [
      "diagnose switch-controller trigger config-sync FSW-Access1",
      "diag switch-controller trigger config-sync FSW-Access1",
      "diagnose switch-controller trigger config-sync",
      "diag switch-controller trigger config-sync",
    ],
    explanation: "`diagnose switch-controller trigger config-sync <switch>` triggers a full configuration synchronization to a managed FortiSwitch. Check the result with `execute switch-controller get-sync-status switch-id FSW-Access1` (user-defined name) or `get-sync-status serial <sn>`, and look for the **E** flag in `get-conn-status`.",
    lesson: "4.2-sync-topology-firmware",
  },
  {
    id: "d4-028",
    topic: "4.2",
    type: "single",
    difficulty: 2,
    stem: "Refer to the exhibit. FSW-Access2 now shows Authorized/Down in get-conn-status. What do these event logs indicate?",
    exhibit: String.raw`date=2026-10-30 time=08:04:10 logid="0114032605" type="event" subtype="switch-controller" level="information" vd="root" logdesc="Switch-Controller Tunnel Up" user="Switch-Controller" sn="S124EN5918000105" name="FSW-Access2" msg="CAPWAP Tunnel Up (10.255.1.5)"
date=2026-10-30 time=11:42:37 logid="0114032697" type="event" subtype="switch-controller" level="warning" vd="root" logdesc="FortiSwitch switch" user="Fortilink" sn="S124EN5918000105" name="FSW-Access2" msg="FortiLink: internal echo reply timed out"
date=2026-10-30 time=11:43:07 logid="0114032697" type="event" subtype="switch-controller" level="warning" vd="root" logdesc="FortiSwitch switch" user="Fortilink" sn="S124EN5918000105" name="FSW-Access2" msg="FortiLink: internal echo reply timed out"`,
    options: [
      "The switch was managed normally and then stopped answering FortiLink keepalives; check the path between the FortiGate and FSW-Access2 (cabling, ISL, power)",
      "The switch was never authorized, so the management tunnel never came up",
      "The switch has a configuration sync error caused by an unsupported setting",
      "The switch is waiting for a delayed reboot after a firmware upgrade",
    ],
    answer: [0],
    explanation: "The tunnel came up at 08:04 (so the switch was authorized and managed). From 11:42 the FortiGate logs echo-reply timeouts: the management connection is no longer answering, which points to the path to the switch or the switch itself. The topology view, LLDP neighbors of the upstream switch, `execute ping` to the switch and the cabling are next.\n\n- An unauthorized switch never reaches \"Tunnel Up\".\n- Sync errors and delayed reboots appear as flags **E** and **D** in `get-conn-status`, not as keepalive timeouts.",
    lesson: "4.2-fortilink-status-discovery",
  },
  {
    id: "d4-029",
    topic: "4.2",
    type: "single",
    difficulty: 2,
    stem: "FSW-Access2 failed and is being replaced with a new switch of the same model. The administrator deauthorized the failed switch and upgraded the new switch offline to the same firmware version. Which command makes the new switch take over the name and configuration of the failed switch before it is authorized?",
    options: [
      "execute replace-device fortiswitch <failed_serial> <replacement_serial>",
      "diagnose switch-controller trigger config-sync <replacement_serial>",
      "execute switch-controller switch-action set-standalone <failed_serial>",
      "execute switch-controller switch-software upgrade <replacement_serial> <image>",
    ],
    answer: [0],
    explanation: "The FortiLink Guide's replacement procedure is: remove and deauthorize the failed switch (`set fsw-wan1-admin disable`), factory-reset the replacement if it isn't new, upgrade it offline to the same firmware, run `execute replace-device fortiswitch <failed> <replacement>` so that it inherits the failed switch's name and configuration, authorize it, then connect it.\n\n- Config sync pushes configuration that already belongs to a switch; it doesn't move it to a new serial.\n- `set-standalone` resets a switch and stops it from being discovered again.\n- The firmware was already matched offline.",
    lesson: "4.2-sync-topology-firmware",
  },
  {
    id: "d4-030",
    topic: "4.2",
    type: "match",
    difficulty: 1,
    stem: "Match each get-conn-status flag with its meaning.",
    pairs: [
      ["C", "Configuration sync"],
      ["E", "Configuration sync error"],
      ["S", "Firmware image staged"],
      ["D", "Delayed reboot pending"],
      ["V", "Managed over VXLAN"],
      ["3", "Managed over a layer-3 network"],
    ],
    explanation: "The legend printed under `execute switch-controller get-conn-status` is: C=config sync, U=upgrading, S=staged, D=delayed reboot pending, E=config sync error, 2=L2, 3=L3, V=VXLAN, T=tunnel, X=External. The V flag needs FortiOS 7.4.0 and FortiSwitchOS 7.4.0 or later.",
    lesson: "4.2-fortilink-status-discovery",
  },
  {
    id: "d4-031",
    topic: "4.2",
    type: "single",
    difficulty: 2,
    stem: "A FortiSwitch that was used in standalone mode, with a custom configuration, is cabled to a FortiLink port of FSW-Access1. It never appears in get-conn-status, not even as Discovered. What should the administrator do first?",
    options: [
      "Run execute factoryreset on the switch, then reconnect it",
      "Pre-authorize it on the FortiGate with set fsw-wan1-admin enable",
      "Run diagnose switch-controller trigger config-sync for the switch's serial number",
      "Disable the FortiLink split interface on the FortiGate",
    ],
    answer: [0],
    explanation: "The FortiLink Guide says a FortiSwitch in its factory default configuration is ready to be connected; otherwise, log in to the switch and run `execute factoryreset` first. A switch carrying an old standalone configuration might not take part in FortiLink discovery. (Standalone configuration is lost on conversion anyway; Fortinet offers a migration script if you need it.)\n\n- Authorizing doesn't change the switch's own configuration that blocks discovery.\n- Config sync needs a managed switch.\n- The split interface concerns the FortiGate-to-switch links, not a switch behind FSW-Access1.",
    lesson: "4.2-fortilink-status-discovery",
  },

  // ------------------------------------------------------------------ 4.3 Monitoring tools
  {
    id: "d4-032",
    topic: "4.3",
    type: "single",
    difficulty: 3,
    stem: "Refer to the exhibit. A user on FSW-Access1 port14 reports a slow connection. What is the most likely cause?",
    exhibit: String.raw`FGT-HQ # diagnose switch-controller switch-info port-stats FSW-Access1 port14
Vdom: root
FSW-Access1:
Port(port14) is Admin up, line protocol is up
Interface Type is Serial Gigabit Media Independent Interface(SGMII/SerDes)
Address is 70:4C:A5:3B:10:0E, loopback is not set
MTU 9216 bytes, Encapsulation IEEE 802.3/Ethernet-II
full-duplex, 100 Mb/s, link type is auto
input  : 18273645 bytes, 154320 packets, 1873 errors, 0 drops, 0 oversizes
         150112 unicasts, 2104 multicasts, 2104 broadcasts, 0 unknowns
output : 92837465 bytes, 201554 packets, 0 errors, 0 drops, 0 oversizes
         197930 unicasts, 1812 multicasts, 1812 broadcasts
         0 fragments, 0 undersizes, 0 collisions, 0 jabbers

FSW-Access1 # diagnose switch physical-ports cable-diag port14
port14:  cable (4 pairs, length +/- 10 meters)
pair A Ok, length 37 meters
pair B Ok, length 37 meters
pair C Ok, length 37 meters
pair D Open, length 21 meters`,
    options: [
      "A cabling fault: one pair is open about 21 m from the switch, so the link auto-negotiated only 100 Mb/s and receives errors",
      "A duplex mismatch, because the port is configured for half duplex",
      "The port is administratively limited to 100 Mb/s in the FortiGate port settings",
      "The FortiLink uplink of FSW-Access1 is congested and dropping traffic",
    ],
    answer: [0],
    explanation: "The cable test shows pairs A–C reaching about 37 m while pair D is **Open** at about 21 m: a broken conductor or a bad termination along the run. Gigabit copper needs all four pairs, and the port statistics show an auto-negotiated 100 Mb/s link (`link type is auto`) with input errors, consistent with a damaged cable.\n\n- The port is full duplex and shows no collisions.\n- `link type is auto` shows the speed was negotiated, not forced.\n- Nothing in the output concerns the uplink, and output drops are zero.",
    lesson: "4.3-gui-and-cli-tools",
  },
  {
    id: "d4-033",
    topic: "4.3",
    type: "single",
    difficulty: 1,
    stem: "Refer to the exhibit. What does the cable test result indicate?",
    exhibit: String.raw`FSW-Access2 # diagnose switch physical-ports cable-diag port22
port22:  cable (4 pairs, length +/- 10 meters)
pair A Open, length 0 meters
pair B Open, length 0 meters
pair C Open, length 0 meters
pair D Open, length 0 meters`,
    options: [
      "No cable is connected to port22 (all pairs are open at the switch connector)",
      "All four pairs are shorted together inside the cable",
      "The cable is good and the far-end device is powered off",
      "The model does not support cable diagnostics on port22",
    ],
    answer: [0],
    explanation: "Fortinet documents that when no cable is connected to the port, the state is **Open** and the cable length is **0 meters**. Every pair here is Open at 0 m.\n\n- A short would be reported as **Short** (or Open_Short).\n- A good cable to a powered-off device would show pairs with the cable's length, not 0 m.\n- Unsupported tests don't return pair results.",
    lesson: "4.3-gui-and-cli-tools",
  },
  {
    id: "d4-034",
    topic: "4.3",
    type: "single",
    difficulty: 1,
    stem: "Users on port8 of a managed FortiSwitch lost connectivity for several seconds at the moment an administrator used the Diagnostics and Tools pane on that switch. Which action most likely caused it?",
    options: [
      "Running a Cable Test on port8",
      "Starting LED Blink for 5 minutes",
      "Opening the Clients tab for port8",
      "Viewing the port and trunk list of the switch",
    ],
    answer: [0],
    explanation: "Running cable diagnostics on a port whose link is up **interrupts traffic for several seconds**; Fortinet warns about this both in the FortiGate pane and in FortiSwitchOS.\n\n- LED Blink only flashes the port LEDs (only the SFP LEDs on 5xx models).\n- The Clients tab and port lists are read-only displays.",
    lesson: "4.3-gui-and-cli-tools",
  },
  {
    id: "d4-035",
    topic: "4.3",
    type: "single",
    difficulty: 2,
    stem: "Refer to the exhibit. The 10G uplink on port50 of FSW-Core1 keeps flapping. What does the output suggest?",
    exhibit: String.raw`FSW-Core1 # get switch modules status port50
____________________________________________________________
Port(port50)
temperature      31.250000 C
voltage          3.287400 volts
alarm_flags[0]   0x0000
warning_flags[0] 0x0000
laser_bias[0]    6.104000 mAmps
tx_power[0]      -2.412000 dBm
rx_power[0]      -24.517000 dBm
options          0x000F ( TX_DISABLE TX_FAULT RX_LOSS TX_POWER_LEVEL1 )
options_status   0x0008 ( TX_POWER_LEVEL1 )`,
    options: [
      "The local optic transmits normally but receives very little light; check the far-end optic, the fiber and the patch panel",
      "The local transceiver is overheating and must be replaced",
      "The transceiver is receiving too much power and needs an attenuator",
      "The port needs dmi-status disabled to stop the flapping",
    ],
    answer: [0],
    explanation: "The diagnostic monitoring interface (DMI) shows normal temperature, voltage and transmit power (about -2.4 dBm), but receive power is about -24.5 dBm, which is very low for a short-reach optic. Light isn't arriving: a dirty or damaged fiber, a bad patch or a failing far-end transmitter.\n\n- 31 °C is a normal module temperature.\n- Received power is far too low, not too high.\n- `dmi-status` only controls whether DMI information is reported; it doesn't affect the link.",
    lesson: "4.3-gui-and-cli-tools",
  },
  {
    id: "d4-036",
    topic: "4.3",
    type: "fill",
    difficulty: 2,
    stem: "From the FortiGate CLI, which command lists the LLDP neighbors seen by every port of the managed switch FSW-Core1? Type the full command.",
    answer: [
      "diagnose switch-controller switch-info lldp neighbors-summary FSW-Core1",
      "diag switch-controller switch-info lldp neighbors-summary FSW-Core1",
      "diagnose switch-controller switch-info lldp neighbors-summary",
      "diag switch-controller switch-info lldp neighbors-summary",
    ],
    explanation: "`diagnose switch-controller switch-info lldp neighbors-summary <switch>` summarizes LLDP neighbors for a managed switch. `neighbors-detail <switch> <port>` gives the full TLVs for one port, and `lldp stats <switch> <port>` the LLDP counters.",
    lesson: "4.3-gui-and-cli-tools",
  },
  {
    id: "d4-037",
    topic: "4.3",
    type: "match",
    difficulty: 2,
    stem: "Match each question with the diagnose switch-controller switch-info keyword that answers it.",
    pairs: [
      ["Which MAC addresses has the switch learned in VLAN 20?", "mac-table"],
      ["Was port10 shut down for changing state too often?", "flapguard status"],
      ["What are the SFP's transmit and receive optical power levels?", "modules status"],
      ["Which port did the switch pick as the RSPAN destination?", "mirror status"],
      ["Was an edge port shut down for receiving BPDUs?", "bpdu-guard-status"],
    ],
    explanation: "- `mac-table <switch> <vlan-id>`: managed switch MAC address list.\n- `flapguard status <switch>`: flap-guard state (reset a port with `execute switch-controller flapguard reset`).\n- `modules status <switch> <port>`: transceiver DMI status.\n- `mirror status <switch>`: mirror session status, including the automatically chosen RSPAN/ERSPAN destination.\n- `bpdu-guard-status <switch>`: BPDU guard state.",
    lesson: "4.3-gui-and-cli-tools",
  },
  {
    id: "d4-038",
    topic: "4.3",
    type: "single",
    difficulty: 1,
    stem: "An administrator wants to see which NAC policies and dynamic port policies a device connected to a managed switch matches, and then quarantine the host from the same page. Which FortiGate GUI page does this?",
    options: [
      "WiFi & Switch Controller > FortiSwitch Clients",
      "WiFi & Switch Controller > FortiSwitch Ports > View Statistics",
      "Network > Interfaces",
      "System > Firmware & Registration",
    ],
    answer: [0],
    explanation: "The **FortiSwitch Clients** page (FortiOS 7.2.0 and later) lists the devices connected to the switches in the VDOM. Its Device Info pane shows the NAC policies and dynamic port policies the device matches, and its actions create a firewall device address or IP address, or **quarantine the host**.\n\n- View Statistics shows per-port traffic and error counters.\n- Network > Interfaces shows the FortiLink interface as Dedicated to FortiSwitch.\n- Firmware & Registration is for upgrades.",
    lesson: "4.3-gui-and-cli-tools",
  },
  {
    id: "d4-039",
    topic: "4.3",
    type: "multi",
    difficulty: 2,
    stem: "Refer to the exhibit. The SNMP server 10.10.99.40 in vlan99-mgmt cannot poll the managed switches. Which two changes are required? (Choose two.)",
    exhibit: String.raw`config switch-controller snmp-community
    edit 1
        set name "noc-ro"
        set status enable
        set query-v2c-status enable
        config hosts
            edit 1
                set ip 10.10.99.40
            next
        end
    next
end
config switch-controller security-policy local-access
    edit "default"
        set mgmt-allowaccess https ping ssh
        set internal-allowaccess https ping ssh
    next
end

FGT-HQ # show firewall policy
config firewall policy
    edit 1
        set name "users-internet"
        set srcintf "vlan10-data"
        set dstintf "wan1"
        ...
    next
end`,
    options: [
      "Add snmp to internal-allowaccess in the default local-access policy",
      "Create a firewall policy from vlan99-mgmt to the fortilink interface that allows SNMP",
      "Enable query-v1-status in the community",
      "Change the query port of the community to 162",
      "Add 10.10.99.40 as a trap receiver in a second community",
    ],
    answer: [0, 1],
    explanation: "Fortinet's SNMP procedure for managed switches requires (1) a firewall policy on the FortiGate that lets the SNMP server reach the switches through the FortiLink interface, and (2) SNMP access on the switch, added to `internal-allowaccess` (or `mgmt-allowaccess` for out-of-band layer-3 FortiLink) in `config switch-controller security-policy local-access`. Neither exists here.\n\n- v2c queries are already enabled; v1 isn't needed.\n- 161 is the query port; 162 is for traps.\n- The host is already listed, and traps don't fix polling.",
    lesson: "4.3-snmp-sflow-logs",
  },
  {
    id: "d4-040",
    topic: "4.3",
    type: "single",
    difficulty: 3,
    stem: "Refer to the exhibit. The collector receives flow records for traffic entering access ports, but none for traffic that arrives on the ISL ports between FSW-Core1 and the access switches. The administrator wants hop-by-hop tracking on every switch. Which change achieves this?",
    exhibit: String.raw`FGT-HQ # show switch-controller flow-tracking
config switch-controller flow-tracking
    set sample-mode perimeter
    set sample-rate 512
    set format netflow9
    set level port
    config collectors
        edit "noc-netflow"
            set ip 10.10.99.45
            set port 2055
        next
    end
end`,
    options: [
      "Set sample-mode to device-ingress",
      "Set sample-mode to local",
      "Change the format to ipfix",
      "Set level to vlan",
    ],
    answer: [0],
    explanation: "`perimeter` samples packets on all FortiSwitch ports that receive data traffic **except ISL and ICL ports**. `device-ingress` samples on all ports that receive data traffic for **hop-by-hop** tracking.\n\n- `local` samples one specific port only.\n- The export format and the flow level change what is exported, not which ports are sampled.",
    lesson: "4.3-snmp-sflow-logs",
  },
  {
    id: "d4-041",
    topic: "4.3",
    type: "single",
    difficulty: 3,
    stem: "Refer to the exhibit. FGT-HQ has a hard disk, disk logging and historical FortiView are enabled, but the FortiView Internal Hubs monitor stays empty. Which change is required?",
    exhibit: String.raw`config system interface
    edit "fortilink"
        set ip 10.255.1.1 255.255.255.0
        set switch-controller-netflow-collect enable
        ...
    next
end
config switch-controller flow-tracking
    config collectors
        edit "noc-netflow"
            set ip 10.10.99.45
        next
    end
end`,
    options: [
      "Set the flow-tracking collector IP to the FortiLink interface address 10.255.1.1",
      "Send logs to FortiAnalyzer, which the Internal Hubs monitor uses as its data source",
      "Disable switch-controller-netflow-collect so that the switches export directly to FortiView",
      "Change the collector transport to sctp",
    ],
    answer: [0],
    explanation: "For the FortiView Internal Hubs monitor (FortiOS 7.2.4 / FortiSwitchOS 7.2.3 and later) the flow-tracking collector IP must be the **FortiLink interface IP**, with `switch-controller-netflow-collect enable` on that interface. The FortiGate also needs a hard disk with historical FortiView and disk logging, which the stem confirms.\n\n- FortiAnalyzer is explicitly **not supported** for this monitor.\n- Disabling netflow collection removes the FortiGate collector.\n- The transport protocol isn't the problem; the records go to the wrong IP.",
    lesson: "4.3-snmp-sflow-logs",
  },
  {
    id: "d4-042",
    topic: "4.3",
    type: "fill",
    difficulty: 1,
    stem: "What is the default UDP port of the sFlow collector configured under config switch-controller sflow? Type the number.",
    answer: ["6343"],
    explanation: "By default the sFlow collector IP is 0.0.0.0 and the port is **6343**. Per-port sampling is enabled under the managed switch with `set sflow-sampler enabled`, `sflow-sample-rate` and `sflow-counter-interval`, and a FortiGate policy must let the samples reach the collector.",
    lesson: "4.3-snmp-sflow-logs",
  },
  {
    id: "d4-043",
    topic: "4.3",
    type: "single",
    difficulty: 2,
    stem: "Refer to the exhibit. Which statement is true?",
    exhibit: String.raw`config switch-controller switch-log
    set status enable
    set severity information
end
config switch-controller managed-switch
    edit "FSW-Core1"
        config switch-log
            set local-override enable
            set severity warning
        end
    next
end`,
    options: [
      "FSW-Core1 exports warning and more severe logs to the FortiGate; the other managed switches export information and more severe logs",
      "FSW-Core1 sends its logs to a remote syslog server instead of the FortiGate",
      "local-override disables log export for FSW-Core1",
      "All managed switches now export only warning and more severe logs",
    ],
    answer: [0],
    explanation: "`config switch-controller switch-log` is the global setting (enabled by default, severity `information` by default) for exporting managed-switch logs into the FortiGate event log; the FortiGate marks these entries with the user `fortiswitch-syslog`. `local-override enable` under one switch lets that switch use its own settings, here severity `warning`.\n\n- Remote syslog is `config switch-controller remote-log`.\n- The override keeps export enabled with different settings.\n- The global severity still applies to the other switches.",
    lesson: "4.3-snmp-sflow-logs",
  },
  {
    id: "d4-044",
    topic: "4.3",
    type: "single",
    difficulty: 2,
    stem: "An administrator plans to run diagnose switch-controller trigger reset-hardware-counters on several managed switch ports before a test. What does Fortinet warn about this command?",
    options: [
      "It is meant for debugging: counter accuracy isn't guaranteed and resetting can affect monitoring tools such as SNMP and the FortiGate",
      "It restarts the ports, interrupting traffic for several seconds",
      "It also clears the MAC address table of the switch",
      "It can only be run on standalone switches",
    ],
    answer: [0],
    explanation: "The FortiLink Guide notes that the reset command is provided for debugging, that accuracy isn't guaranteed when counters are reset, and that it can have a negative effect on monitoring tools such as SNMP and the FortiGate; statistics from the reset period might be discarded. `diagnose switch-controller trigger restore-hardware-counters` restores them.\n\n- Resetting counters doesn't bounce ports (the cable test is what interrupts traffic).\n- It doesn't touch the MAC table.\n- It's a FortiGate command for managed switches.",
    lesson: "4.3-gui-and-cli-tools",
  },
  {
    id: "d4-045",
    topic: "4.3",
    type: "multi",
    difficulty: 1,
    stem: "Which two statements about the LED Blink action in the Diagnostics and Tools pane are true? (Choose two.)",
    options: [
      "It can run for 5, 15, 30 or 60 minutes",
      "On 5xx models, only the SFP port LEDs blink",
      "It interrupts traffic on the switch for several seconds",
      "It keeps blinking until the switch is restarted",
      "It can be started only from the FortiSwitch GUI, not from the FortiGate",
    ],
    answer: [0, 1],
    explanation: "LED Blink flashes the port LEDs so you can find a switch in a rack. You choose **5, 15, 30 or 60 minutes**, and you can stop it with LED Blink > Stop. On **5xx** switches only the SFP port LEDs blink.\n\n- It doesn't affect traffic; the cable test does.\n- It runs for the chosen time or until stopped.\n- It is started from the FortiGate Diagnostics and Tools pane (or with `execute switch-controller switch-action physical-ports led-flash`).",
    lesson: "4.3-gui-and-cli-tools",
  },
];
