export default [
  {
    id: 'd4-001',
    topic: '4.1',
    type: 'single',
    difficulty: 2,
    stem: "Your network contains an AD DS forest named contoso.com that has two domains: contoso.com and east.contoso.com. All domain controllers run Windows Server 2025 and the DNS Server role. On DC1 in contoso.com, you create an Active Directory-integrated zone named apps.contoso.com by using the default settings. The DNS servers in east.contoso.com must host a copy of the zone. The solution must minimise administrative effort. Which command should you run?",
    options: [
      "Set-DnsServerPrimaryZone -Name 'apps.contoso.com' -ReplicationScope Forest",
      "Set-DnsServerPrimaryZone -Name 'apps.contoso.com' -ReplicationScope Legacy",
      "Add-DnsServerSecondaryZone -Name 'apps.contoso.com' -ZoneFile 'apps.contoso.com.dns' -MasterServers 10.0.0.10 on each DC in east.contoso.com",
      "Set-DnsServerPrimaryZone -Name 'apps.contoso.com' -ReplicationScope Domain",
    ],
    answer: [0],
    explanation: "New AD-integrated zones default to **Domain** scope (DomainDnsZones), so only DNS servers on DCs in contoso.com get the zone. Changing the scope to **Forest** moves it to ForestDnsZones, which replicates to every DC running DNS in every domain of the forest, with one command.\n\n- **Legacy** stores the zone in the contoso.com domain partition, which still never leaves that domain.\n- **Domain** is the current setting.\n- Secondary zones on every east.contoso.com DC would work but need zone transfers and per-server configuration, which is more effort and loses multimaster updates.",
    lesson: '4.1-dns-ad-zones-records',
  },
  {
    id: 'd4-002',
    topic: '4.1',
    type: 'single',
    difficulty: 2,
    stem: "Your network contains an AD DS domain named contoso.com. A member server named Server1 runs Windows Server 2025 and hosts the contoso.com zone. You need to ensure that only authenticated domain computers can register and update records in the zone. Refer to the exhibit. What should you do?",
    exhibit: `PS C:\\> Get-DnsServerZone -Name contoso.com -ComputerName Server1 | Format-List ZoneName, ZoneType, IsDsIntegrated, DynamicUpdate, ZoneFile

ZoneName       : contoso.com
ZoneType       : Primary
IsDsIntegrated : False
DynamicUpdate  : NonsecureAndSecure
ZoneFile       : contoso.com.dns`,
    options: [
      "Run Set-DnsServerPrimaryZone -Name contoso.com -DynamicUpdate Secure on Server1.",
      "Host the zone as an Active Directory-integrated zone on a domain controller, and then configure the zone to allow secure dynamic updates only.",
      "Add Server1 to the DnsUpdateProxy group.",
      "Enable aging on the zone and configure a no-refresh interval of seven days.",
    ],
    answer: [1],
    explanation: "Secure-only dynamic updates rely on ACLs on AD objects, so they are available **only for Active Directory-integrated zones**, and AD-integrated zones can only be hosted on DCs. The exhibit shows a file-backed primary zone on a member server, so the zone must be moved to (or recreated as AD-integrated on) a DC and then set to `Secure`.\n\n- `-DynamicUpdate Secure` is rejected for a file-backed zone.\n- DnsUpdateProxy removes record ownership; it weakens rather than enforces security.\n- Aging controls scavenging, not who can update.",
    lesson: '4.1-dns-ad-zones-records',
  },
  {
    id: 'd4-003',
    topic: '4.1',
    type: 'multi',
    difficulty: 1,
    stem: "You manage DNS on domain controllers that run Windows Server 2025. Which three objects can be stored in AD DS? (Choose three.)",
    options: [
      "A primary zone",
      "A stub zone",
      "A conditional forwarder",
      "A secondary zone",
      "The cache of a caching-only DNS server",
    ],
    answer: [0, 1, 2],
    explanation: "Primary zones, stub zones and conditional forwarders can all be stored in an AD DS partition and replicated with the chosen scope.\n\n- A **secondary zone** is a read-only copy obtained by zone transfer and is always file-based.\n- The DNS cache is held in memory on each server and is never written to AD DS.",
    lesson: '4.1-dns-ad-zones-records',
  },
  {
    id: 'd4-004',
    topic: '4.1',
    type: 'single',
    difficulty: 2,
    stem: "You have an AD-integrated zone named contoso.com. Aging is configured as shown in the exhibit. A laptop named LT42 registered its A record and then left the network permanently. When does the LT42 record first become eligible for scavenging?",
    exhibit: `PS C:\\> Get-DnsServerZoneAging -Name contoso.com

ZoneName             : contoso.com
AgingEnabled         : True
AvailForScavengeTime : 9/2/2026 4:00:00 AM
RefreshInterval      : 4.00:00:00
NoRefreshInterval    : 3.00:00:00
ScavengeServers      : {10.0.0.10}

PS C:\\> Get-DnsServerResourceRecord -ZoneName contoso.com -Name LT42 | Format-List HostName, RecordType, Timestamp

HostName   : LT42
RecordType : A
Timestamp  : 10/1/2026 9:00:00 AM`,
    options: [
      "After 10/4/2026 9:00 AM",
      "After 10/5/2026 9:00 AM",
      "After 10/8/2026 9:00 AM",
      "After 10/15/2026 9:00 AM",
    ],
    answer: [2],
    explanation: "A record is stale when **timestamp + no-refresh interval + refresh interval** has passed: 10/1 9:00 AM + 3 days + 4 days = **10/8/2026 9:00 AM**. It is then deleted at the next scavenging pass run by 10.0.0.10.\n\n- 10/4 is only the end of the no-refresh interval; refreshes become possible then.\n- 10/5 adds only the refresh interval.\n- 10/15 is what the default 7 + 7 days would give.\n\nThe AvailForScavengeTime (zone grace period) is already in the past, so it does not delay this record.",
    lesson: '4.1-dns-ad-zones-records',
  },
  {
    id: 'd4-005',
    topic: '4.1',
    type: 'single',
    difficulty: 2,
    stem: "Your network contains an AD DS domain named contoso.com. Stale dynamic records accumulate in the contoso.com zone even though aging is enabled on the zone. DC1, DC2 and DC3 host the zone. You need stale records to be removed automatically. Refer to the exhibit, which shows identical output on all three DCs. What should you do?",
    exhibit: `PS C:\\> Get-DnsServerScavenging -ComputerName DC1

NoRefreshInterval  : 7.00:00:00
RefreshInterval    : 7.00:00:00
ScavengingInterval : 00:00:00
ScavengingState    : False
LastScavengeTime   :`,
    options: [
      "Run Start-DnsServerScavenging on DC1.",
      "Run Set-DnsServerScavenging -ScavengingState $true -ScavengingInterval 7.00:00:00 on DC1.",
      "Run Set-DnsServerZoneAging -Name contoso.com -Aging $true on DC1.",
      "Reduce the refresh interval of the zone to one day.",
    ],
    answer: [1],
    explanation: "Scavenging needs both zone aging **and** at least one server with automatic scavenging enabled. Every server shows `ScavengingState : False`, so no server ever runs a scheduled pass. Enabling scavenging on one DC fixes it.\n\n- `Start-DnsServerScavenging` runs a single manual pass; stale records would come back over time.\n- Aging is already enabled on the zone.\n- Shorter intervals make records stale sooner but nobody would delete them.",
    lesson: '4.1-dns-ad-zones-records',
  },
  {
    id: 'd4-006',
    topic: '4.1',
    type: 'single',
    difficulty: 2,
    stem: "You have an AD-integrated zone named contoso.com with aging enabled and scavenging running on DC1. Stale records for DHCP clients are removed as expected, but several records for decommissioned servers are never removed. Refer to the exhibit. What is the most likely reason?",
    exhibit: `PS C:\\> Get-DnsServerResourceRecord -ZoneName contoso.com -RRType A | Where-Object HostName -like 'OLD*'

HostName                  RecordType Type       Timestamp            TimeToLive      RecordData
--------                  ---------- ----       ---------            ----------      ----------
OLDAPP01                  A          1          0                    01:00:00        10.0.4.21
OLDAPP02                  A          1          0                    01:00:00        10.0.4.22
OLDSQL01                  A          1          0                    01:00:00        10.0.4.30`,
    options: [
      "The records have a zero timestamp because they were created manually, so they are static and never scavenged.",
      "The records are still inside the no-refresh interval.",
      "DC1 is not listed as a scavenging server for the zone.",
      "The zone uses secure dynamic updates, which prevents scavenging.",
    ],
    answer: [0],
    explanation: "A `Timestamp` of **0** marks a static record. Records added manually without `-AgeRecord` (or with **Delete this record when it becomes stale** cleared) are never scavenged. Delete them manually or recreate them with a timestamp.\n\n- The no-refresh interval only applies to records with a non-zero timestamp.\n- The stem says scavenging runs on DC1, and dynamic records are being removed elsewhere.\n- Secure dynamic updates have no effect on scavenging.",
    lesson: '4.1-dns-ad-zones-records',
  },
  {
    id: 'd4-007',
    topic: '4.1',
    type: 'fill',
    difficulty: 1,
    stem: "You have just enabled aging on a zone and scavenging on DC1. You need to trigger an immediate scavenging pass on DC1 instead of waiting for the next scheduled pass. Which cmdlet should you run?",
    answer: ['Start-DnsServerScavenging'],
    explanation: "`Start-DnsServerScavenging` runs a scavenging pass immediately (add `-Verbose` to see what it deletes). It does not change the schedule of the next automatic pass. `Set-DnsServerScavenging` configures the schedule; `Set-DnsServerZoneAging` configures zone aging.",
    lesson: '4.1-dns-ad-zones-records',
  },
  {
    id: 'd4-008',
    topic: '4.1',
    type: 'single',
    difficulty: 2,
    stem: "Your network contains an AD DS domain named contoso.com. The contoso.com zone accepts secure dynamic updates only. DHCP1 registers A and PTR records on behalf of clients. You replace DHCP1 with DHCP2, which is also a domain controller. DHCP2 cannot update records that DHCP1 created. You need to prevent this problem in the future without weakening the security of DNS records. What should you do?",
    options: [
      "Add DHCP2 to the DnsUpdateProxy group.",
      "Configure DHCP2, and any future DHCP servers, to use the same dedicated user account for DNS dynamic update credentials.",
      "Change the zone to allow nonsecure and secure dynamic updates.",
      "Enable Name Protection on all scopes on DHCP2.",
    ],
    answer: [1],
    explanation: "With secure updates the identity that creates a record owns it. If every DHCP server registers records using the **same DNS dynamic update credential** (`Set-DhcpServerDnsCredential`), any of them can update records created by the others.\n\n- DnsUpdateProxy makes records ownerless, and on a DHCP server that is also a DC it can leave the DC's own records unsecured.\n- Allowing nonsecure updates removes the protection entirely.\n- Name Protection (DHCID) stops name squatting between clients; it does not solve ownership between DHCP servers.",
    lesson: '4.1-dns-ad-zones-records',
  },
  {
    id: 'd4-009',
    topic: '4.1',
    type: 'fill',
    difficulty: 2,
    stem: "You configure an existing AD-integrated zone by running Set-DnsServerPrimaryZone -ReplicationScope Forest. Which AD DS application directory partition stores the zone? Type the partition name.",
    answer: ['ForestDnsZones', 'ForestDnsZones partition', 'DC=ForestDnsZones', 'ForestDnsZones.contoso.com'],
    explanation: "Forest scope stores the zone in **ForestDnsZones**, which replicates to every DC running DNS in the forest. Domain scope uses **DomainDnsZones**; Legacy uses the domain partition itself; Custom uses an application partition you create.",
    lesson: '4.1-dns-ad-zones-records',
  },
  {
    id: 'd4-010',
    topic: '4.1',
    type: 'single',
    difficulty: 3,
    stem: "Your network contains an AD DS domain named contoso.com. You promoted DC2 yesterday. Clients never use DC2 for authentication. The network adapter on DC2 is configured to use 8.8.8.8 as its only DNS server. Refer to the exhibit, which was run on a client. What should you do to resolve the issue?",
    exhibit: `PS C:\\> Resolve-DnsName -Name _ldap._tcp.dc._msdcs.contoso.com -Type SRV

Name                                     Type   TTL   Section    NameTarget                     Priority Weight Port
----                                     ----   ---   -------    ----------                     -------- ------ ----
_ldap._tcp.dc._msdcs.contoso.com         SRV    600   Answer     DC1.contoso.com                0        100    389

Name       : DC1.contoso.com
QueryType  : A
TTL        : 3600
Section    : Additional
IP4Address : 10.0.0.10`,
    options: [
      "Run ipconfig /registerdns on DC2.",
      "Configure DC2 to use an internal DNS server that hosts the contoso.com zones, and then restart the Netlogon service on DC2.",
      "Run Clear-DnsServerCache on DC1.",
      "Add an A record for DC2 to the contoso.com zone.",
    ],
    answer: [1],
    explanation: "Only DC1 is returned for the DC Locator SRV record. **Netlogon** registers a DC's SRV records against the DNS servers configured on the DC's adapter; with only 8.8.8.8 configured, the registrations went to a public resolver and failed. Point DC2 at an internal DNS server (DC1 or itself) and restart Netlogon (or run `nltest /dsregdns`).\n\n- `ipconfig /registerdns` re-registers A/PTR records only, not SRV records, and still uses the wrong DNS server.\n- Clearing DC1's cache does not create missing records.\n- An A record alone does not advertise DC2 as a domain controller.",
    lesson: '4.1-dns-ad-zones-records',
  },
  {
    id: 'd4-011',
    topic: '4.1',
    type: 'order',
    difficulty: 2,
    stem: "You have an Azure virtual network named VNet1 that is linked to an Azure Private DNS zone named azure.contoso.com. VNet1 already contains an empty /28 subnet named snet-inbound. VNet1 is connected to your on-premises network by a site-to-site VPN, and on-premises clients use DC1 for DNS. You need on-premises clients to resolve records in azure.contoso.com without deploying DNS server VMs in Azure. In which order should you perform the actions?",
    items: [
      "Create an Azure DNS Private Resolver in VNet1.",
      "Add an inbound endpoint to the resolver in snet-inbound.",
      "Record the private IP address assigned to the inbound endpoint.",
      "On DC1, create a conditional forwarder for azure.contoso.com that targets the inbound endpoint IP address.",
      "From an on-premises client, run Resolve-DnsName for a record in azure.contoso.com to confirm resolution.",
    ],
    explanation: "An inbound endpoint is a child of the resolver, so the resolver comes first. The endpoint receives its private IP from snet-inbound (which gets delegated to `Microsoft.Network/dnsResolvers`), and only then do you know the target for the on-premises conditional forwarder. Testing is possible only after the forwarder exists.",
    lesson: '4.1-dns-forwarding-hybrid',
  },
  {
    id: 'd4-012',
    topic: '4.1',
    type: 'single',
    difficulty: 2,
    stem: "You have a hub virtual network named VNet1 and a spoke virtual network named VNet2 that are peered. VNet1 contains an Azure DNS Private Resolver with an outbound endpoint and a DNS forwarding ruleset named Ruleset1. Ruleset1 has a rule that forwards contoso.com to 10.0.0.10 and 10.0.0.11 (on-premises DCs). VMs in VNet1 resolve contoso.com names, but VMs in VNet2 cannot. Both VNets use Azure-provided DNS. Refer to the exhibit. What should you do?",
    exhibit: `$ az dns-resolver vnet-link list --resource-group RG1 --ruleset-name Ruleset1 --query "[].{name:name, vnet:virtualNetwork.id, state:provisioningState}" --output json
[
  {
    "name": "vnet1-link",
    "state": "Succeeded",
    "vnet": "/subscriptions/1f2b6c3a-5d4e-4a7b-9c10-2e3f4a5b6c7d/resourceGroups/RG1/providers/Microsoft.Network/virtualNetworks/VNet1"
  }
]`,
    options: [
      "Create a second outbound endpoint in VNet2.",
      "Link Ruleset1 to VNet2.",
      "Configure VNet2 to use the outbound endpoint IP address as its DNS server.",
      "Create an inbound endpoint in VNet2.",
    ],
    answer: [1],
    explanation: "Forwarding rulesets apply only to the virtual networks that are **linked** to them. Ruleset1 is linked to VNet1 only. Adding a virtual network link for VNet2 makes VMs that use Azure-provided DNS in VNet2 follow the contoso.com rule through the existing outbound endpoint.\n\n- A ruleset can be linked to VNets other than the one hosting the outbound endpoint; a second endpoint is unnecessary.\n- An outbound endpoint is an egress point, not a DNS server that VMs can query.\n- Inbound endpoints serve queries arriving from outside Azure.",
    lesson: '4.1-dns-forwarding-hybrid',
  },
  {
    id: 'd4-013',
    topic: '4.1',
    type: 'single',
    difficulty: 2,
    stem: "Your on-premises DNS servers must resolve the Azure Private DNS zone azure.contoso.com. VNet1 contains an Azure DNS Private Resolver whose inbound endpoint IP address is 10.100.0.4. Resolution from on-premises times out. Refer to the exhibit. What should you do?",
    exhibit: `PS C:\\> Get-DnsServerZone -Name azure.contoso.com | Format-List ZoneName, ZoneType, IsDsIntegrated, ReplicationScope, MasterServers, ForwarderTimeout

ZoneName         : azure.contoso.com
ZoneType         : Forwarder
IsDsIntegrated   : True
ReplicationScope : Forest
MasterServers    : {168.63.129.16}
ForwarderTimeout : 5`,
    options: [
      "Change the conditional forwarder MasterServers value to 10.100.0.4.",
      "Increase ForwarderTimeout to 30 seconds.",
      "Change the replication scope of the conditional forwarder to Domain.",
      "Enable autoregistration on the virtual network link for VNet1.",
    ],
    answer: [0],
    explanation: "`168.63.129.16` is a virtual IP that is reachable **only from inside Azure**. On-premises DNS servers must forward to the resolver's **inbound endpoint** (10.100.0.4), which is a normal private IP reachable across the VPN.\n\n- A longer timeout does not make an unreachable address reachable.\n- Replication scope only controls which DCs get the forwarder.\n- Autoregistration creates VM records; it does not affect how on-premises servers reach Azure DNS.",
    lesson: '4.1-dns-forwarding-hybrid',
  },
  {
    id: 'd4-014',
    topic: '4.1',
    type: 'single',
    difficulty: 2,
    stem: "Your network contains an AD DS forest named contoso.com with three domains. Users must resolve names in a partner namespace named fabrikam.com by sending queries to 172.16.10.10 and 172.16.10.11. Every DNS server that runs on a domain controller in the forest must use this configuration. The solution must minimise administrative effort. What should you do?",
    options: [
      "On one domain controller, run Add-DnsServerConditionalForwarderZone -Name fabrikam.com -MasterServers 172.16.10.10, 172.16.10.11 -ReplicationScope Forest.",
      "On one domain controller, run Add-DnsServerConditionalForwarderZone -Name fabrikam.com -MasterServers 172.16.10.10, 172.16.10.11 -ReplicationScope Domain.",
      "On every domain controller, run Set-DnsServerForwarder -IPAddress 172.16.10.10, 172.16.10.11.",
      "On every domain controller, create a file-based conditional forwarder for fabrikam.com.",
    ],
    answer: [0],
    explanation: "A conditional forwarder stored in AD DS with **Forest** scope is created once and replicates to every DNS server on a DC in all three domains.\n\n- Domain scope reaches only the DCs of one domain.\n- Server forwarders would send **all** unresolved queries (including internet names) to fabrikam's servers, and must be set on every server.\n- File-based conditional forwarders work but must be configured server by server.",
    lesson: '4.1-dns-forwarding-hybrid',
  },
  {
    id: 'd4-015',
    topic: '4.1',
    type: 'match',
    difficulty: 2,
    stem: "Match each requirement to the DNS configuration that meets it with the least administrative effort.",
    pairs: [
      ["Resolve a partner domain by sending queries to two fixed IP addresses", "Conditional forwarder"],
      ["Automatically follow a partner zone when its name servers change", "Stub zone"],
      ["Hand authority for sales.contoso.com to a separate set of DNS servers", "Zone delegation"],
      ["Send every query the server cannot resolve itself to the perimeter firewall", "Server-level forwarder"],
      ["Resolve single-label names forest-wide without WINS", "GlobalNames zone"],
    ],
    explanation: "- **Conditional forwarder**: a fixed list of target IPs for one domain.\n- **Stub zone**: holds the SOA, NS and glue records and refreshes them from the masters, so it tracks NS changes.\n- **Delegation**: NS records in the parent that make another server set authoritative for a child zone.\n- **Forwarder**: the catch-all for names the server is not authoritative for.\n- **GlobalNames**: a forest-wide zone of CNAMEs for single-label names.",
    lesson: '4.1-dns-forwarding-hybrid',
  },
  {
    id: 'd4-016',
    topic: '4.1',
    type: 'multi',
    difficulty: 2,
    stem: "You have an Azure virtual network named VNet1 and an Azure Private DNS zone named azure.contoso.com. You plan to enable autoregistration on the virtual network link between them. Which two statements are true? (Choose two.)",
    options: [
      "VNet1 can be the registration network for only one private DNS zone.",
      "Autoregistration creates PTR records for each VM.",
      "Autoregistration also creates records for internal load balancers in VNet1.",
      "When a VM in VNet1 is deleted, its autoregistered record is removed automatically.",
      "VMs in VNet1 must use custom DNS servers for autoregistration to work.",
      "VNet1 can then be linked to no other private DNS zones.",
    ],
    answer: [0, 3],
    explanation: "A VNet can autoregister into **one** private zone, and Azure manages the record lifecycle, including removing it when the VM is deleted.\n\n- Autoregistration does not create PTR records.\n- It covers VMs only (primary NIC); load balancers need manual records.\n- It does not depend on custom DNS.\n- VNet1 can still have resolution-only links to many other zones.",
    lesson: '4.1-dns-forwarding-hybrid',
  },
  {
    id: 'd4-017',
    topic: '4.1',
    type: 'single',
    difficulty: 3,
    stem: "You have an Azure virtual network named VNet1 that contains two domain controllers, DC3 and DC4. The DNS servers setting of VNet1 is set to the IP addresses of DC3 and DC4. A storage account has a private endpoint whose record is in the Azure Private DNS zone privatelink.blob.core.windows.net, which is linked to VNet1. VMs in VNet1 resolve the storage account to its public IP address. You must fix resolution for VMs in VNet1 and minimise cost. What should you do?",
    options: [
      "On DC3 and DC4, create a conditional forwarder for privatelink.blob.core.windows.net that points to 168.63.129.16.",
      "Enable autoregistration on the link between VNet1 and the private zone.",
      "Change the DNS servers setting of VNet1 to an on-premises domain controller.",
      "Deploy an Azure DNS Private Resolver with an outbound endpoint and a forwarding ruleset in VNet1.",
    ],
    answer: [0],
    explanation: "When a VNet uses custom DNS servers, private zones linked to the VNet are only used if those servers send the queries to Azure DNS. DC3 and DC4 run inside Azure, so they **can** reach `168.63.129.16`; a conditional forwarder for the privatelink zone fixes resolution at no extra cost.\n\n- Autoregistration is for VM records and is irrelevant to private endpoint records.\n- On-premises DCs cannot reach `168.63.129.16` and would have the same problem.\n- An outbound endpoint and ruleset forward queries out of Azure; it adds cost and does not address the custom DNS path.",
    lesson: '4.1-dns-forwarding-hybrid',
  },
  {
    id: 'd4-018',
    topic: '4.1',
    type: 'multi',
    difficulty: 2,
    stem: "Your on-premises clients must resolve storage1.privatelink.blob.core.windows.net to the private IP address of a private endpoint in VNet1. The Azure Private DNS zone privatelink.blob.core.windows.net is linked to VNet1. On-premises DNS runs on Windows Server 2025 domain controllers. Which two actions should you perform? (Choose two.)",
    options: [
      "Deploy an Azure DNS Private Resolver with an inbound endpoint in VNet1.",
      "On the on-premises DNS servers, create a conditional forwarder for privatelink.blob.core.windows.net that targets the inbound endpoint IP address.",
      "On the on-premises DNS servers, create a conditional forwarder for privatelink.blob.core.windows.net that targets 168.63.129.16.",
      "Create a DNS forwarding ruleset that forwards privatelink.blob.core.windows.net to the on-premises DNS servers.",
      "Enable autoregistration on the VNet1 link.",
    ],
    answer: [0, 1],
    explanation: "On-premises to Azure resolution needs an IP that is reachable from on-premises and answers from Azure DNS: the Private Resolver **inbound endpoint**. The on-premises servers then conditionally forward the privatelink zone to it.\n\n- `168.63.129.16` is not reachable from on-premises.\n- A forwarding ruleset works in the opposite direction (Azure to on-premises).\n- Autoregistration does not create private endpoint records.",
    lesson: '4.1-dns-forwarding-hybrid',
  },
  {
    id: 'd4-019',
    topic: '4.1',
    type: 'single',
    difficulty: 3,
    stem: "DNS1 runs Windows Server 2025 and hosts the contoso.com zone. You run the commands shown in the exhibit on DNS1. A client with the IP address 10.44.5.7 then queries app.contoso.com. Which IP address does DNS1 return?",
    exhibit: `PS C:\\> Add-DnsServerClientSubnet -Name "LondonSubnet" -IPv4Subnet "10.44.0.0/16"
PS C:\\> Add-DnsServerClientSubnet -Name "ParisSubnet" -IPv4Subnet "10.33.0.0/16"
PS C:\\> Add-DnsServerZoneScope -ZoneName "contoso.com" -Name "LondonScope"
PS C:\\> Add-DnsServerZoneScope -ZoneName "contoso.com" -Name "ParisScope"
PS C:\\> Add-DnsServerResourceRecord -ZoneName "contoso.com" -A -Name "app" -IPv4Address "10.20.1.20"
PS C:\\> Add-DnsServerResourceRecord -ZoneName "contoso.com" -ZoneScope "LondonScope" -A -Name "app" -IPv4Address "10.44.1.20"
PS C:\\> Add-DnsServerResourceRecord -ZoneName "contoso.com" -ZoneScope "ParisScope" -A -Name "app" -IPv4Address "10.33.1.20"
PS C:\\> Add-DnsServerQueryResolutionPolicy -Name "LondonPolicy" -Action ALLOW -ClientSubnet "EQ,LondonSubnet" -ZoneScope "LondonScope,1" -ZoneName "contoso.com" -ProcessingOrder 1 -Disable
PS C:\\> Add-DnsServerQueryResolutionPolicy -Name "ParisPolicy" -Action ALLOW -ClientSubnet "EQ,ParisSubnet" -ZoneScope "ParisScope,1" -ZoneName "contoso.com" -ProcessingOrder 2`,
    options: [
      "10.44.1.20",
      "10.33.1.20",
      "10.20.1.20",
      "No answer; the query is refused.",
    ],
    answer: [2],
    explanation: "LondonPolicy matches the client subnet but was created with `-Disable`, so it is skipped. ParisPolicy does not match 10.44.5.7. No enabled policy matches, so the server answers from the **default zone scope**: 10.20.1.20.\n\n- 10.44.1.20 would be returned only if LondonPolicy were enabled.\n- 10.33.1.20 requires a client in 10.33.0.0/16.\n- A REFUSED response needs a matching policy with the DENY action.",
    lesson: '4.1-dns-policies-dnssec',
  },
  {
    id: 'd4-020',
    topic: '4.1',
    type: 'fill',
    difficulty: 1,
    stem: "You are creating a server-level DNS query resolution policy that blocks queries for a malicious domain. The DNS server must silently drop matching queries without sending any response. Which value should you specify for the -Action parameter?",
    answer: ['IGNORE'],
    explanation: "`IGNORE` drops the query with no response. `DENY` sends an error response back to the client (documented as REFUSED in the cmdlet description), so the client learns it was blocked. `ALLOW` answers the query, using the zone scopes in the policy for zone-level policies.",
    lesson: '4.1-dns-policies-dnssec',
  },
  {
    id: 'd4-021',
    topic: '4.1',
    type: 'order',
    difficulty: 3,
    stem: "Your AD-integrated zone contoso.com has never been scavenged and contains thousands of records. You need to enable scavenging while minimising the risk of deleting records for active computers. In which order should you perform the actions?",
    items: [
      "Enable aging on the contoso.com zone with Set-DnsServerZoneAging.",
      "Wait at least the combined no-refresh and refresh intervals so that active clients refresh their timestamps.",
      "Review records whose timestamps are older than the combined intervals and fix any clients that fail to register.",
      "Enable automatic scavenging on a single DNS server with Set-DnsServerScavenging.",
    ],
    explanation: "Enable aging first so the server starts recording refresh timestamps (scavenging is not yet running, so nothing is deleted). After a full no-refresh plus refresh cycle, any record that is still old belongs to a computer that is gone or that has a registration problem; investigate those before turning on deletion. Finally enable scavenging on one server so deletions happen in one place.",
    lesson: '4.1-dns-ad-zones-records',
  },
  {
    id: 'd4-022',
    topic: '4.1',
    type: 'single',
    difficulty: 2,
    stem: "DNS1 hosts the contoso.com zone. You created a client subnet named EUSubnet and a zone scope named EUScope that contains an A record for www. European clients must receive the EUScope record, and all other clients must receive the record in the default zone scope. Which command should you run?",
    options: [
      "Add-DnsServerQueryResolutionPolicy -Name 'EU' -Action ALLOW -ClientSubnet 'eq,EUSubnet' -ZoneScope 'EUScope,1' -ZoneName 'contoso.com'",
      "Add-DnsServerQueryResolutionPolicy -Name 'EU' -Action DENY -ClientSubnet 'eq,EUSubnet' -ZoneScope 'EUScope,1' -ZoneName 'contoso.com'",
      "Add-DnsServerQueryResolutionPolicy -Name 'EU' -Action ALLOW -ClientSubnet 'ne,EUSubnet' -ZoneScope 'EUScope,1' -ZoneName 'contoso.com'",
      "Add-DnsServerZoneTransferPolicy -Name 'EU' -Action ALLOW -ClientSubnet 'eq,EUSubnet' -ZoneName 'contoso.com'",
    ],
    answer: [0],
    explanation: "A zone-level query resolution policy with **ALLOW**, the criterion `eq,EUSubnet` and `-ZoneScope 'EUScope,1'` answers European clients from EUScope. Unmatched clients fall through to the default scope; no policy is needed for it.\n\n- DENY returns REFUSED to European clients.\n- `ne,EUSubnet` sends everyone **except** Europe to EUScope.\n- Zone transfer policies govern AXFR/IXFR, not client queries.",
    lesson: '4.1-dns-policies-dnssec',
  },
  {
    id: 'd4-023',
    topic: '4.1',
    type: 'single',
    difficulty: 2,
    stem: "DC1 and DC2 run Windows Server 2025 and host the AD-integrated zone contoso.com. You configured geo-location DNS policies on DC1 only, and AD replication is healthy. Clients that use DC2 always receive answers from the default zone scope. Refer to the exhibit. What should you do?",
    exhibit: `PS C:\\> Get-DnsServerQueryResolutionPolicy -ZoneName contoso.com -ComputerName DC1 | Format-Table Name, ProcessingOrder, IsEnabled

Name          ProcessingOrder IsEnabled
----          --------------- ---------
USPolicy      1               True
EuropePolicy  2               True

PS C:\\> Get-DnsServerQueryResolutionPolicy -ZoneName contoso.com -ComputerName DC2
PS C:\\>`,
    options: [
      "Force AD replication between DC1 and DC2 by running repadmin /syncall.",
      "Copy the client subnets and policies to DC2, for example by piping Get-DnsServerQueryResolutionPolicy from DC1 into Add-DnsServerQueryResolutionPolicy -ComputerName DC2.",
      "Change the replication scope of contoso.com to Forest.",
      "Restart the DNS Server service on DC2.",
    ],
    answer: [1],
    explanation: "DNS policies and client subnets are stored **locally** on each DNS server and are **not** replicated by AD DS, even for AD-integrated zones. They must be created (or exported and imported) on every DNS server that answers for the zone. The zone scopes and their records are part of the AD-integrated zone and already replicated to DC2, but the client subnets must be recreated on DC2 before the policies that reference them.\n\n- AD replication is already healthy and does not carry policies.\n- Changing the zone's replication scope does not replicate policies.\n- A restart does not create missing policies.",
    lesson: '4.1-dns-policies-dnssec',
  },
  {
    id: 'd4-024',
    topic: '4.1',
    type: 'multi',
    difficulty: 2,
    stem: "You sign the zone secure.contoso.com on DC1 by running Invoke-DnsServerZoneSign -ZoneName secure.contoso.com -SignWithDefault. Which three record types are added to the secure.contoso.com zone automatically? (Choose three.)",
    options: [
      "DNSKEY",
      "RRSIG",
      "NSEC3",
      "DS",
      "CNAME",
      "PTR",
    ],
    answer: [0, 1, 2],
    explanation: "Signing publishes the public keys (**DNSKEY**), signatures for each record set (**RRSIG**) and authenticated denial records. Default settings use **NSEC3** (plus an NSEC3PARAM record).\n\n- The **DS** record is not created automatically; it belongs in the **parent** zone (contoso.com) and must be added there to build a chain of trust.\n- CNAME and PTR records are ordinary records that signing does not create.",
    lesson: '4.1-dns-policies-dnssec',
  },
  {
    id: 'd4-025',
    topic: '4.1',
    type: 'single',
    difficulty: 2,
    stem: "The zone secure.contoso.com is signed with DNSSEC, and your DNS servers have the required trust anchors. Windows client computers must treat any response for names in secure.contoso.com that was not validated by the DNS server as a failed lookup. What should you configure?",
    options: [
      "A Group Policy NRPT rule for .secure.contoso.com with DNSSEC enabled and validation required (Add-DnsClientNrptRule -DnsSecEnable -DnsSecValidationRequired).",
      "A trust anchor on each client computer by running Add-DnsServerTrustAnchor.",
      "Re-sign the zone by running Invoke-DnsServerZoneSign -DoResign.",
      "A DNS query resolution policy that denies unsigned responses.",
    ],
    answer: [0],
    explanation: "Windows clients are non-validating resolvers. The **Name Resolution Policy Table** tells them to request DNSSEC data for a namespace and to **require** that the server validated it; otherwise the lookup fails.\n\n- `Add-DnsServerTrustAnchor` is a DNS Server cmdlet; trust anchors belong on validating DNS servers, not clients.\n- Re-signing changes nothing about client behaviour.\n- DNS policies cannot filter on validation status.",
    lesson: '4.1-dns-policies-dnssec',
  },
  {
    id: 'd4-026',
    topic: '4.1',
    type: 'single',
    difficulty: 3,
    stem: "Your network contains an AD DS domain named contoso.com. DC1 is the Key Master for the signed AD-integrated zone secure.contoso.com, and trust anchor distribution is enabled. DNS2 is a member server that runs the DNS Server role and forwards all queries to DC1. Clients that use DNS2 and have an NRPT rule requiring validation for .secure.contoso.com fail to resolve names in that zone. Refer to the exhibit. What should you do?",
    exhibit: `PS C:\\> Get-DnsServerTrustAnchor -Name secure.contoso.com -ComputerName DC1

TrustAnchorName             TrustAnchorType      TrustAnchorState     TrustAnchorData
---------------             ---------------      ----------------     ---------------
secure.contoso.com          DNSKEY               Valid                [41873][DnsSec][RsaSha256][AwEAAcx1Vb9q...
secure.contoso.com          DNSKEY               Valid                [16247][DnsSec][RsaSha256][AwEAAbq9Rk2m...

PS C:\\> (Get-DnsServerTrustPoint -ComputerName DNS2 | Measure-Object).Count
0`,
    options: [
      "Add the trust anchors for secure.contoso.com to DNS2, for example by piping the zone's DNSKEY records into Add-DnsServerTrustAnchor -ComputerName DNS2.",
      "Change the replication scope of secure.contoso.com to Forest.",
      "Make DNS2 the Key Master for secure.contoso.com.",
      "Remove the NRPT rule from the clients that use DNS2.",
    ],
    answer: [0],
    explanation: "Trust anchor distribution through AD DS reaches only DNS servers that run on **domain controllers**. DNS2 is a member server and has no trust points (count 0), so it cannot validate answers, the AD flag is not set and the NRPT rule makes clients fail. Adding the trust anchor on DNS2 (it stores it in TrustAnchors.dns) lets it validate.\n\n- Zone replication scope does not distribute trust anchors to non-DC servers.\n- Key Master must be an authoritative primary; DNS2 is not authoritative for the zone.\n- Removing the NRPT rule hides the problem and drops the security requirement.",
    lesson: '4.1-dns-policies-dnssec',
  },
  {
    id: 'd4-027',
    topic: '4.1',
    type: 'fill',
    difficulty: 1,
    stem: "In a DNSSEC-signed zone on Windows Server, one type of key signs only the DNSKEY record set and its hash is published as a DS record in the parent zone. What is this key called? Type the full name or the three-letter abbreviation.",
    answer: ['KSK', 'Key Signing Key', 'Key-Signing Key', 'key signing key (KSK)'],
    explanation: "The **Key Signing Key (KSK)** signs only the DNSKEY RRset, and its hash goes into the parent's DS record. The Zone Signing Key (ZSK) signs everything else. Windows defaults: KSK RSA/SHA-256 2048-bit with a 755-day rollover; ZSK 1024-bit with a 90-day rollover.",
    lesson: '4.1-dns-policies-dnssec',
  },
  {
    id: 'd4-028',
    topic: '4.1',
    type: 'single',
    difficulty: 2,
    stem: "Your network contains an AD DS forest named contoso.com that has three domains. You are decommissioning WINS. Users must continue to reach several servers in different domains by single-label names such as intranet and payroll. You must not change the DNS suffix configuration of client computers. What should you do?",
    options: [
      "Create a forest-wide AD-integrated zone named GlobalNames, add CNAME records for the single-label names, and enable GlobalNames support on each DNS server.",
      "Configure a DNS suffix search list by using Group Policy.",
      "Create a conditional forwarder for each domain on every DNS server.",
      "Enable LLMNR on all client computers.",
    ],
    answer: [0],
    explanation: "The **GlobalNames zone** provides forest-wide single-label name resolution without WINS and without client changes. It must be AD-integrated (Forest scope is typical), populated with static CNAMEs and enabled with `Set-DnsServerGlobalNameZone -Enable $true`.\n\n- A suffix search list changes client configuration, which is not allowed.\n- Conditional forwarders do not resolve single-label names.\n- LLMNR is limited to the local subnet and is not a WINS replacement for routed networks.",
    lesson: '4.1-dns-ad-zones-records',
  },
  {
    id: 'd4-029',
    topic: '4.1',
    type: 'single',
    difficulty: 2,
    stem: "DNS1 hosts a file-backed primary zone named contoso.com. A BIND server at 192.168.50.10 must host a secondary copy of the zone. The BIND server is not listed in the zone's NS records. No other server may request zone transfers. Which command should you run on DNS1?",
    options: [
      "Set-DnsServerPrimaryZone -Name contoso.com -SecureSecondaries TransferToSecureServers -SecondaryServers 192.168.50.10",
      "Set-DnsServerPrimaryZone -Name contoso.com -SecureSecondaries TransferToZoneNameServer",
      "Set-DnsServerPrimaryZone -Name contoso.com -SecureSecondaries TransferAnyServer",
      "ConvertTo-DnsServerPrimaryZone -Name contoso.com -ReplicationScope Forest",
    ],
    answer: [0],
    explanation: "`TransferToSecureServers` with `-SecondaryServers` restricts transfers to an explicit IP list, which is exactly the requirement.\n\n- `TransferToZoneNameServer` allows only servers in the NS records, and the BIND server is not one of them.\n- `TransferAnyServer` allows every host to download the zone.\n- AD integration replicates only to DCs; a BIND server cannot participate.",
    lesson: '4.1-dns-ad-zones-records',
  },
  {
    id: 'd4-030',
    topic: '4.1',
    type: 'multi',
    difficulty: 1,
    stem: "You need DNS to delete stale dynamically registered records from an AD-integrated zone automatically. Which two configurations are required? (Choose two.)",
    options: [
      "Enable aging (scavenge stale resource records) on the zone.",
      "Enable automatic scavenging on at least one DNS server that hosts the zone.",
      "Configure the zone to accept secure dynamic updates only.",
      "Add the DHCP servers to the DnsUpdateProxy group.",
      "Restart the Netlogon service on every domain controller.",
    ],
    answer: [0, 1],
    explanation: "Scavenging is a two-part setting: **zone aging** decides when records become stale, and **server scavenging** runs the passes that delete them.\n\n- Secure updates, DnsUpdateProxy and Netlogon affect record registration and ownership, not deletion of stale records.",
    lesson: '4.1-dns-ad-zones-records',
  },
  {
    id: 'd4-031',
    topic: '4.2',
    type: 'single',
    difficulty: 2,
    stem: "Your network contains an AD DS domain named contoso.com. You install the DHCP Server role on a domain member named DHCP2 that has the IP address 10.1.0.6, and you create an active scope for 10.1.30.0/24. Clients on that subnet do not receive addresses from DHCP2. Refer to the exhibit. What should you do?",
    exhibit: `PS C:\\> Get-DhcpServerInDC

IPAddress            DnsName
---------            -------
10.1.0.5             dhcp1.contoso.com

PS C:\\> Get-DhcpServerv4Scope -ComputerName DHCP2

ScopeId         SubnetMask      Name           State    StartRange      EndRange        LeaseDuration
-------         ----------      ----           -----    ----------      --------        -------------
10.1.30.0       255.255.255.0   Floor3         Active   10.1.30.20      10.1.30.240     8.00:00:00`,
    options: [
      "Sign in with an account that is a member of Enterprise Admins and run Add-DhcpServerInDC -DnsName dhcp2.contoso.com -IPAddress 10.1.0.6.",
      "Run Add-DhcpServerSecurityGroup on DHCP2 and restart the DHCP Server service.",
      "Set the ConfigurationState registry value to 2 on DHCP2.",
      "Run Set-DhcpServerv4Scope -ScopeId 10.1.30.0 -State Active on DHCP2.",
    ],
    answer: [0],
    explanation: "DHCP2 is not in the list of **authorized** DHCP servers, and an unauthorized domain-member DHCP server will not lease addresses. Authorization writes to the forest configuration partition, so it requires **Enterprise Admins** rights (or delegated rights).\n\n- `Add-DhcpServerSecurityGroup` only creates the DHCP Administrators and DHCP Users groups.\n- The ConfigurationState value only hides the Server Manager notification.\n- The scope is already active.",
    lesson: '4.2-dhcp-role-scopes-reservations',
  },
  {
    id: 'd4-032',
    topic: '4.2',
    type: 'single',
    difficulty: 2,
    stem: "DHCP1 hosts the scope 10.1.10.0/24. A printer named PRN1 has a reservation in that scope. Refer to the exhibit. Which DNS server addresses do PRN1 and a non-reserved client in the scope receive?",
    exhibit: `PS C:\\> Get-DhcpServerv4OptionValue -ComputerName DHCP1 | Where-Object OptionId -eq 6
OptionId   Name            Type       Value                VendorClass     UserClass       PolicyName
--------   ----            ----       -----                -----------     ---------       ----------
6          DNS Servers     IPv4Add... {10.1.0.20}

PS C:\\> Get-DhcpServerv4OptionValue -ComputerName DHCP1 -ScopeId 10.1.10.0 | Where-Object OptionId -eq 6
OptionId   Name            Type       Value                VendorClass     UserClass       PolicyName
--------   ----            ----       -----                -----------     ---------       ----------
6          DNS Servers     IPv4Add... {10.1.0.10}

PS C:\\> Get-DhcpServerv4OptionValue -ComputerName DHCP1 -ReservedIP 10.1.10.50 | Where-Object OptionId -eq 6
OptionId   Name            Type       Value                VendorClass     UserClass       PolicyName
--------   ----            ----       -----                -----------     ---------       ----------
6          DNS Servers     IPv4Add... {10.1.0.30}`,
    options: [
      "PRN1: 10.1.0.30; other clients: 10.1.0.10",
      "PRN1: 10.1.0.20; other clients: 10.1.0.20",
      "PRN1: 10.1.0.10; other clients: 10.1.0.10",
      "PRN1: 10.1.0.30; other clients: 10.1.0.20",
    ],
    answer: [0],
    explanation: "The most specific option wins: **reservation** options override scope options, which override server options. PRN1 gets 10.1.0.30 from its reservation; other clients in the scope get the scope value 10.1.0.10. The server-level 10.1.0.20 is used only by scopes that do not set option 006.",
    lesson: '4.2-dhcp-role-scopes-reservations',
  },
  {
    id: 'd4-033',
    topic: '4.2',
    type: 'fill',
    difficulty: 2,
    stem: "A device currently holds the lease for 10.1.10.77 in scope 10.1.10.0. You need it to keep that exact address permanently, using a single pipeline. Complete the command: Get-DhcpServerv4Lease -ScopeId 10.1.10.0 -IPAddress 10.1.10.77 | ________",
    answer: ['Add-DhcpServerv4Reservation'],
    explanation: "Piping a lease object into `Add-DhcpServerv4Reservation` creates a reservation with the lease's IP address and client ID (MAC), converting the dynamic lease into a reservation in one step.",
    lesson: '4.2-dhcp-role-scopes-reservations',
  },
  {
    id: 'd4-034',
    topic: '4.2',
    type: 'single',
    difficulty: 2,
    stem: "VLAN 20 uses the scope 10.2.10.0/24 on DHCP1, and the scope is exhausted. The network team adds a secondary subnet, 10.2.11.0/24, to the same VLAN interface on the router. You create a scope for 10.2.11.0/24 on DHCP1, but clients on VLAN 20 still fail when 10.2.10.0/24 is full. What should you do?",
    options: [
      "Create a superscope that contains both scopes.",
      "Create a multicast scope for 10.2.11.0/24.",
      "Configure a split scope between DHCP1 and DHCP2.",
      "Configure DHCP failover for the 10.2.11.0/24 scope.",
    ],
    answer: [0],
    explanation: "The relay agent stamps requests with the primary interface address (giaddr in 10.2.10.0/24), so DHCP1 only looks at that scope. A **superscope** groups scopes that serve the same physical segment so the server can lease from any member scope.\n\n- Multicast scopes assign multicast group addresses, not client addresses.\n- Split scope and failover add redundancy; they do not link two subnets on one segment.",
    lesson: '4.2-dhcp-role-scopes-reservations',
  },
  {
    id: 'd4-035',
    topic: '4.2',
    type: 'single',
    difficulty: 3,
    stem: "A branch office has a DHCP server named BR1DHCP that hosts the scope 10.50.0.0/24. The head office has a DHCP server named HQDHCP. Branch clients must normally be served by BR1DHCP, and HQDHCP must serve them only when BR1DHCP is unavailable. Which command should you run?",
    options: [
      "Add-DhcpServerv4Failover -ComputerName BR1DHCP -Name 'BR1-HQ' -PartnerServer HQDHCP -ScopeId 10.50.0.0 -ServerRole Active -ReservePercent 5",
      "Add-DhcpServerv4Failover -ComputerName BR1DHCP -Name 'BR1-HQ' -PartnerServer HQDHCP -ScopeId 10.50.0.0 -ServerRole Standby -ReservePercent 5",
      "Add-DhcpServerv4Failover -ComputerName BR1DHCP -Name 'BR1-HQ' -PartnerServer HQDHCP -ScopeId 10.50.0.0 -LoadBalancePercent 50",
      "Add-DhcpServerv4Failover -ComputerName HQDHCP -Name 'BR1-HQ' -PartnerServer BR1DHCP -ScopeId 10.50.0.0 -ServerRole Standby",
    ],
    answer: [0],
    explanation: "This is **hot standby** with the branch server **active**. The cmdlet must run against the server that already has the scope (BR1DHCP), and `-ServerRole` describes that local server, so BR1DHCP is `Active` and HQDHCP becomes standby with 5 percent of free addresses reserved.\n\n- `-ServerRole Standby` on BR1DHCP makes HQ the active server.\n- Load balance mode makes HQDHCP answer half of the branch clients all the time.\n- Running it on HQDHCP fails because the scope does not exist there.",
    lesson: '4.2-dhcp-ha-hybrid',
  },
  {
    id: 'd4-036',
    topic: '4.2',
    type: 'single',
    difficulty: 2,
    stem: "DHCP1 and DHCP2 are failover partners. DHCP1 suffered a permanent hardware failure. You need DHCP2 to be able to lease addresses from the entire pool as soon as possible. Refer to the exhibit from DHCP2. What should you do?",
    exhibit: `PS C:\\> Get-DhcpServerv4Failover -ComputerName DHCP2

Name                : DHCP1-DHCP2
PartnerServer       : dhcp1.contoso.com
Mode                : LoadBalance
LoadBalancePercent  : 50
ServerRole          :
ReservePercent      :
MaxClientLeadTime   : 01:00:00
StateSwitchInterval :
State               : CommunicationInterrupted
ScopeId             : {10.1.10.0, 10.1.20.0}
AutoStateTransition : False
EnableAuth          : True`,
    options: [
      "Run Set-DhcpServerv4Failover -ComputerName DHCP2 -Name DHCP1-DHCP2 -PartnerDown.",
      "Run Set-DhcpServerv4Failover -ComputerName DHCP2 -Name DHCP1-DHCP2 -StateSwitchInterval 01:00:00.",
      "Run Invoke-DhcpServerv4FailoverReplication on DHCP2.",
      "Run Set-DhcpServerv4Failover -ComputerName DHCP2 -Name DHCP1-DHCP2 -LoadBalancePercent 100.",
    ],
    answer: [0],
    explanation: "Automatic switchover is disabled (`AutoStateTransition : False`), so DHCP2 will stay in COMMUNICATION INTERRUPTED indefinitely. Manually moving it to **PARTNER DOWN** is the fastest path; after the MCLT (1 hour here) DHCP2 takes over the whole free pool.\n\n- Setting a switchover interval adds another wait of that length before partner-down.\n- Replication needs a reachable partner.\n- Changing the load balance percentage does not override the interrupted state's safety rules.",
    lesson: '4.2-dhcp-ha-hybrid',
  },
  {
    id: 'd4-037',
    topic: '4.2',
    type: 'fill',
    difficulty: 1,
    stem: "You create a DHCP failover relationship with Add-DhcpServerv4Failover and do not specify -MaxClientLeadTime. What MCLT value is used?",
    answer: ['1 hour', 'one hour', '60 minutes', '1h', '01:00:00', '1:00:00', '60 min'],
    explanation: "The default **maximum client lead time is 1 hour**. While partners cannot communicate, renewed leases are granted for the MCLT only, and a server in partner-down waits one MCLT before claiming the partner's free addresses.",
    lesson: '4.2-dhcp-ha-hybrid',
  },
  {
    id: 'd4-038',
    topic: '4.2',
    type: 'multi',
    difficulty: 2,
    stem: "You plan to configure DHCP failover between DHCP1 (10.0.1.1) and DHCP2 (10.0.1.2). Clients are on many remote VLANs. Which two requirements must be met for failover to work correctly? (Choose two.)",
    options: [
      "Each VLAN's relay agent forwards DHCP requests to both 10.0.1.1 and 10.0.1.2.",
      "The clocks on DHCP1 and DHCP2 differ by no more than one minute.",
      "DHCP1 and DHCP2 are nodes of the same failover cluster with shared storage.",
      "DHCP1 and DHCP2 are domain controllers.",
      "All scopes in the relationship are DHCPv6 scopes.",
    ],
    answer: [0, 1],
    explanation: "Clients must be able to reach **both** partners, so relays need both helper addresses. Failover also requires the partners' clocks to be within **one minute**; the configuration wizard halts with an error otherwise, and a partner that later receives failover messages more than a minute off logs a critical time-synchronization event.\n\n- Failover needs no cluster or shared storage.\n- Partners do not need to be DCs.\n- DHCPv6 scopes are not supported by failover.",
    lesson: '4.2-dhcp-ha-hybrid',
  },
  {
    id: 'd4-039',
    topic: '4.2',
    type: 'single',
    difficulty: 2,
    stem: "DHCP1 and DHCP2 share scope 10.1.10.0 in a load balance failover relationship named DHCP1-DHCP2. Yesterday you changed the router option for the scope on DHCP1. Half of the clients now receive the old gateway. Refer to the exhibit. What should you do?",
    exhibit: `PS C:\\> Get-DhcpServerv4OptionValue -ComputerName DHCP1 -ScopeId 10.1.10.0 -OptionId 3
OptionId   Name            Type       Value                VendorClass     UserClass       PolicyName
--------   ----            ----       -----                -----------     ---------       ----------
3          Router          IPv4Add... {10.1.10.254}

PS C:\\> Get-DhcpServerv4OptionValue -ComputerName DHCP2 -ScopeId 10.1.10.0 -OptionId 3
OptionId   Name            Type       Value                VendorClass     UserClass       PolicyName
--------   ----            ----       -----                -----------     ---------       ----------
3          Router          IPv4Add... {10.1.10.1}`,
    options: [
      "Run Invoke-DhcpServerv4FailoverReplication -ComputerName DHCP1 -Name DHCP1-DHCP2.",
      "Run Invoke-DhcpServerv4FailoverReplication -ComputerName DHCP2 -Name DHCP1-DHCP2.",
      "Set the router option at the server level on DHCP1.",
      "Restart the DHCP Server service on DHCP2.",
    ],
    answer: [0],
    explanation: "Scope configuration changes are **not** replicated automatically between failover partners. Replication copies settings **from** the server where you run it and overwrites the partner, so it must be initiated on DHCP1, which has the correct value.\n\n- Running it on DHCP2 would push the old gateway back to DHCP1.\n- A server option on DHCP1 is overridden by DHCP2's scope option for its clients.\n- A restart does not synchronise configuration.",
    lesson: '4.2-dhcp-ha-hybrid',
  },
  {
    id: 'd4-040',
    topic: '4.2',
    type: 'order',
    difficulty: 1,
    stem: "A client on a remote VLAN with a router configured as a DHCP relay agent requests an IPv4 address for the first time. In which order do the events occur?",
    items: [
      "The client broadcasts a DHCPDISCOVER message.",
      "The relay agent unicasts the request to the DHCP server and sets the giaddr field to its interface address.",
      "The server selects the scope that matches giaddr and returns a DHCPOFFER.",
      "The client broadcasts a DHCPREQUEST for the offered address.",
      "The server sends a DHCPACK and records the lease.",
    ],
    explanation: "This is DORA through a relay: Discover, relay with giaddr, Offer, Request, Acknowledge. The giaddr value is how the server knows which scope (subnet) to lease from.",
    lesson: '4.2-dhcp-role-scopes-reservations',
  },
  {
    id: 'd4-041',
    topic: '4.2',
    type: 'match',
    difficulty: 1,
    stem: "Match each DHCP option number to the information it provides.",
    pairs: [
      ["003", "Default gateway (router)"],
      ["006", "DNS servers"],
      ["015", "DNS domain name"],
      ["066", "Boot server host name"],
      ["067", "Boot file name"],
    ],
    explanation: "003 Router, 006 DNS Servers, 015 DNS Domain Name, 066 Boot Server Host Name and 067 Bootfile Name (the last two are used for PXE when the boot server is not the DHCP server).",
    lesson: '4.2-dhcp-role-scopes-reservations',
  },
  {
    id: 'd4-042',
    topic: '4.2',
    type: 'single',
    difficulty: 2,
    stem: "You have an Azure VM named VM1 that runs Windows Server 2025 and is connected to Subnet1 in VNet1. An application requires VM1 to always use the IP address 10.20.1.10. What should you do?",
    options: [
      "Set the IP configuration of the VM1 network interface to static allocation with 10.20.1.10 in Azure, and leave the Windows network adapter configured to obtain an address automatically.",
      "Configure 10.20.1.10 as a static address in the Windows network adapter properties of VM1.",
      "Deploy a DHCP server VM in VNet1 and create a reservation for VM1.",
      "Configure a DHCP option on VNet1 that assigns 10.20.1.10 to the MAC address of VM1.",
    ],
    answer: [0],
    explanation: "Azure assigns VM addresses from the **network interface configuration**, delivered to the guest by the platform's DHCP service. Setting the NIC to **static** allocation guarantees the address; the guest should stay on DHCP.\n\n- A static address inside the guest can drift from the Azure NIC configuration and disconnect the VM.\n- A DHCP server VM cannot serve other Azure VMs; their DHCP traffic is handled by the platform.\n- VNets do not offer per-MAC DHCP options.",
    lesson: '4.2-dhcp-ha-hybrid',
  },
  {
    id: 'd4-043',
    topic: '4.2',
    type: 'single',
    difficulty: 3,
    stem: "You deploy a Windows Server 2025 VM named DHCPAZ1 in VNet1. It will be the target of DHCP relay agents in on-premises branch offices that are connected through a VPN gateway. Relayed requests never reach the DHCP Server service on DHCPAZ1. Which configuration is required on DHCPAZ1?",
    options: [
      "Install the Microsoft Loopback Adapter, give it a static IP address, add the same address as a secondary IP configuration on the Azure network interface of DHCPAZ1, and bind the DHCP service to it.",
      "Assign a public IP address to DHCPAZ1 and point the relay agents to it.",
      "Configure a static IP address directly on the primary Windows network adapter of DHCPAZ1.",
      "Create a user-defined route that sends UDP 67 traffic to DHCPAZ1.",
    ],
    answer: [0],
    explanation: "Microsoft's supported design for a DHCP server in Azure serving **on-premises** clients uses a **loopback adapter** whose IP is also a **secondary IP configuration on the Azure NIC**, so Azure routes the relayed unicast packets to the VM and the DHCP service listens on that address (with weak host send/receive and forwarding enabled between the adapters).\n\n- Relaying over the internet to a public IP is not the supported design and exposes DHCP.\n- A static IP in the guest's primary adapter breaks the Azure-assigned configuration.\n- A UDR cannot target traffic by UDP port.",
    lesson: '4.2-dhcp-ha-hybrid',
  },
  {
    id: 'd4-044',
    topic: '4.2',
    type: 'single',
    difficulty: 2,
    stem: "You attempt to deploy a fourth VM to Subnet1 in VNet1, and the deployment fails because no IP addresses are available. Refer to the exhibit. What should you do?",
    exhibit: `$ az network vnet subnet show --resource-group RG1 --vnet-name VNet1 --name Subnet1 --query "{prefix:addressPrefix, used:length(ipConfigurations)}" --output json
{
  "prefix": "10.20.1.0/29",
  "used": 3
}`,
    options: [
      "Expand Subnet1 to 10.20.1.0/28 (or create a larger subnet) because Azure reserves five addresses per subnet, leaving only three usable addresses in a /29.",
      "Release the address 10.20.1.1 that is assigned to the Azure gateway.",
      "Configure the fourth VM with a static IP address of 10.20.1.7 inside Windows.",
      "Deploy a DHCP server in Subnet1 to lease additional addresses.",
    ],
    answer: [0],
    explanation: "A /29 has 8 addresses; Azure reserves **.0, .1, .2, .3 and the last address (.7)**, leaving .4 to .6. All three are in use. A /28 provides 11 usable addresses.\n\n- The reserved addresses cannot be released.\n- .7 is the reserved broadcast address and a guest-side static IP does not change Azure allocation.\n- Customer DHCP servers cannot assign addresses to Azure VMs.",
    lesson: '4.2-dhcp-ha-hybrid',
  },
  {
    id: 'd4-045',
    topic: '4.2',
    type: 'single',
    difficulty: 2,
    stem: "Clients on VLAN 30 (10.1.30.0/24) cannot obtain addresses, while clients on all other VLANs work. DHCP1 is authorized and hosts an active scope for 10.1.30.0/24. DHCP1 is on a different subnet from VLAN 30. Refer to the exhibit from a VLAN 30 client. What is the most likely cause?",
    exhibit: `C:\\> ipconfig /all

Ethernet adapter Ethernet:

   Connection-specific DNS Suffix  . :
   Description . . . . . . . . . . . : Intel(R) Ethernet Connection I219-LM
   Physical Address. . . . . . . . . : 3C-52-82-1A-7E-07
   DHCP Enabled. . . . . . . . . . . : Yes
   Autoconfiguration Enabled . . . . : Yes
   Autoconfiguration IPv4 Address. . : 169.254.112.45(Preferred)
   Subnet Mask . . . . . . . . . . . : 255.255.0.0
   Default Gateway . . . . . . . . . :
   DNS Servers . . . . . . . . . . . : fec0:0:0:ffff::1%1
                                       fec0:0:0:ffff::2%1
                                       fec0:0:0:ffff::3%1`,
    options: [
      "The VLAN 30 router interface has no DHCP relay agent (helper address) configured for DHCP1.",
      "DHCP1 is not authorized in AD DS.",
      "The 10.1.30.0/24 scope has no default gateway option.",
      "The lease duration of the scope is too long.",
    ],
    answer: [0],
    explanation: "The client fell back to **APIPA** (169.254.x.x), meaning no DHCP server answered. Because the scope exists and is active, and other VLANs work, the broadcast is not leaving VLAN 30: the router interface is missing the relay (`ip helper-address`) to DHCP1.\n\n- The stem states DHCP1 is authorized, and other VLANs are served.\n- A missing router option still produces a leased address, just with no gateway.\n- Lease duration does not stop a first-time lease.",
    lesson: '4.2-dhcp-ha-hybrid',
  },
  {
    id: 'd4-046',
    topic: '4.2',
    type: 'multi',
    difficulty: 2,
    stem: "You have an Azure subnet named Subnet1 with the address range 10.20.1.0/24. Which two IP addresses can never be assigned to a VM network interface in Subnet1? (Choose two.)",
    options: [
      "10.20.1.1",
      "10.20.1.3",
      "10.20.1.4",
      "10.20.1.128",
      "10.20.1.254",
    ],
    answer: [0, 1],
    explanation: "Azure reserves the network address (.0), the default gateway (.1), two addresses for Azure DNS mapping (.2 and .3) and the broadcast address (.255). So **10.20.1.1** and **10.20.1.3** are unavailable. 10.20.1.4 is usually the first address handed out, and .128 and .254 are ordinary usable addresses.",
    lesson: '4.2-dhcp-ha-hybrid',
  },
  {
    id: 'd4-047',
    topic: '4.2',
    type: 'single',
    difficulty: 2,
    stem: "DHCP1 hosts the guest Wi-Fi scope 10.9.0.0/24. Hundreds of visitors connect for an hour or two each day, and new visitors often fail to get an address. The subnet cannot be enlarged. Refer to the exhibit. What should you do?",
    exhibit: `PS C:\\> Get-DhcpServerv4ScopeStatistics -ScopeId 10.9.0.0

ScopeId         Free   InUse  PercentageInUse  Reserved  Pending  SuperscopeName
-------         ----   -----  ---------------  --------  -------  --------------
10.9.0.0        0      231    100              0         0

PS C:\\> Get-DhcpServerv4Scope -ScopeId 10.9.0.0

ScopeId         SubnetMask      Name           State    StartRange      EndRange        LeaseDuration
-------         ----------      ----           -----    ----------      --------        -------------
10.9.0.0        255.255.255.0   GuestWiFi      Active   10.9.0.20       10.9.0.250      8.00:00:00`,
    options: [
      "Reduce the lease duration of the scope to a few hours.",
      "Enable conflict detection on DHCP1.",
      "Add an exclusion range to the scope.",
      "Convert the existing leases to reservations.",
    ],
    answer: [0],
    explanation: "With the default **8-day** lease, addresses given to visitors who left hours ago stay in use for days. A short lease (for example 4 hours) returns addresses to the pool quickly, which suits high-churn guest networks.\n\n- Conflict detection prevents duplicate addresses; it does not free any.\n- Exclusions shrink the pool further.\n- Reservations would permanently tie up the addresses.",
    lesson: '4.2-dhcp-role-scopes-reservations',
  },
  {
    id: 'd4-048',
    topic: '4.2',
    type: 'fill',
    difficulty: 1,
    stem: "DHCP failover partners keep a persistent connection to exchange lease and state information. Which TCP port must be allowed between the partners?",
    answer: ['647', 'TCP 647', 'TCP/647', '647/tcp'],
    explanation: "DHCP failover uses **TCP 647**. Installing the role adds the Microsoft-Windows-DHCP-Failover-TCP-In and -Out firewall rules; any network firewall between the partners must allow it too. Client DHCP traffic uses UDP 67 (server) and UDP 68 (client).",
    lesson: '4.2-dhcp-ha-hybrid',
  },
  {
    id: 'd4-049',
    topic: '4.2',
    type: 'single',
    difficulty: 2,
    stem: "DHCP1 registers DNS records on behalf of DHCP clients in scope 10.1.40.0. A Linux device was assigned the host name WS0101, which is already used by a domain-joined Windows computer, and the Windows computer's A record was overwritten. You need to prevent DHCP from overwriting a name that is registered by a different client. What should you do?",
    options: [
      "Run Set-DhcpServerv4DnsSetting -ScopeId 10.1.40.0 -NameProtection $true.",
      "Run Set-DhcpServerv4DnsSetting -ScopeId 10.1.40.0 -DeleteDnsRROnLeaseExpiry $true.",
      "Add DHCP1 to the DnsUpdateProxy group.",
      "Configure the zone to allow nonsecure and secure dynamic updates.",
    ],
    answer: [0],
    explanation: "**Name Protection** makes the DHCP server register a DHCID record with each name it registers, and it refuses to register a name that is already associated with a different client. That stops name squatting by non-Windows devices.\n\n- Deleting records on lease expiry helps cleanup, not conflicts.\n- DnsUpdateProxy makes records ownerless, which makes overwriting easier.\n- Nonsecure updates remove protection entirely.",
    lesson: '4.2-dhcp-role-scopes-reservations',
  },
  {
    id: 'd4-050',
    topic: '4.2',
    type: 'multi',
    difficulty: 2,
    stem: "Scope 10.1.10.0/24 on DHCP1 serves PCs and IP phones. All IP phones have MAC addresses that start with 00-1B-54, and new phones are added every week. Phones must receive the gateway 10.1.10.253 and the DNS server 10.1.0.50, while all other clients keep the current scope options. The solution must minimise administrative effort. Which two actions should you perform? (Choose two.)",
    options: [
      "Create a DHCP policy on the scope with the condition -MacAddress EQ,001B54*.",
      "Configure option 003 and option 006 values for that policy.",
      "Create a reservation for each phone and set reservation options.",
      "Change options 003 and 006 at the server level.",
      "Create a superscope that contains the phone addresses.",
      "Add the phone MAC addresses to the DHCP allow filter.",
    ],
    answer: [0, 1],
    explanation: "A **DHCP policy** matches clients by a MAC prefix wildcard, and **policy-level options** override scope options only for matching clients. New phones are covered automatically.\n\n- Per-phone reservations work but need weekly manual work.\n- Server-level options affect every scope and are overridden by scope options anyway.\n- Superscopes and allow filters do not assign different options.",
    lesson: '4.2-dhcp-role-scopes-reservations',
  },
];
