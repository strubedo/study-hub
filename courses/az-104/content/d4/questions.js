// Domain 4 — Implement and manage virtual networking. Original questions modelled on Microsoft's published item
// formats (study guide wording, exam sandbox item types, practice assessment style); no recalled exam content.
// Facts checked against Microsoft Learn on 2026-11-23. Every NSG item was walked rule by rule (including default
// rules) in the evaluation order for its direction, every routing item by longest prefix then route source, and
// every address, overlap and usable-host count was checked offline with Python ipaddress. Command output and portal
// text in exhibits are documentation-based (not captured from a subscription) and are listed in REVIEW-TODO.md.
const L411 = '4.1-vnets-subnets';
const L412 = '4.1-vnet-peering';
const L413 = '4.1-public-ip-addresses';
const L414 = '4.1-user-defined-routes';
const L415 = '4.1-troubleshoot-connectivity';
const L421 = '4.2-nsgs-asgs';
const L422 = '4.2-effective-security-rules';
const L423 = '4.2-azure-bastion';
const L424 = '4.2-service-endpoints';
const L425 = '4.2-private-endpoints';
const L431 = '4.3-azure-dns-public';
const L432 = '4.3-private-dns';
const L433 = '4.3-load-balancer';
const L434 = '4.3-troubleshoot-load-balancing';

