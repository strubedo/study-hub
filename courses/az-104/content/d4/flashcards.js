// Domain 4 — Implement and manage virtual networking. Original flashcards; facts checked against Microsoft Learn
// on 2026-11-23 (see REVIEW-TODO.md for sources and items still to confirm in a subscription).
let n = 0;
const c = (topic, front, back) => ({ id: `d4-f${String(++n).padStart(3, '0')}`, topic, front, back });

export default [
  // 4.1
  c('4.1', 'Which addresses does Azure reserve in every subnet?', 'Five: network address, .1 default gateway, .2 and .3 (Azure DNS mapping) and the last address. Usable = 2^(32-prefix) - 5.'),
  c('4.1', 'Smallest and largest subnet sizes?', 'IPv4 smallest /29 (3 usable), largest /2. IPv6 subnets must be exactly /64.'),
  c('4.1', 'Required sizes for GatewaySubnet, AzureBastionSubnet, AzureFirewallSubnet?', 'GatewaySubnet /27 or larger (only the Basic VPN SKU allows /29); AzureBastionSubnet /26 or larger; AzureFirewallSubnet /26.'),
  c('4.1', 'What changed for API versions after March 31, 2026?', 'Subnets in **new** VNets get `defaultOutboundAccess = false` (private subnets); VMs need explicit outbound (NAT gateway, public IP, LB outbound rules). Portal already defaults to private. Existing VNets unchanged.'),
  c('4.1', 'Outbound precedence in a subnet (Learn)?', 'UDR to virtual appliance or VPN/ER gateway > NAT gateway > instance-level public IP > load balancer outbound rules > default route to the internet.'),
  c('4.1', 'Is VNet peering transitive?', 'No. Peer the VNets directly, or route through an NVA/firewall in the hub with UDRs, IP forwarding and allow forwarded traffic.'),
  c('4.1', 'Gateway transit settings?', 'Hub link: `--allow-gateway-transit` (hub must have a gateway). Spoke link: `--use-remote-gateways` (spoke can\'t have its own gateway).'),
  c('4.1', 'What must you do after changing the address space of a peered VNet?', 'Sync each peering: portal **Sync**, `az network vnet peering sync`, `Sync-AzVirtualNetworkPeering`. Learn: sync after every resize.'),
  c('4.1', 'Basic SKU public IP status (Learn)?', 'Retired on September 30, 2025. Existing ones keep running unsupported without SLA; upgrade to Standard.'),
  c('4.1', 'Standard public IP key properties?', 'Static only; closed to inbound until an NSG allows (secure by default); zonal or zone-redundant (fixed at creation); IPv4 or IPv6.'),
  c('4.1', 'Route selection order?', 'Longest prefix match first; on an identical prefix: User (UDR) > BGP (virtual network gateway) > Default (system).'),
  c('4.1', 'UDR next hop types?', '`VirtualAppliance` (with IP), `VirtualNetworkGateway` (VPN gateway), `VnetLocal`, `Internet`, `None` (drop). Not peering or service endpoint.'),
  c('4.1', 'IP flow verify vs next hop vs connection troubleshoot?', 'IP flow verify: NSG allow/deny + deciding rule (TCP/UDP). Next hop: route chosen. Connection troubleshoot: end-to-end test now and where it fails.'),
  c('4.1', 'NSG flow logs status (Learn)?', 'Retire September 30, 2027; new NSG flow logs can no longer be created. Use virtual network flow logs (VNet, subnet or NIC).'),
  // 4.2
  c('4.2', 'NSG default rules?', 'Inbound: 65000 AllowVNetInBound, 65001 AllowAzureLoadBalancerInBound, 65500 DenyAllInBound. Outbound: 65000 AllowVnetOutBound, 65001 AllowInternetOutBound, 65500 DenyAllOutBound.'),
  c('4.2', 'NSG evaluation order with subnet and NIC NSGs?', 'Inbound: subnet then NIC. Outbound: NIC then subnet. Both must allow; first deny stops evaluation.'),
  c('4.2', 'What does the VirtualNetwork service tag include?', 'The VNet address space, peered VNets, gateway-connected VNets and on-premises ranges, the host IP 168.63.129.16, and UDR prefixes.'),
  c('4.2', 'ASG constraint?', 'All NICs in an ASG must be in the same VNet as the first NIC added; source and destination ASGs in one rule must be in the same VNet.'),
  c('4.2', 'Bastion SKU feature ladder?', 'Developer: free, same VNet, one session. Basic: peered VNets. Standard: native client, file transfer, IP-Connect, shareable link, scaling. Premium: session recording, private-only.'),
  c('4.2', 'Bastion deployment requirements (dedicated SKUs)?', 'Subnet named AzureBastionSubnet, /26 or larger; Standard static public IP (not for Premium private-only). Upgrades allowed, downgrades not.'),
  c('4.2', 'Service endpoint in one sentence?', 'Per subnet, per service: traffic uses the backbone with the VM\'s private IP and subnet identity; pair with a VNet rule on the resource; public endpoint and DNS unchanged.'),
  c('4.2', 'Private endpoint DNS chain for blob?', '`name.blob.core.windows.net` CNAME `name.privatelink.blob.core.windows.net`; the linked private zone returns the private A record.'),
  c('4.2', 'Do NSGs apply to private endpoints by default?', 'No. Enable private endpoint network policies on the subnet (`NetworkSecurityGroupEnabled`, `RouteTableEnabled` or `Enabled`).'),
  // 4.3
  c('4.3', 'How do you delegate a subdomain hosted in another Azure DNS zone?', 'Create an NS record set with the subdomain name in the parent zone, listing the child zone\'s four Azure name servers.'),
  c('4.3', 'Why use an alias record set?', 'Points A/AAAA/CNAME at an Azure resource (Standard public IP, Traffic Manager, Front Door, CDN); works at the zone apex and prevents dangling records.'),
  c('4.3', 'Private DNS auto-registration rules?', 'VMs only, primary NIC, A records (no PTR); removed when the VM is stopped or deleted; one registration zone per VNet; 100 registration VNets per zone.'),
  c('4.3', 'Basic Load Balancer status (Learn)?', 'Retired on September 30, 2025. Use Standard: secure by default, zones, HTTPS probes, HA ports, outbound rules, metrics, 99.99% SLA.'),
  c('4.3', 'Session persistence options and CLI values?', 'None = 5-tuple (`Default`); Client IP = 2-tuple (`SourceIP`); Client IP and protocol = 3-tuple (`SourceIPProtocol`).'),
  c('4.3', 'HA ports rule?', 'Internal Standard LB rule with protocol All and ports 0: balances every TCP and UDP flow; used for NVA high availability.'),
  c('4.3', 'Top causes of unhealthy LB backends?', 'NSG blocking AzureLoadBalancer (custom deny above 65001), guest firewall, nothing listening on the probe port, HTTP probe path not returning 200.'),
  c('4.3', 'Backends of a Standard internal LB can\'t reach the internet. Fix?', 'Add explicit outbound: NAT gateway on the subnet (recommended), public IPs on NICs, or a public Standard LB with outbound rules.'),
];