const bank = [
  // ---------- 4.1 Configure and manage virtual networks in Azure ----------
  { topic: '4.1', type: 'fill', difficulty: 2, lesson: L411,
    stem: 'Refer to the exhibit. How many more private IP addresses can be assigned to new network interfaces in snet-web? Enter a number.',
    exhibit: `Virtual network: vnet-app   Region: East US   Address space: 10.20.0.0/16

Subnet      Address range   Assigned addresses
snet-web    10.20.1.0/27    vm-web-01 NIC (10.20.1.4)
                            vm-web-02 NIC (10.20.1.5)
                            lb-web-int frontend IP (10.20.1.10)
snet-data   10.20.2.0/28    vm-sql-01 NIC (10.20.2.4)`,
    answer: ['24'],
    explanation: "A /27 has 32 addresses. Azure reserves five in every subnet: the network address (10.20.1.0), the default gateway (.1), two addresses that map Azure DNS (.2 and .3) and the last address (.31). That leaves **27** usable, and three are already assigned (two NICs and the internal load balancer frontend), so **24** remain. Counting 30 hosts as on a traditional /27, or forgetting that a load balancer frontend consumes an address, gives the wrong number." },
  { topic: '4.1', type: 'single', difficulty: 2, lesson: L411,
    stem: 'Refer to the exhibit. You must deploy Azure Bastion with the Standard SKU in vnet-hub. Which subnet should you create?',
    exhibit: `Virtual network: vnet-hub   Address space: 10.10.0.0/22

Subnet                Address range
snet-shared           10.10.0.0/24
GatewaySubnet         10.10.1.0/27
AzureFirewallSubnet   10.10.1.64/26

Unallocated ranges: 10.10.1.32/27, 10.10.1.128/25, 10.10.2.0/23`,
    options: ['A subnet named AzureBastionSubnet with the range 10.10.1.128/26', 'A subnet named AzureBastionSubnet with the range 10.10.1.32/27', 'A subnet named snet-bastion with the range 10.10.2.0/26', 'No new subnet: deploy Bastion into GatewaySubnet'],
    answer: [0],
    explanation: "Basic, Standard and Premium Bastion need a dedicated subnet named exactly **AzureBastionSubnet** that is **/26 or larger** (Learn: required for deployments since November 2, 2021). 10.10.1.128/26 (.128 to .191) is free. A /27 is too small, any other name is rejected, and nothing else may be deployed into GatewaySubnet." },
  { topic: '4.1', type: 'multi', difficulty: 2, lesson: L412,
    stem: 'Refer to the exhibit. Which two virtual network peerings can be created? (Choose two.)',
    exhibit: `Name     Subscription   Tenant          Region        Address space
vnet-a   Contoso-Prod   contoso.com     East US       10.1.0.0/16
vnet-b   Contoso-Prod   contoso.com     West Europe   10.2.0.0/16, 10.3.0.0/24
vnet-c   Contoso-Prod   contoso.com     East US       10.3.0.0/16
vnet-d   Partner-Sub    other tenant    East US 2     192.168.0.0/20
vnet-e   Contoso-Dev    contoso.com     East US       10.3.0.128/25`,
    options: ['vnet-a and vnet-b', 'vnet-b and vnet-c', 'vnet-c and vnet-d', 'vnet-b and vnet-e', 'vnet-c and vnet-e'],
    answer: [0, 2],
    explanation: "Peered VNets must have **non-overlapping** address spaces; region, subscription and tenant don't matter (global and cross-tenant peering are supported). **vnet-a/vnet-b**: 10.1.0.0/16 overlaps neither 10.2.0.0/16 nor 10.3.0.0/24, so a global peering works. **vnet-c/vnet-d**: 10.3.0.0/16 and 192.168.0.0/20 don't overlap; the other tenant only means you need permissions in both directories. vnet-b's second range 10.3.0.0/24 lies inside vnet-c's 10.3.0.0/16, and vnet-e's 10.3.0.128/25 lies inside both 10.3.0.0/24 and 10.3.0.0/16, so the other three pairs overlap." },
  { topic: '4.1', type: 'single', difficulty: 2, lesson: L412,
    stem: 'Refer to the exhibit. VMs in vnet-spoke1 must communicate directly with VMs in vnet-spoke2. There is no network virtual appliance in vnet-hub. You need the solution with the least administrative effort. What should you do?',
    exhibit: `Peering                 Status      Settings
vnet-hub-to-spoke1      Connected   Allow virtual network access
vnet-spoke1-to-hub      Connected   Allow virtual network access
vnet-hub-to-spoke2      Connected   Allow virtual network access
vnet-spoke2-to-hub      Connected   Allow virtual network access

vnet-hub 10.10.0.0/16   vnet-spoke1 10.21.0.0/16   vnet-spoke2 10.22.0.0/16`,
    options: ['Create a peering between vnet-spoke1 and vnet-spoke2 in both directions', 'Enable Allow forwarded traffic on all four existing peerings', 'Enable Allow gateway transit on the hub peerings and Use remote gateways on the spoke peerings', 'Add a route 10.22.0.0/16 with next hop type Virtual network to a route table on the vnet-spoke1 subnets'],
    answer: [0],
    explanation: "Peering is **not transitive**: spoke1 and spoke2 each reach the hub, never each other through it. Without an NVA, the only fix is a **direct peering** between the spokes (one link on each VNet). Allowing forwarded traffic only matters when something in the hub actually forwards packets, and nothing does. Gateway transit needs a VPN/ExpressRoute gateway or Route Server in the hub and is for gateway traffic. A UDR with next hop Virtual network (VnetLocal) only keeps traffic inside the local VNet; it can't create a path to another VNet." },
  { topic: '4.1', type: 'order', difficulty: 2, lesson: L412,
    stem: 'VMs in vnet-spoke1 must reach the on-premises network through a new site-to-site VPN in vnet-hub. Neither VNet has a gateway or a peering yet. Put the steps in the order they must be performed.',
    items: ['Create the GatewaySubnet in vnet-hub', 'Deploy the VPN gateway in vnet-hub and connect it to the on-premises VPN device', 'Create the vnet-hub to vnet-spoke1 peering link with Allow gateway transit enabled', 'Create the vnet-spoke1 to vnet-hub peering link with Use remote gateways enabled'],
    explanation: "The gateway needs its **GatewaySubnet** first. Learn says the hub-side **gateway transit** option can be enabled only when the hub contains a gateway (or Route Server), so the gateway must exist before that link. The spoke-side **Use remote gateways** option can be enabled only if the hub allows gateway transit, so the spoke link comes last; at that point the spoke learns the on-premises prefixes." },
  { topic: '4.1', type: 'fill', difficulty: 2, lesson: L412,
    stem: 'Refer to the exhibit. VMs in vnet-spoke1 must reach on-premises networks through the VPN gateway in vnet-hub. Enter the parameter that completes the second command.',
    exhibit: `# vnet-hub already has a working site-to-site VPN gateway
az network vnet peering create -g rg-net-prod -n hub-to-spoke1 --vnet-name vnet-hub \\
  --remote-vnet vnet-spoke1 --allow-vnet-access --allow-gateway-transit

az network vnet peering create -g rg-net-prod -n spoke1-to-hub --vnet-name vnet-spoke1 \\
  --remote-vnet vnet-hub --allow-vnet-access ____________`,
    answer: ['--use-remote-gateways', '--use-remote-gateways true'],
    explanation: "Gateway transit is a pair: the hub link sets `--allow-gateway-transit`, the spoke link sets **`--use-remote-gateways`**. The CLI reference notes the remote VNet must allow gateway transit, only one peering of a VNet can use remote gateways, and the spoke can't have its own gateway. `--allow-forwarded-traffic` is for traffic forwarded by an NVA, not for gateway transit." },
  { topic: '4.1', type: 'single', difficulty: 2, lesson: L412,
    stem: 'Refer to the exhibit. VMs in vnet-hub can\'t reach vm-app-05. Existing traffic between vnet-hub and the original range of vnet-spoke1 must not be interrupted. What should you do?',
    exhibit: `10:00  Address range 10.121.0.0/16 added to vnet-spoke1 (existing range: 10.21.0.0/16)
10:05  Subnet snet-new (10.121.1.0/24) created in vnet-spoke1
10:10  vm-app-05 deployed in snet-new with IP 10.121.1.4

Effective routes on vm-hub-01 (vnet-hub, 10.10.0.0/16):
Source   State    Address prefixes   Next hop type
Default  Active   10.10.0.0/16       Virtual network
Default  Active   10.21.0.0/16       Virtual network peering
Default  Active   0.0.0.0/0          Internet`,
    options: ['Sync the peering links between vnet-hub and vnet-spoke1', 'Delete both peering links and create them again', 'Add a route 10.121.0.0/16 with next hop type Virtual network to the vnet-hub subnets', 'Enable Allow forwarded traffic on the vnet-hub to vnet-spoke1 peering'],
    answer: [0],
    explanation: "Learn: after you add, remove or resize an address range on a peered VNet, you must **sync** each remote peering (portal **Sync**, `az network vnet peering sync`, `Sync-AzVirtualNetworkPeering`). Until then vnet-hub only has the peering route for 10.21.0.0/16. Resizing and syncing cause no downtime. Re-creating the peering would also work but interrupts existing traffic. A VnetLocal UDR can't route into another VNet. Forwarded traffic is about packets from outside the peered VNet." },
  { topic: '4.1', type: 'single', difficulty: 1, lesson: L413,
    stem: 'Refer to the exhibit. An administrator at 198.51.100.7 can\'t open an RDP session to vm-jump-01 by using its public IP address. The guest firewall allows RDP. What should you do?',
    exhibit: `VM: vm-jump-01 (Windows Server)   NIC: nic-jump-01   Private IP: 10.20.3.4
Public IP: pip-jump-01   SKU: Standard   Assignment: Static   Address: 203.0.113.25
NSG on nic-jump-01: None
NSG on subnet snet-mgmt: None`,
    options: ['Associate an NSG with nic-jump-01 or snet-mgmt that allows TCP 3389 from 198.51.100.7', 'Change the public IP assignment to Dynamic', 'Enable IP forwarding on nic-jump-01', 'Add a route 0.0.0.0/0 with next hop type Internet to the subnet'],
    answer: [0],
    explanation: "Standard SKU public IPs are **secure by default**: closed to inbound traffic until an NSG on the NIC or subnet allows it. With no NSG at all, RDP never reaches the VM. Standard IPs are static only, so Dynamic isn't available (and wouldn't help). IP forwarding is for VMs that forward other hosts' traffic. The subnet already has a default 0.0.0.0/0 Internet system route." },
  { topic: '4.1', type: 'match', difficulty: 2, lesson: L413,
    stem: 'Match each requirement to the public IP configuration that meets it.',
    pairs: [
      ['A partner must allow-list a single contiguous CIDR block for all outbound traffic from a NAT gateway', 'Public IP prefix'],
      ['The frontend address of a regional public load balancer must keep working if one availability zone fails', 'Zone-redundant Standard public IP'],
      ['The zone apex contoso.com must always resolve to the current address of pip-web-01', 'Alias A record set in Azure DNS'],
      ['Egress from a VM should use transit ISP networks to lower data transfer cost', 'Routing preference set to Internet'],
      ['A cross-region load balancer needs its frontend address', 'Global tier Standard public IP'],
    ],
    explanation: "A **public IP prefix** reserves a contiguous block that a NAT gateway can use for SNAT. A **zone-redundant** Standard IP survives a single zone failure (the zone choice is fixed at creation). An **alias** A record set tracks a Standard public IP resource, works at the apex and updates when the address changes. **Routing preference Internet** (\"hot potato\") hands traffic to ISP networks close to the Azure region; it's set at creation. The **Global** tier is required for a cross-region load balancer frontend." },
  { topic: '4.1', type: 'single', difficulty: 2, lesson: L414,
    stem: 'Refer to the exhibit. vm-app-01 sends a packet to 198.51.100.20. Which next hop does Azure use?',
    exhibit: `Effective routes for nic-app-01 (vm-app-01, 10.40.1.4)
Source                   State    Address prefixes  Next hop type             Next hop IP address
Default                  Active   10.40.0.0/16      Virtual network
Default                  Active   10.41.0.0/16      Virtual network peering
Virtual network gateway  Active   172.16.0.0/16     Virtual network gateway   10.40.255.4
Default                  Invalid  0.0.0.0/0         Internet
User                     Active   0.0.0.0/0         Virtual appliance         10.40.250.4
User                     Active   10.41.8.0/24      None`,
    options: ['Virtual appliance 10.40.250.4', 'Internet', 'Virtual network gateway 10.40.255.4', 'The packet is dropped'],
    answer: [0],
    explanation: "Only the two 0.0.0.0/0 routes contain 198.51.100.20. They tie on prefix length, so the source decides: **User beats Default**, which is why the Internet route shows **Invalid**. Traffic goes to the NVA at 10.40.250.4. The gateway route covers only 172.16.0.0/16, and the user None route only 10.41.8.0/24. (The default 10.0.0.0/8, 192.168.0.0/16 and 100.64.0.0/10 None routes aren't listed because Learn's routing example shows Azure removing them when a 0.0.0.0/0 UDR is associated with the subnet.)" },
  { topic: '4.1', type: 'fill', difficulty: 2, lesson: L414,
    stem: 'Refer to the exhibit. vm-app-01 sends a packet to 10.41.8.25, an address in the peered VNet. Enter the next hop type that Azure uses for this packet, exactly as it appears in the Next hop type column.',
    exhibit: `Effective routes for nic-app-01 (vm-app-01, 10.40.1.4)
Source                   State    Address prefixes  Next hop type             Next hop IP address
Default                  Active   10.40.0.0/16      Virtual network
Default                  Active   10.41.0.0/16      Virtual network peering
Virtual network gateway  Active   172.16.0.0/16     Virtual network gateway   10.40.255.4
Default                  Invalid  0.0.0.0/0         Internet
User                     Active   0.0.0.0/0         Virtual appliance         10.40.250.4
User                     Active   10.41.8.0/24      None`,
    answer: ['None'],
    explanation: "Routes that contain 10.41.8.25: 10.41.8.0/24 (User, None), 10.41.0.0/16 (Default, Virtual network peering) and the two 0.0.0.0/0 routes. **Longest prefix match** picks the **/24**, whose next hop is **None**, so the packet is dropped even though the peering is up. Route source only matters when prefixes are the same length, so the peering route never gets a say." },
  { topic: '4.1', type: 'multi', difficulty: 3, lesson: L414,
    stem: 'Refer to the exhibit. Which two statements are true? (Choose two.)',
    exhibit: `Effective routes for nic-web-01 (vm-web-01, 10.60.2.4)
Source                   State    Address prefixes  Next hop type             Next hop IP address
Default                  Active   10.60.0.0/16      Virtual network
Virtual network gateway  Invalid  10.50.0.0/16      Virtual network gateway   10.60.255.4
User                     Active   10.50.0.0/16      Virtual appliance         10.60.1.4
Virtual network gateway  Active   10.50.4.0/24      Virtual network gateway   10.60.255.4
Default                  Invalid  0.0.0.0/0         Internet
User                     Active   0.0.0.0/0         Virtual appliance         10.60.1.4`,
    options: ['Traffic from vm-web-01 to 10.50.4.20 is sent to the virtual network gateway', 'Traffic from vm-web-01 to 10.50.7.20 is sent to the virtual appliance at 10.60.1.4', 'Traffic from vm-web-01 to 10.50.4.20 is sent to the virtual appliance, because user-defined routes always take precedence over BGP routes', 'Traffic from vm-web-01 to 10.60.9.9 is sent to the virtual appliance', 'The BGP route for 10.50.0.0/16 is invalid because the gateway is down'],
    answer: [0, 1],
    explanation: "Longest prefix match comes first. **10.50.4.20** matches the BGP /24, which is longer than the UDR /16, so it goes to the **gateway**. **10.50.7.20** matches only the /16 routes (and 0.0.0.0/0); between the two /16s the **User** route beats BGP, so it goes to the **NVA**. Precedence User > BGP > Default applies only to identical prefixes. 10.60.9.9 matches the VNet /16, longer than 0.0.0.0/0, so it stays in the VNet. The BGP /16 is Invalid because a UDR with the same prefix overrides it, not because of an outage." },
  { topic: '4.1', type: 'single', difficulty: 2, lesson: L414,
    stem: 'Refer to the exhibit. Next hop from vm-app-01 correctly reports the firewall VM, but traffic from vm-app-01 to the internet never leaves the firewall\'s NIC toward its destination. What should you do first?',
    exhibit: `Route table rt-spokes (associated with vnet-spoke1/snet-app)
  default-to-fw   0.0.0.0/0   VirtualAppliance   10.10.3.4

Firewall VM vm-fw-01 (Linux) in vnet-hub/snet-fw
  NIC nic-fw-01: private IP 10.10.3.4, public IP pip-fw-01 (Standard)
  NIC setting "IP forwarding": Disabled
  Guest OS: net.ipv4.ip_forward = 1, iptables MASQUERADE configured

Peerings hub<->spoke1: Connected, Allow forwarded traffic enabled on both`,
    options: ['Enable IP forwarding on nic-fw-01', 'Disable gateway route propagation on rt-spokes', 'Change the next hop type of default-to-fw to Internet', 'Move vm-fw-01 into snet-app'],
    answer: [0],
    explanation: "Azure drops packets on a NIC whose source or destination isn't the NIC's own IP unless **IP forwarding** is enabled **on the Azure NIC**. Enabling forwarding in the guest OS isn't enough. Gateway propagation affects only gateway-learned routes. Next hop Internet would bypass the firewall. Learn warns against putting the appliance in the same subnet whose traffic it routes, because that can loop." },
  { topic: '4.1', type: 'order', difficulty: 2, lesson: L412,
    stem: 'vnet-spoke1 is peered with vnet-hub. You must move vnet-spoke1 to the Contoso-Prod subscription and restore connectivity. Put the steps in order.',
    items: ['Delete the peering links between vnet-spoke1 and vnet-hub', 'Move vnet-spoke1 to the Contoso-Prod subscription', 'Create the peering links again in both directions', 'Confirm that both peering links show Connected'],
    explanation: "Learn: you can't move a virtual network while it's part of a peering; delete the peering, move the VNet, then re-create the peering (one link on each VNet). Traffic flows only once both links are **Connected**." },
  { topic: '4.1', type: 'match', difficulty: 2, lesson: L415,
    stem: 'Match each troubleshooting task to the Azure Network Watcher capability that answers it most directly.',
    pairs: [
      ['Confirm whether NSG rules allow TCP 1433 from vm-app-01 to vm-sql-01 and name the rule that decides', 'IP flow verify'],
      ['Find out which NSG rule blocks ping (ICMP echo) from vm-app-01 to vm-sql-01', 'NSG diagnostics'],
      ['Find out whether packets from vm-app-01 to 10.30.1.5 go to the hub firewall or directly over the peering', 'Next hop'],
      ['Record the TCP handshake arriving at vm-sql-01 for analysis in Wireshark', 'Packet capture'],
      ['Find out why the site-to-site tunnel to the branch office is down', 'VPN troubleshoot'],
      ['Test now whether vm-app-01 can open a connection to sql01.contoso.com on port 1433 and see where the path fails', 'Connection troubleshoot'],
    ],
    explanation: "**IP flow verify** returns allow/deny and the deciding rule for TCP or UDP. It doesn't test ICMP, so use **NSG diagnostics** for ping. **Next hop** returns the next hop type, IP and route table. **Packet capture** saves packets to a file or storage (needs the Network Watcher agent extension). **VPN troubleshoot** diagnoses gateways and connections. **Connection troubleshoot** tests an end-to-end connection to a VM, FQDN, URI or IP at a point in time and reports where it fails." },
  { topic: '4.1', type: 'single', difficulty: 2, lesson: L415,
    stem: 'Refer to the exhibit. vm-api-01 has an NSG on its subnet and another on its NIC. What does the result tell you?',
    exhibit: `$ az network watcher test-ip-flow -g rg-app-prod --vm vm-api-01 --direction Inbound \\
    --protocol TCP --local 10.20.1.4:8443 --remote 198.51.100.9:51000
{
  "access": "Deny",
  "ruleName": "defaultSecurityRules/DenyAllInBound"
}`,
    options: ['No custom rule in the NSG that made the decision matches the flow, so the default DenyAllInBound rule blocks it; add an allow rule for TCP 8443', 'A custom rule named DenyAllInBound must be deleted from the NIC NSG', 'The route table on the subnet drops traffic from 198.51.100.9', 'The guest OS firewall on vm-api-01 blocks TCP 8443'],
    answer: [0],
    explanation: "The `defaultSecurityRules/` prefix shows a **default** rule decided: no custom rule with a lower priority number matched, so priority 65500 **DenyAllInBound** dropped the flow. You can't delete default rules; you override them with an allow rule (in every NSG on the path). IP flow verify evaluates NSG rules only, not routes or the guest firewall." },
  { topic: '4.1', type: 'single', difficulty: 2, lesson: L411,
    stem: 'Refer to the exhibit. vm-app2-01 can\'t download Windows updates. The solution must give the subnet a fixed public egress address and require the least administrative effort. What should you do?',
    exhibit: `vnet-app2 created on 2026-10-14 in the Azure portal (East US)
Subnet snet-app2   10.70.1.0/24
  Default outbound access: Disabled (private subnet)
  NAT gateway: None   Route table: None   NSG: nsg-app2 (default rules only)
vm-app2-01: no public IP address, not in any load balancer backend pool`,
    options: ['Create a NAT gateway with a Standard public IP address and associate it with snet-app2', 'Add an outbound NSG rule that allows TCP 443 to the Internet service tag', 'Add a route 0.0.0.0/0 with next hop type Internet to snet-app2', 'Enable IP forwarding on the NIC of vm-app2-01'],
    answer: [0],
    explanation: "The subnet is **private**: Learn says the portal already defaults new subnets to private and that VMs in them need an **explicit outbound method** (Windows Update and activation are called out as failing). A **NAT gateway** gives every VM in the subnet SNAT through its static public IP with no route changes. The default AllowInternetOutBound rule already permits the traffic, so an NSG rule changes nothing. Learn says UDRs with next hop Internet break in a private subnet. IP forwarding is unrelated." },

  // ---------- 4.2 Configure secure access to virtual networks ----------
  { topic: '4.2', type: 'single', difficulty: 2, lesson: L422,
    stem: 'Refer to the exhibit. vnet-hub (10.10.0.0/16) is peered with vnet-app (10.30.0.0/16). A server at 10.10.2.5 in vnet-hub opens a TCP connection to 10.30.1.4 on port 8080. What happens?',
    exhibit: `vm-app-01: 10.30.1.4 in snet-app (10.30.1.0/24); its NIC is a member of asg-app

nsg-snet-app (associated with snet-app) - inbound
Priority  Name                           Source             Destination     Port  Protocol  Action
100       allow-hub-https                10.10.0.0/16       asg-app         443   TCP       Allow
200       deny-hub                       10.10.0.0/16       Any             Any   Any       Deny
65000     AllowVNetInBound               VirtualNetwork     VirtualNetwork  Any   Any       Allow
65001     AllowAzureLoadBalancerInBound  AzureLoadBalancer  Any             Any   Any       Allow
65500     DenyAllInBound                 Any                Any             Any   Any       Deny

nsg-vm-app-01 (associated with the NIC of vm-app-01) - inbound
Priority  Name                           Source             Destination     Port  Protocol  Action
100       deny-internet-https            Internet           Any             443   TCP       Deny
300       allow-8080                     VirtualNetwork     Any             8080  TCP       Allow
65000     AllowVNetInBound               VirtualNetwork     VirtualNetwork  Any   Any       Allow
65001     AllowAzureLoadBalancerInBound  AzureLoadBalancer  Any             Any   Any       Allow
65500     DenyAllInBound                 Any                Any             Any   Any       Deny`,
    options: ['The connection is denied by deny-hub in nsg-snet-app', 'The connection is allowed by allow-8080 in nsg-vm-app-01', 'The connection is allowed by AllowVNetInBound in nsg-snet-app', 'The connection is denied by DenyAllInBound in nsg-vm-app-01'],
    answer: [0],
    explanation: "Inbound traffic is evaluated by the **subnet NSG first**. In nsg-snet-app, rule 100 doesn't match (port 443 only). Rule **200 deny-hub** matches source 10.10.2.5, any port: **Deny**. Evaluation stops, and the NIC NSG never sees the packet, so allow-8080 doesn't matter. AllowVNetInBound (65000) would have allowed it (peered VNets are in VirtualNetwork) but rule 200 is processed first." },
  { topic: '4.2', type: 'fill', difficulty: 3, lesson: L422,
    stem: 'Refer to the exhibit. vm-app-01 (10.30.1.4) opens an outbound HTTPS connection to 203.0.113.80 on TCP 443. 203.0.113.80 is a partner web server on the internet, not an Azure service. Enter the name of the rule that decides the outcome.',
    exhibit: `nsg-vm-app-01 (associated with the NIC of vm-app-01) - outbound
Priority  Name                   Destination      Port      Protocol  Action
100       allow-https-out        Internet         443       TCP       Allow
65000     AllowVnetOutBound      VirtualNetwork   Any       Any       Allow
65001     AllowInternetOutBound  Internet         Any       Any       Allow
65500     DenyAllOutBound        Any              Any       Any       Deny

nsg-snet-app (associated with snet-app) - outbound
Priority  Name                   Destination      Port      Protocol  Action
150       allow-storage          Storage.EastUS   443       TCP       Allow
300       deny-web-out           Internet         80, 443   TCP       Deny
65000     AllowVnetOutBound      VirtualNetwork   Any       Any       Allow
65001     AllowInternetOutBound  Internet         Any       Any       Allow
65500     DenyAllOutBound        Any              Any       Any       Deny`,
    answer: ['deny-web-out'],
    explanation: "Outbound traffic is evaluated by the **NIC NSG first, then the subnet NSG**. NIC: rule 100 allow-https-out matches (Internet, 443/TCP), so the packet continues. Subnet: rule 150 matches only Azure Storage East US prefixes, and 203.0.113.80 isn't one; rule **300 deny-web-out** matches Internet on 443/TCP: **Deny**. Both NSGs must allow, so the connection fails and the deciding rule is deny-web-out." },
  { topic: '4.2', type: 'multi', difficulty: 3, lesson: L422,
    stem: 'Refer to the exhibit. Which two connections succeed? (Choose two.)',
    exhibit: `vnet-app 10.30.0.0/16, peered with vnet-hub 10.10.0.0/16
vm-web-01  10.30.2.4  snet-web (10.30.2.0/24)  NIC in asg-web
vm-web-02  10.30.2.5  snet-web (10.30.2.0/24)  NIC in no ASG
vm-db-01   10.30.3.4  snet-db  (10.30.3.0/24)  NIC in asg-db
vm-jump-01 10.10.1.10 vnet-hub/snet-mgmt (10.10.1.0/24)
Only NSG in the environment: nsg-db, associated with snet-db

nsg-db - inbound
Priority  Name           Source          Destination  Port  Protocol  Action
100       allow-web-sql  asg-web         asg-db       1433  TCP       Allow
200       allow-mgmt     10.10.1.0/24    Any          22    TCP       Allow
300       deny-vnet      VirtualNetwork  Any          Any   Any       Deny
65000     AllowVNetInBound ... (default rules follow)`,
    options: ['vm-web-01 to vm-db-01 on TCP 1433', 'vm-web-02 to vm-db-01 on TCP 1433', 'vm-jump-01 to vm-db-01 on TCP 22', 'vm-jump-01 to vm-db-01 on TCP 3389', 'vm-web-01 to vm-db-01 on TCP 22'],
    answer: [0, 2],
    explanation: "Only nsg-db filters, and only inbound to snet-db matters (outbound from snet-web and snet-mgmt isn't filtered; replies are stateful). **vm-web-01:1433**: its NIC is in asg-web, vm-db-01 is in asg-db, rule 100 allows. **vm-jump-01:22**: 10.10.1.10 is in 10.10.1.0/24, rule 200 allows. vm-web-02 isn't in asg-web, so rule 100 doesn't match and rule 300 denies it (VirtualNetwork includes the VNet). vm-jump-01 on 3389 misses rule 200 and is denied by 300 because **VirtualNetwork includes peered VNets**. vm-web-01 on 22 misses 100 and 200 and is denied by 300." },
  { topic: '4.2', type: 'single', difficulty: 2, lesson: L421,
    stem: 'Refer to the exhibit. Adding nic-web-03 to asg-web fails. vm-web-03 must still be targeted by ASG-based NSG rules for the web tier. What should you do?',
    exhibit: `Application security group asg-web (East US, rg-app-prod)
Members (in the order they were added):
  nic-web-01   vnet-app  (10.30.0.0/16)
  nic-web-02   vnet-app  (10.30.0.0/16)
Attempted:
  nic-web-03   vnet-app2 (10.31.0.0/16, peered with vnet-app)  -> failed`,
    options: ['Create a separate ASG for the NICs in vnet-app2 and reference it in the NSG rules that protect vnet-app2', 'Peer vnet-app2 with vnet-app again with Allow forwarded traffic enabled', 'Move asg-web to the resource group that contains vnet-app2', 'Add the address range of vnet-app2 to asg-web'],
    answer: [0],
    explanation: "Learn: all network interfaces in an ASG must be in the **same virtual network** as the first NIC added to it, and peering doesn't change that. Use a second ASG for vnet-app2's NICs. Resource groups don't matter, and ASGs hold NICs, not address ranges." },
  { topic: '4.2', type: 'single', difficulty: 3, lesson: L422,
    stem: 'Refer to the exhibit. vm-app-01 can\'t connect to stcontosodata01 (a storage account in East US) on TCP 443. Internet access from the VM must stay blocked. What should you do?',
    exhibit: `nsg-nic-app01 (NIC of vm-app-01) - outbound
Priority  Name              Destination      Port  Protocol  Action
100       allow-storage     Storage.EastUS   443   TCP       Allow
(default rules follow)

nsg-snet-app (snet-app, contains vm-app-01) - outbound
Priority  Name              Destination      Port  Protocol  Action
4000      deny-internet     Internet         Any   Any       Deny
(default rules follow)`,
    options: ['Add an outbound rule to nsg-snet-app that allows TCP 443 to Storage.EastUS with a priority lower than 4000', 'Change the priority of allow-storage in nsg-nic-app01 from 100 to 4001', 'Enable the Microsoft.Storage service endpoint on snet-app; NSG rules don\'t apply to service endpoint traffic', 'Remove nsg-nic-app01 from the NIC'],
    answer: [0],
    explanation: "Outbound: the NIC NSG allows the flow, then the subnet NSG evaluates it. The **Internet** tag includes **Azure-owned public IPs**, so deny-internet (4000) blocks storage too. The subnet NSG needs its own allow for Storage.EastUS above (lower number than) 4000. Priorities only compete inside one NSG. NSGs still apply to service endpoint traffic; Learn recommends service tags for exactly this pattern. Removing the NIC NSG leaves the subnet deny in place." },
  { topic: '4.2', type: 'order', difficulty: 2, lesson: L422,
    stem: 'A client on the internet connects to the Standard public IP of vm-web-01, whose subnet and NIC both have NSGs. Put the processing steps in the order they occur for the inbound packet.',
    items: ['Azure translates the destination public IP address to the NIC\'s private IP address', 'The NSG associated with the subnet evaluates the packet', 'The NSG associated with the network interface evaluates the packet', 'The guest operating system firewall on vm-web-01 evaluates the packet'],
    explanation: "Learn: for inbound traffic, NSGs process traffic **after** Azure translates public IPs to private IPs, which is why rules use private addresses. The **subnet** NSG is evaluated first, then the **NIC** NSG. Only then is the packet delivered to the VM, where the guest firewall applies." },
  { topic: '4.2', type: 'match', difficulty: 2, lesson: L423,
    stem: 'Match each requirement to the lowest Azure Bastion SKU that meets it.',
    pairs: [
      ['Test VMs in one VNet, one connection at a time, at no hourly cost', 'Developer'],
      ['Administrators connect from the portal to VMs in several peered spoke VNets, lowest cost', 'Basic'],
      ['Administrators use az network bastion ssh from their own workstations and upload files', 'Standard'],
      ['RDP and SSH sessions must be recorded, and the bastion host must not have a public IP address', 'Premium'],
    ],
    explanation: "**Developer** is free, shared, has no subnet or public IP, reaches VMs in its own VNet only, one connection at a time. **Basic** adds a dedicated host and VMs in **peered** VNets. **Standard** adds native client support (the CLI's `az network bastion ssh/rdp/tunnel`), file upload/download, IP-Connect, shareable links and host scaling. **Premium** adds **session recording** and **private-only** deployment." },
  { topic: '4.2', type: 'single', difficulty: 2, lesson: L423,
    stem: 'Refer to the exhibit. The Bastion deployment fails validation. No resources are deployed in AzureBastionSubnet. What should you change?',
    exhibit: `vnet-hub   Address space: 10.10.0.0/16
  Subnet AzureBastionSubnet   10.10.250.0/27
  Subnet snet-shared          10.10.1.0/24
Public IP pip-bas-hub: SKU Standard, Assignment Static, IPv4

az network bastion create -g rg-net-prod -n bas-hub --vnet-name vnet-hub \\
  --public-ip-address pip-bas-hub --sku Basic --location eastus`,
    options: ['Change the AzureBastionSubnet range to a /26, for example 10.10.250.0/26', 'Rename the subnet to snet-bastion', 'Replace pip-bas-hub with a Basic SKU public IP address', 'Change --sku to Premium so that no public IP address is needed'],
    answer: [0],
    explanation: "Learn: Basic, Standard and Premium need AzureBastionSubnet of **/26 or larger** (deployments since November 2, 2021); /27 is too small. The subnet is empty, so its range can be changed; 10.10.250.0/26 doesn't overlap snet-shared. The name must stay AzureBastionSubnet. Bastion requires a **Standard, static** public IP (Basic public IPs are retired). Premium's private-only option still needs a /26 AzureBastionSubnet." },
  { topic: '4.2', type: 'multi', difficulty: 2, lesson: L423,
    stem: 'You associate an NSG with AzureBastionSubnet. Which two inbound rules does Microsoft Learn list as required? (Choose two.)',
    options: ['Allow TCP 443 from the Internet service tag', 'Allow TCP 443 from the GatewayManager service tag', 'Allow TCP 3389 from the Internet service tag', 'Allow TCP 22 from the Internet service tag', 'Allow UDP 53 from the VirtualNetwork service tag', 'Allow TCP 443 from the AzureCloud service tag'],
    answer: [0, 1],
    explanation: "Learn's required inbound rules are TCP 443 from **Internet** (user sessions), TCP 443 from **GatewayManager** (control plane), TCP 443 from AzureLoadBalancer (probes) and 8080/5701 between VirtualNetwork tags. Users never reach the Bastion subnet on 3389 or 22; Bastion opens those **outbound** to the target VMs. AzureCloud on 443 is an **outbound** requirement. DNS isn't in the list." },
  { topic: '4.2', type: 'single', difficulty: 2, lesson: L424,
    stem: 'Refer to the exhibit. After the change at 09:00, VMs in snet-app receive HTTP 403 errors from stcontosodata01. VMs in snet-app must keep access, and the account must not allow other networks. What should you do?',
    exhibit: `stcontosodata01 (East US) - Networking
  Public network access: Enabled from selected networks
  Virtual networks: (none)
  IPv4 addresses: 203.0.113.10   <- public IP of the NAT gateway on snet-app

vnet-hub/snet-app (East US): NAT gateway nat-app (203.0.113.10)
09:00  Service endpoint Microsoft.Storage enabled on snet-app`,
    options: ['Add a virtual network rule for vnet-hub/snet-app to stcontosodata01', 'Add the private range 10.10.1.0/24 of snet-app as an IP rule', 'Remove the NAT gateway from snet-app', 'Change Public network access to Enabled from all networks'],
    answer: [0],
    explanation: "With a service endpoint, traffic from the subnet reaches the service with its **private** source IP and VNet identity, so the IP rule for the NAT address no longer matches (Learn warns that existing IP firewall rules stop working after the switch). Add a **virtual network rule** for the subnet. IP rules don't accept RFC 1918 ranges. Removing the NAT gateway doesn't change the source seen by storage. Allowing all networks breaks the requirement." },
  { topic: '4.2', type: 'fill', difficulty: 2, lesson: L424,
    stem: 'Refer to the exhibit. Enter the value that completes the first command.',
    exhibit: `Requirement: kv-contoso-prod must accept connections only from vnet-hub/snet-app
(firewall: allow public access from specific virtual networks and IP addresses).

az network vnet subnet update -g rg-net-prod --vnet-name vnet-hub -n snet-app \\
  --service-endpoints ________________
az keyvault network-rule add -g rg-sec-prod --name kv-contoso-prod \\
  --vnet-name vnet-hub --subnet snet-app`,
    answer: ['Microsoft.KeyVault'],
    explanation: "Key Vault's service endpoint is **Microsoft.KeyVault**. The endpoint is enabled per subnet per service and must exist before the vault's virtual network rule for that subnet is useful. Microsoft.Storage, Microsoft.Sql and others are separate endpoints." },
  { topic: '4.2', type: 'single', difficulty: 2, lesson: L424,
    stem: 'Refer to the exhibit. Security requires that VMs in snet-app can\'t copy data to any storage account other than stcontosodata01, while keeping the existing service endpoint design. What should you configure?',
    exhibit: `vnet-hub/snet-app: service endpoint Microsoft.Storage enabled
NSG nsg-snet-app outbound: allow TCP 443 to Storage.EastUS, deny Internet
Storage accounts used by the application: stcontosodata01 (rg-data-prod)`,
    options: ['A service endpoint policy that lists stcontosodata01, associated with snet-app', 'A virtual network rule for snet-app on stcontosodata01', 'An NSG rule that allows the public IP address of stcontosodata01 only', 'Replace Microsoft.Storage with Microsoft.Storage.Global on snet-app'],
    answer: [0],
    explanation: "A **service endpoint policy** on the subnet restricts service endpoint traffic to the listed storage accounts; access to any other account from that subnet is denied (Azure Storage only). A virtual network rule only controls who can reach stcontosodata01, not where the subnet can send data. Storage.EastUS covers every account in the region, and storage public IPs are shared and change, so IP-based NSG rules can't single out one account. Microsoft.Storage.Global widens the scope to other regions." },
  { topic: '4.2', type: 'single', difficulty: 2, lesson: L425,
    stem: 'Refer to the exhibit. vm-app-01 must use the private endpoint. What should you do?',
    exhibit: `Private endpoint pe-st01-blob: vnet-hub/snet-pe, 10.10.5.4, connection state Approved
Private DNS zone privatelink.blob.core.windows.net
  A  stcontosodata01  10.10.5.4
  Virtual network links: link-hub (vnet-hub)
vnet-spoke1 is peered with vnet-hub (Connected); DNS servers: Default (Azure-provided)

From vm-app-01 in vnet-spoke1:
  nslookup stcontosodata01.blob.core.windows.net  -> returns a public IP address`,
    options: ['Create a virtual network link from privatelink.blob.core.windows.net to vnet-spoke1', 'Enable Allow forwarded traffic on the peering', 'Create a second private endpoint for stcontosodata01 in vnet-spoke1', 'Create a private DNS zone named blob.core.windows.net and link it to vnet-spoke1'],
    answer: [0],
    explanation: "The public CNAME points to stcontosodata01.privatelink.blob.core.windows.net, but Azure DNS only answers from the private zone for **VNets linked to it**, and peering doesn't share DNS. Linking the zone to vnet-spoke1 makes the name resolve to 10.10.5.4, which is reachable over the peering. Forwarded traffic doesn't affect DNS. A second endpoint isn't needed. Learn warns against creating a zone for the public name blob.core.windows.net, which would break resolution of every other storage account." },
  { topic: '4.2', type: 'order', difficulty: 3, lesson: L425,
    stem: 'stcontosodata01 has a private endpoint in vnet-hub, and privatelink.blob.core.windows.net is already linked to vnet-hub. On-premises clients (using their own DNS servers over ExpressRoute) must resolve the account to its private IP without DNS server VMs in Azure. Put the steps in order.',
    items: ['Create a dedicated subnet in vnet-hub and delegate it to Microsoft.Network/dnsResolvers', 'Create an Azure DNS Private Resolver in vnet-hub with an inbound endpoint in that subnet', 'Note the private IP address assigned to the inbound endpoint', 'On the on-premises DNS servers, create a conditional forwarder for blob.core.windows.net that points to the inbound endpoint IP address'],
    explanation: "The inbound endpoint needs a subnet delegated to **Microsoft.Network/dnsResolvers**, then the resolver and endpoint, which gets an IP from it. On-premises DNS forwards to that IP. Learn specifies that the conditional forwarder targets the **public** zone name (blob.core.windows.net), not privatelink.blob.core.windows.net; the query then follows the CNAME into the linked private zone." },
  { topic: '4.2', type: 'match', difficulty: 2, lesson: L425,
    stem: 'Match each requirement to the feature that meets it.',
    pairs: [
      ['VMs in snet-app reach all storage accounts over the Azure backbone with no hourly charge, and the account firewall allows only that subnet', 'Service endpoint'],
      ['On-premises servers reach one storage account over ExpressRoute private peering while public network access is disabled', 'Private endpoint'],
      ['VMs in snet-app may use the storage service endpoint only to reach stcontosodata01 and stcontosologs01', 'Service endpoint policy'],
      ['NSG rules on snet-pe must filter traffic to the private endpoints in that subnet', 'Private endpoint network policies'],
    ],
    explanation: "**Service endpoints** are free, per subnet, keep the public endpoint and pair with a VNet rule. **Private endpoints** give one resource a private IP reachable from on-premises and work with public access disabled. **Service endpoint policies** limit which storage accounts a subnet can reach over the endpoint. NSGs and UDRs apply to private endpoints only when **private endpoint network policies** are enabled on the subnet." },
  { topic: '4.2', type: 'fill', difficulty: 2, lesson: L425,
    stem: 'Refer to the exhibit. Enter the value that completes the command.',
    exhibit: `Requirement: on-premises servers must map SMB file shares in stcontosofiles01
over the VPN, using a private IP address in vnet-hub.

said=$(az storage account show -g rg-data-prod -n stcontosofiles01 --query id -o tsv)
az network private-endpoint create -g rg-net-prod -n pe-stfiles01 \\
  --vnet-name vnet-hub --subnet snet-pe --connection-name pec-files \\
  --private-connection-resource-id $said --group-id ______`,
    answer: ['file'],
    explanation: "For a storage account, the target sub-resource (group ID) for Azure Files is **file**. Each private endpoint maps to one sub-resource, so blob access would need a second endpoint with `blob`. The matching private DNS zone is privatelink.file.core.windows.net." },
  { topic: '4.2', type: 'single', difficulty: 3, lesson: L425,
    stem: 'Refer to the exhibit. Security requires that traffic from snet-app to the private endpoint passes through the firewall at 10.20.0.4. Next hop shows that it goes directly. What should you do?',
    exhibit: `vnet-app 10.20.0.0/16
snet-app  10.20.1.0/24  route table rt-app: 0.0.0.0/0 -> VirtualAppliance 10.20.0.4
snet-pe   10.20.5.0/24  private endpoint pe-sql01 (10.20.5.4)
          Private endpoint network policies: Disabled

Effective routes on a NIC in snet-app (excerpt)
Default  Active  10.20.0.0/16    Virtual network
Default  Active  10.20.5.4/32    InterfaceEndpoint
User     Active  0.0.0.0/0       Virtual appliance  10.20.0.4`,
    options: ['Enable route table network policies for private endpoints on snet-pe, and add a route for 10.20.5.0/24 with next hop 10.20.0.4 to rt-app', 'Add a second 0.0.0.0/0 route with a lower metric to rt-app', 'Associate rt-app with snet-pe', 'Enable IP forwarding on the private endpoint network interface'],
    answer: [0],
    explanation: "A private endpoint adds a **/32** route, which beats 0.0.0.0/0 by longest prefix. Learn: with **route table network policies** enabled on the private endpoint's subnet, a UDR whose prefix is the VNet range or more specific can override the /32; a 0.0.0.0/0 UDR can't. Azure routes have no metrics. Associating rt-app with snet-pe affects traffic leaving snet-pe, not traffic to it. The private endpoint NIC is read-only." },

  // ---------- 4.3 Configure name resolution and load balancing ----------
  { topic: '4.3', type: 'single', difficulty: 2, lesson: L431,
    stem: 'Refer to the exhibit. Which record set can you add to the contoso.com zone?',
    exhibit: `Azure DNS zone: contoso.com (rg-dns-prod)
Name    Type   TTL     Value
@       NS     172800  ns1-05.azure-dns.com. (+3 more)
@       SOA    3600    ns1-05.azure-dns.com. azuredns-hostmaster.microsoft.com. ...
@       A      3600    Alias: pip-web-01 (203.0.113.10)
www     CNAME  3600    contoso.com.
api     A      300     203.0.113.20, 203.0.113.21
@       MX     3600    10 mail.contoso.com.`,
    options: ['A CNAME record set named shop with the value contoso-shop.azurewebsites.net', 'An A record set named www with the value 203.0.113.30', 'A CNAME record set named @ with the value contoso.azurefd.net', 'A second A record set named api with the value 203.0.113.22'],
    answer: [0],
    explanation: "**shop** has no existing record, so a CNAME is fine. A CNAME can't coexist with another record type of the same name, so no A record named www. A CNAME at the apex (@) is forbidden because the apex holds NS and SOA (use an alias record instead). Records with the same name and type belong to **one record set**: add 203.0.113.22 to the existing api set instead of creating another set." },
  { topic: '4.3', type: 'fill', difficulty: 2, lesson: L431,
    stem: 'Refer to the exhibit. Clients on the internet must resolve names in dev.contoso.com. Enter the record type that you must create in the contoso.com zone with the name dev.',
    exhibit: `Azure DNS zone contoso.com (delegated from the registrar, working)
  Name servers: ns1-05.azure-dns.com., ns2-05.azure-dns.net., ns3-05.azure-dns.org., ns4-05.azure-dns.info.
Azure DNS zone dev.contoso.com (new, separate zone)
  Name servers: ns1-08.azure-dns.com., ns2-08.azure-dns.net., ns3-08.azure-dns.org., ns4-08.azure-dns.info.`,
    answer: ['NS'],
    explanation: "Delegating a child zone means creating an **NS** record set named dev in the **parent** zone that lists the child zone's four name servers (ns1-08 ... ns4-08). The registrar delegation for contoso.com stays as it is. Creating the child zone with the parent option (`--parent-name contoso.com` or the portal checkbox) adds this NS record set for you." },
  { topic: '4.3', type: 'single', difficulty: 2, lesson: L431,
    stem: 'Contoso hosts contoso.com in Azure DNS. The website runs behind an Azure Front Door endpoint. Users must reach the site by typing contoso.com (no www), and the DNS record must follow the endpoint automatically. What should you create at the zone apex?',
    options: ['An alias A record set that targets the Azure Front Door endpoint', 'A CNAME record set named @ that points to the Front Door host name', 'An A record set with the current IP address of the Front Door endpoint', 'An NS record set named @ that points to Front Door'],
    answer: [0],
    explanation: "Learn lists Azure Front Door endpoints as alias targets, and alias record sets work at the **zone apex**, where a CNAME is forbidden. A static A record would break when the endpoint's address changes. The apex NS record set is reserved for the zone's own name servers." },
  { topic: '4.3', type: 'multi', difficulty: 2, lesson: L432,
    stem: 'Refer to the exhibit. Which two statements are true? (Choose two.)',
    exhibit: `Private DNS zone corp.contoso.com
Virtual network link   Virtual network   Auto-registration   Link status
link-hub               vnet-hub          Enabled             Completed
link-spoke1            vnet-spoke1       Disabled            Completed

vm-hub-01     vnet-hub     primary NIC 10.10.1.4
vm-hub-02     vnet-hub     primary NIC 10.10.1.5, second NIC 10.10.1.20
vm-spoke1-01  vnet-spoke1  primary NIC 10.21.1.4
ilb-app       vnet-hub     internal load balancer frontend 10.10.1.100`,
    options: ['An A record for vm-hub-01 is created automatically in corp.contoso.com', 'vm-spoke1-01 can resolve vm-hub-01.corp.contoso.com', 'An A record for vm-spoke1-01 is created automatically in corp.contoso.com', 'An A record for ilb-app is created automatically', 'An A record for 10.10.1.20 is created automatically', 'A PTR record for vm-hub-01 is created automatically in the zone'],
    answer: [0, 1],
    explanation: "vnet-hub's link has auto-registration, so Azure creates A records for its **VMs' primary NICs** (vm-hub-01 and vm-hub-02's 10.10.1.5). vnet-spoke1 has a **resolution** link: its VMs can query the zone but aren't registered. Learn: auto-registration covers virtual machines only (not load balancers), only the primary NIC, and doesn't create PTR records." },
  { topic: '4.3', type: 'single', difficulty: 2, lesson: L432,
    stem: 'Refer to the exhibit. You run the command and it fails. VMs in vnet-spoke2 must be able to resolve names in dev.contoso.com. What should you do?',
    exhibit: `Private DNS zone corp.contoso.com
  link-spoke2  vnet-spoke2  Auto-registration: Enabled

az network private-dns link vnet create -g rg-dns-prod -z dev.contoso.com \\
  -n link-spoke2-dev -v <vnet-spoke2-resource-id> --registration-enabled true`,
    options: ['Run the command again with --registration-enabled false', 'Delete link-spoke2 from corp.contoso.com and create it again with auto-registration disabled, then run the command unchanged', 'Peer vnet-spoke2 with a VNet that is already linked to dev.contoso.com', 'Set the DNS servers of vnet-spoke2 to 168.63.129.16'],
    answer: [0],
    explanation: "A virtual network can be linked to only **one** private DNS zone with auto-registration enabled, and vnet-spoke2 already registers in corp.contoso.com. A **resolution** link (registration disabled) to dev.contoso.com meets the requirement without changing anything else. Swapping the registration would break auto-registration in corp.contoso.com, which wasn't asked for. Peering doesn't share private zone links. Azure-provided DNS is already the default and resolves only linked zones." },
  { topic: '4.3', type: 'single', difficulty: 1, lesson: L432,
    stem: 'You change the DNS servers of vnet-app from Default (Azure-provided) to Custom: 10.10.2.4 and 10.10.2.5. Existing VMs in vnet-app keep using 168.63.129.16. What should you do?',
    options: ['Renew the DHCP lease on the VMs, for example by restarting them', 'Associate a route table that sends 168.63.129.16/32 to the new DNS servers', 'Create a private DNS zone and link it to vnet-app', 'Add an outbound NSG rule that denies UDP 53 to 168.63.129.16'],
    answer: [0],
    explanation: "Learn: VMs pick up a changed DNS server list only after a **DHCP lease renewal** (`ipconfig /renew`, or restart the VM). A route table can't redirect 168.63.129.16, which is a host virtual IP. A private zone doesn't change which server VMs query. Blocking Azure DNS would break resolution instead of switching it." },
  { topic: '4.3', type: 'single', difficulty: 2, lesson: L434,
    stem: 'Refer to the exhibit. Health Probe Status for lb-web is 0 for both backends, and the website can\'t be reached through the load balancer. What should you do?',
    exhibit: `lb-web (Standard, public)   Rule rule-https: TCP 443 -> bep-web:443, probe hp-tcp80
Probe hp-tcp80: TCP port 80, interval 5 seconds
Both backend VMs listen on TCP 80 and 443; guest firewalls allow both.

nsg-snet-web (subnet of both VMs) - inbound
Priority  Name                           Source             Destination  Port  Protocol  Action
100       allow-https                    Internet           Any          443   TCP       Allow
4000      deny-all                       Any                Any          Any   Any       Deny
65000     AllowVNetInBound               VirtualNetwork     VirtualNetwork Any Any       Allow
65001     AllowAzureLoadBalancerInBound  AzureLoadBalancer  Any          Any   Any       Allow
65500     DenyAllInBound                 Any                Any          Any   Any       Deny`,
    options: ['Add an inbound rule with priority lower than 4000 that allows the AzureLoadBalancer service tag to TCP 80', 'Change the priority of allow-https to 65002', 'Change the probe interval to 15 seconds', 'Enable floating IP on rule-https'],
    answer: [0],
    explanation: "Probes come from 168.63.129.16 (**AzureLoadBalancer**) to TCP 80. Rule 100 matches only 443; rule **4000 deny-all** matches and drops the probe before the default **65001** allow is reached. With every backend marked down, no new flows are sent. Allow AzureLoadBalancer to the probe port with a lower number than 4000. Custom priorities can't exceed 4096. The interval doesn't matter when every probe is blocked. Floating IP changes the destination address seen by the backend, not probe reachability." },
  { topic: '4.3', type: 'single', difficulty: 2, lesson: L434,
    stem: 'Refer to the exhibit. Both backends show as unhealthy, although https://<VM private IP>/ returns the site (HTTP 200) when each VM is tested directly from another VM in the VNet. What should you do?',
    exhibit: `lb-web (Standard, public) frontend 203.0.113.40
Rule rule-https: TCP 443 -> bep-web:443, probe hp-http
Probe hp-http: HTTP, port 80, path /
Web server configuration on both VMs: every request on port 80 receives
  "301 Moved Permanently" with Location: https://<host>/
NSGs allow AzureLoadBalancer; guest firewalls allow TCP 80 and 443.`,
    options: ['Change the probe to HTTPS on port 443 with a path that returns HTTP 200', 'Increase the probe threshold', 'Change the probe path to /index.html on port 80', 'Enable TCP reset on rule-https'],
    answer: [0],
    explanation: "An HTTP or HTTPS probe is healthy only on **HTTP 200**; a 301 redirect marks the instance down immediately. Every port 80 request is redirected, including /index.html. Probe HTTPS on 443 (or a TCP probe, or a health path that returns 200 without redirecting). A threshold doesn't change how a non-200 answer is treated. TCP reset affects idle flows, not probes." },
  { topic: '4.3', type: 'match', difficulty: 2, lesson: L433,
    stem: 'Match each requirement to the Azure load-balancing service that fits best.',
    pairs: [
      ['Distribute UDP 5060 SIP traffic across VMs in one region with the lowest latency', 'Azure Load Balancer'],
      ['Route /images/* and /api/* to different backend pools in one region and protect them with a WAF', 'Application Gateway'],
      ['Serve a global web app from edge locations with caching, WAF and fast failover between regions', 'Azure Front Door'],
      ['Direct users of a non-HTTP service to the closest healthy region by using DNS responses', 'Traffic Manager'],
      ['Give a TCP service deployed in three regions one static anycast IP address', 'Cross-region (global) load balancer'],
    ],
    explanation: "**Azure Load Balancer** is regional layer 4 (TCP/UDP, any port). **Application Gateway** is regional layer 7 (path-based routing, TLS termination, WAF). **Front Door** is global layer 7 at Microsoft's edge. **Traffic Manager** is global and DNS-based, so it works for any protocol but doesn't proxy traffic. The **cross-region load balancer** (Global tier) provides a static anycast IP in front of regional Standard public load balancers." },
  { topic: '4.3', type: 'single', difficulty: 2, lesson: L434,
    stem: 'Refer to the exhibit. VMs in the backend pool of lb-int can\'t reach the internet to download packages. The solution must use a static egress IP address and must not expose the VMs to inbound internet traffic. What should you do?',
    exhibit: `lb-int: Standard SKU, internal, frontend 10.20.1.100, backend pool bep-app (vm-app-01, vm-app-02)
Subnet snet-app (10.20.1.0/24): Default outbound access Disabled; NAT gateway None; Route table None
VMs have no public IP addresses.`,
    options: ['Associate a NAT gateway with a Standard public IP address with snet-app', 'Add an outbound rule to lb-int', 'Change lb-int to the Basic SKU', 'Assign a Standard public IP address to the lb-int frontend configuration'],
    answer: [0],
    explanation: "A Standard internal load balancer provides **no outbound connectivity**; Learn's fix is an explicit method, with **NAT gateway** recommended: static egress IP, and it never accepts unsolicited inbound connections. Outbound rules exist only on **public** load balancers. Basic load balancers are retired. A public frontend would make it a public load balancer and expose services, and needs NSG and rule redesign." },
  { topic: '4.3', type: 'multi', difficulty: 3, lesson: L434,
    stem: 'Refer to the exhibit. Outbound HTTPS calls from the backend VMs to a partner API fail intermittently at peak hours. Which two actions resolve the issue? (Choose two.)',
    exhibit: `lb-web-pub: Standard, public, one frontend IP (pip-web, 203.0.113.40)
Outbound connectivity: provided by load-balancing rule rule-https (default port allocation)
Backend pool: 60 VMs

Metrics, last hour
  SNAT Connection Count (Connection State = Failed), Sum: 1,240
  Used SNAT Ports, Max per backend instance: 512
  Allocated SNAT Ports, per backend instance: 512`,
    options: ['Associate a NAT gateway with the backend subnet', 'Disable outbound SNAT on rule-https and create an outbound rule that uses additional frontend IP addresses with manually allocated ports', 'Increase the idle timeout of rule-https to 30 minutes', 'Change session persistence on rule-https to Client IP', 'Add a second health probe to rule-https'],
    answer: [0, 1],
    explanation: "Failed SNAT connections with **Used = Allocated** ports per instance is **SNAT exhaustion**. With default allocation, Learn's table gives 512 ports per instance for a 51–100 VM pool on one frontend IP. A **NAT gateway** (Learn's recommended outbound method, with dynamic allocation) or an **outbound rule** with more frontend IPs and manual allocation (each IP adds 64,000 ports) fixes it. A longer idle timeout holds ports longer and makes it worse. Session persistence and probes affect inbound distribution, not SNAT." },
  { topic: '4.3', type: 'fill', difficulty: 2, lesson: L433,
    stem: 'Refer to the exhibit. Enter the value that completes the command.',
    exhibit: `Requirement: lb-web must send every request from the same client IP address to the
same backend VM, whatever the protocol or source port. Rule rule-app currently uses the
default distribution (five-tuple hash).

az network lb rule update -g rg-web-prod --lb-name lb-web -n rule-app \\
  --load-distribution ________`,
    answer: ['SourceIP'],
    explanation: "Session persistence **Client IP** is a two-tuple hash (source IP, destination IP): `--load-distribution SourceIP`. `SourceIPProtocol` (Client IP and protocol) adds the protocol, so the same client could land on different VMs for TCP and UDP. `Default` is the five-tuple hash that includes the source port." },
  { topic: '4.3', type: 'single', difficulty: 3, lesson: L433,
    stem: 'Refer to the exhibit. All TCP and UDP traffic from the spokes, on every port, must be load-balanced across both firewall VMs. What should you configure on lb-fw?',
    exhibit: `vnet-hub: vm-fw-01 (10.10.3.4) and vm-fw-02 (10.10.3.5), IP forwarding enabled on both NICs
lb-fw: Standard SKU, internal, frontend 10.10.3.100, backend pool bep-fw (both firewall NICs)
Spoke route tables: 0.0.0.0/0 -> VirtualAppliance 10.10.3.100`,
    options: ['A load-balancing rule with protocol All and frontend and backend port 0 (HA ports)', 'One load-balancing rule per port from 1 to 65535', 'An inbound NAT rule with a frontend port range of 1-65535', 'An outbound rule with protocol All'],
    answer: [0],
    explanation: "**HA ports** is a load-balancing rule on an **internal Standard** load balancer with protocol **All** and ports **0**: it balances every TCP and UDP flow on every port, the documented pattern for NVA high availability behind a UDR. Per-port rules hit rule limits and are unmanageable. Inbound NAT rules map ports to individual instances. Outbound rules define SNAT for public load balancers." },
  { topic: '4.3', type: 'order', difficulty: 2, lesson: L433,
    stem: 'You are building a public load balancer for vm-web-01 and vm-web-02 by using the Azure CLI. Put the commands in the order they must run.',
    items: ['az network public-ip create --sku Standard', 'az network lb create --sku Standard --public-ip-address --frontend-ip-name --backend-pool-name', 'az network lb probe create', 'az network lb rule create --probe'],
    explanation: "`lb create --public-ip-address` references the Standard public IP you created, so that IP must exist first. `lb create` builds the load balancer with the frontend and backend pool. The probe is a child of the load balancer, and the load-balancing rule references the frontend, the backend pool and the **probe**, so it comes last." },
];

export default bank.map((item, i) => ({ id: `d4-${String(i + 1).padStart(3, '0')}`, ...item }));
