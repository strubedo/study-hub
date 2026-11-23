// Domain 3 — Cisco Platforms and Development. Original questions written from the sources listed in lessons.js (developer.cisco.com, cisco.com configuration and API guides, nso-docs.cisco.com, developer.webex.com, PyPI and SDK READMEs, RFC 6241, 6242, 7950, 8040, 8340, 8343, 8344 and the gNMI specification), checked 2026-11-22. Hosts, ids, tokens and keys are invented placeholders. HTTP exchanges, NETCONF RPCs and controller replies are written from the documentation, not captured from a live system.
const L31 = '3.1-cisco-sdks';
const L32A = '3.2-meraki-catalyst-center';
const L32B = '3.2-aci-sdwan-nso';
const L33 = '3.3-ucs-intersight';
const L34 = '3.4-collaboration';
const L35 = '3.5-security-platforms';
const L36 = '3.6-ios-xe-nx-os';
const L37 = '3.7-devnet-resources';
const L38 = '3.8-model-driven-programmability';
const L39 = '3.9-constructing-code';

const bank = [
  // ---------- 3.1 Cisco SDKs ----------
  { topic: '3.1', type: 'fill', difficulty: 2, lesson: L31,
    stem: 'Refer to the exhibit. The script must return every device in the organization, across all pages. Using the SDK documentation excerpt, enter the method name that belongs in the blank.',
    exhibit: `meraki Python library, scope "organizations" (excerpt)

getOrganizations(total_pages=1, direction="next", **kwargs)
    GET /organizations             organizations this API key can access
getOrganizationNetworks(organizationId, total_pages=1, direction="next", **kwargs)
    GET /organizations/{organizationId}/networks
getOrganizationDevices(organizationId, total_pages=1, direction="next", **kwargs)
    GET /organizations/{organizationId}/devices
    total_pages: an integer, or -1 / "all" for every page
    perPage:     3-5000 (default 1000)

----- inventory.py -----
import meraki

dashboard = meraki.DashboardAPI(suppress_logging=True)
org_id = dashboard.organizations.getOrganizations()[0]["id"]

devices = dashboard.organizations.____________(org_id, total_pages="all")
print(len(devices))`,
    answer: ['getOrganizationDevices'],
    explanation: 'The Meraki library names each method after the API operation id and groups it under its scope, so `GET /organizations/{organizationId}/devices` is `dashboard.organizations.getOrganizationDevices(organizationId, ...)`. The organization id is the positional argument and `total_pages="all"` makes the SDK follow every `Link: rel=next` page. `getOrganizations` lists organizations, not devices, and `getOrganizationNetworks` returns networks.' },
  { topic: '3.1', type: 'single', difficulty: 2, lesson: L31,
    stem: 'Refer to the exhibit. What is the purpose of the version argument?',
    exhibit: `import os
from catalystcentersdk import api

catalyst = api.CatalystCenterAPI(
    base_url="https://catalyst.example.com:443",
    username=os.environ["CC_USER"],
    password=os.environ["CC_PASSWORD"],
    version="3.2.3.0",
    verify=True,
)
devices = catalyst.devices.get_device_list(family="Switches and Hubs")
for d in devices.response:
    print(d.hostname, d.managementIpAddress)`,
    options: [
      'It sets the TLS protocol version the SDK negotiates with the controller',
      'It tells the SDK which Catalyst Center API version to target, so the methods and parameters match the controller',
      'It pins the version of the catalystcentersdk package that pip installs',
      'It is the Catalyst Center software release the SDK will upgrade the controller to',
    ],
    answer: [1],
    explanation: 'Catalyst Center SDKs are generated per API release, and the `version` argument selects which release\'s operations and parameters the connection object uses; it should match the controller. TLS is controlled by `verify` and the underlying HTTP library, not by `version`. The package version is chosen with pip (`pip install catalystcentersdk==...`), not in code. The SDK does not upgrade the controller; image management is a separate API.' },
  { topic: '3.1', type: 'multi', difficulty: 2, lesson: L31,
    stem: 'An engineer is choosing Python SDKs for a new project in late 2026. Which two statements match the current SDK documentation? (Choose two.)',
    options: [
      'webexpythonsdk replaces webexteamssdk, whose 1.7 release was announced as its last',
      'acitoolkit is deprecated and its README recommends the Cobra SDK, Ansible or Terraform instead',
      'The meraki library is a thin wrapper around requests and needs a separate retry library for 429 responses',
      'The ACI Cobra SDK is installed from PyPI with pip install cobra',
      'dnacentersdk is the only Python SDK for Catalyst Center',
    ],
    answer: [0, 1],
    explanation: 'The `webexteamssdk` README says 1.7 is the last release and points to `webexpythonsdk` (`WebexAPI`). The `acitoolkit` README carries a deprecation notice and lists Cobra, PyACI, the Ansible collection, Terraform and Network-as-Code as alternatives. The current `meraki` library is built on `httpx`, not `requests`, and retries 429s itself (honouring `Retry-After`). Cobra\'s `acicobra` and `acimodel` wheels are downloaded from your APIC at `/cobra/_downloads/`, matched to its version. Catalyst Center also has `catalystcentersdk` for current API versions.' },
  { topic: '3.1', type: 'single', difficulty: 2, lesson: L31,
    stem: 'Refer to the exhibit. The team wants to replace this hand-written loop and stay under the Meraki rate limit without maintaining retry code. Which approach meets the requirement with the least custom code?',
    exhibit: `while True:
    resp = requests.get(url, headers=headers, timeout=30)
    if resp.status_code == 429:
        time.sleep(int(resp.headers["Retry-After"]))
        continue
    resp.raise_for_status()
    items.extend(resp.json())
    url = resp.links.get("next", {}).get("url")
    if not url:
        break`,
    options: [
      'Send the API key in the X-Cisco-Meraki-API-Key header, which is exempt from rate limiting',
      'Run the loop in 20 threads so the limit is shared across connections',
      'Use meraki.DashboardAPI with total_pages="all"; the library paces requests, retries 429s and follows the pages',
      'Lower the timeout to 1 second so failed calls return faster',
    ],
    answer: [2],
    explanation: 'The Meraki library paginates (`total_pages="all"`), honours `Retry-After` on 429 and, with "smart flow", paces calls under the 10-requests-per-second organization limit by default. The old v0 header is not exempt from anything; v1 documentation says to use `Authorization: Bearer`. More threads make throttling worse because the budget is per organization. A shorter timeout does not address rate limiting at all.' },

  // ---------- 3.2 Network management platforms ----------
  { topic: '3.2', type: 'order', difficulty: 2, lesson: L32A,
    stem: 'A script must list all 1,200 devices in Catalyst Center with raw HTTP calls. Put the steps in the order the script performs them.',
    items: [
      'POST /dna/system/api/v1/auth/token with an Authorization: Basic header',
      'Read the Token value from the JSON response body',
      'GET /dna/intent/api/v1/network-device?offset=1&limit=500 with the X-Auth-Token header',
      'GET /dna/intent/api/v1/network-device?offset=501&limit=500 with the same token',
      'Stop after a page returns fewer than 500 devices',
    ],
    explanation: 'Catalyst Center first issues a token from the system authentication endpoint (Basic credentials, response `{"Token": "..."}`); every Intent API call then carries it in `X-Auth-Token`. The device list pages with a 1-based `offset` and a `limit` of up to 500, so the second page starts at 501, and a short page means there is nothing left. The token lasts one hour, which is ample for three calls.' },
  { topic: '3.2', type: 'order', difficulty: 2, lesson: L32B,
    stem: 'A script uses session-based authentication to make a configuration change through the Catalyst SD-WAN Manager API. Put the steps in order.',
    items: [
      'POST /j_security_check with j_username and j_password, form-encoded',
      'Confirm a JSESSIONID cookie was set and the body is not an HTML login page',
      'GET /dataservice/client/token with the JSESSIONID cookie',
      'POST the change under /dataservice with the JSESSIONID cookie and an X-XSRF-TOKEN header',
      'POST /logout with the JSESSIONID cookie',
    ],
    explanation: 'SD-WAN Manager (formerly vManage) session login is a form POST to `/j_security_check`; success sets `JSESSIONID`, while failure returns an HTML login page, so the docs tell clients to check the body. The cross-site request forgery token comes from `/dataservice/client/token` and must accompany POSTs in `X-XSRF-TOKEN`, together with the cookie. The docs recommend `POST /logout` at the end to release the session.' },
  { topic: '3.2', type: 'match', difficulty: 2, lesson: L32B,
    stem: 'Match each automation requirement to the platform API that fits it.',
    pairs: [
      ['List every wireless access point in a cloud-managed organization using a Bearer API key', 'Meraki Dashboard API'],
      ['Run a class query for all endpoint groups in a data-centre fabric', 'ACI APIC REST API'],
      ['Report the system-ip and reachability of every WAN edge router in the overlay', 'Catalyst SD-WAN Manager API'],
      ['Push one L3VPN service to Cisco and Juniper routers in a single transaction through NEDs', 'NSO RESTCONF API'],
      ['Distribute a new switch image to campus sites and poll the task the controller returns', 'Catalyst Center Intent API'],
    ],
    explanation: 'Meraki is the cloud-managed platform authenticated with an API key in `Authorization: Bearer`. ACI keeps the fabric as managed objects, so "class query" and "endpoint groups" point to the APIC. `system-ip`, WAN edges and the overlay are Catalyst SD-WAN terms. Multivendor services, NEDs and network-wide transactions are NSO. Software image management with asynchronous tasks is a Catalyst Center Intent API capability.' },
  { topic: '3.2', type: 'fill', difficulty: 2, lesson: L32B,
    stem: 'Refer to the exhibit. The script does not use a requests.Session, so it must send the token explicitly. Enter the cookie name that belongs in the blank.',
    exhibit: `POST https://apic.example.com/api/aaaLogin.json
{"aaaUser": {"attributes": {"name": "alice", "pwd": "example-password"}}}

HTTP/1.1 200 OK
Content-Type: application/json
Set-Cookie: APIC-cookie=example-token-not-real

{"totalCount": "1", "imdata": [{"aaaLogin": {"attributes": {
  "token": "example-token-not-real", "refreshTimeoutSeconds": "600"}}}]}

----- script -----
token = login.json()["imdata"][0]["aaaLogin"]["attributes"]["token"]
nodes = requests.get("https://apic.example.com/api/class/topSystem.json",
                     cookies={"____________": token}, timeout=30)`,
    answer: ['APIC-cookie'],
    explanation: 'The APIC returns the session token both as the `token` attribute of `aaaLogin` and in a `Set-Cookie` header, and later requests authenticate by sending it as the cookie named `APIC-cookie`. A `requests.Session` would store the cookie automatically; without one, the script passes it in `cookies=`. Sending the token as `X-Auth-Token` or a Bearer header would not authenticate to the APIC.' },
  { topic: '3.2', type: 'single', difficulty: 2, lesson: L32A,
    stem: 'Refer to the exhibit. A script runs 25 parallel workers against one Meraki organization and receives this response. What should the script do?',
    exhibit: `GET /api/v1/organizations/500123/devices/availabilities?perPage=1000 HTTP/1.1
Host: api.meraki.com
Authorization: Bearer <YOUR_API_KEY>

HTTP/1.1 429 Too Many Requests
Retry-After: 2
Content-Type: application/json

{"errors": ["API rate limit exceeded for organization"]}`,
    options: [
      'Wait the number of seconds in Retry-After before retrying, and reduce concurrency to stay under 10 requests per second for the organization',
      'Generate a second API key for the same admin and alternate between the two keys',
      'Repeat the request immediately until it returns 200',
      'Switch to the X-Cisco-Meraki-API-Key header, which has its own rate limit',
    ],
    answer: [0],
    explanation: 'Meraki allows 10 requests per second per organization (with a small burst) and answers excess calls with `429` and `Retry-After`; the documented recovery is to wait that long and slow down. The organization budget is shared by every application and key, so a second key does not add capacity. Retrying immediately only produces more 429s. The v0 header is not a separate budget; v1 uses `Authorization: Bearer`.' },
  { topic: '3.2', type: 'single', difficulty: 2, lesson: L32A,
    stem: 'Refer to the exhibit. What should the script do next to learn whether the tag was created?',
    exhibit: `POST /dna/intent/api/v1/tag HTTP/1.1
Host: catalyst.example.com
X-Auth-Token: example-token-not-real
Content-Type: application/json

{"name": "branch-switches"}

HTTP/1.1 200 OK
Content-Type: application/json

{"response": {"taskId": "c0ffee00-0000-4000-8000-000000000001",
              "url": "/api/v1/task/c0ffee00-0000-4000-8000-000000000001"},
 "version": "1.0"}`,
    options: [
      'Repeat the POST until the controller answers 201 Created',
      'Treat the reply as success; the tag already exists',
      'Request a new token, because a taskId in the reply means the token is about to expire',
      'GET /dna/intent/api/v1/task/c0ffee00-0000-4000-8000-000000000001 with the X-Auth-Token header until endTime is present, then check isError',
    ],
    answer: [3],
    explanation: 'A reply carrying a `taskId` and task `url` is Catalyst Center\'s asynchronous pattern: the work was queued, not finished (the Create Tag reference documents this reply with `200`; many other write calls answer `202 Accepted` with the same body). The client polls the task resource and, once `endTime` is set, reads `isError`, `progress` and `failureReason`. Repeating the POST could create duplicates, assuming success ignores possible failures, and a task reply says nothing about token expiry.' },
  { topic: '3.2', type: 'single', difficulty: 2, lesson: L32B,
    stem: 'Refer to the exhibit. Which request returned this APIC response?',
    exhibit: `{"totalCount": "3", "imdata": [
  {"topSystem": {"attributes": {"dn": "topology/pod-1/node-1/sys", "name": "apic1", "role": "controller", "address": "10.0.0.1", "serial": "FCH0000AAAA"}}},
  {"topSystem": {"attributes": {"dn": "topology/pod-1/node-101/sys", "name": "leaf-101", "role": "leaf", "address": "10.0.72.64", "serial": "FDO0000BBBB"}}},
  {"topSystem": {"attributes": {"dn": "topology/pod-1/node-201/sys", "name": "spine-201", "role": "spine", "address": "10.0.72.65", "serial": "FDO0000CCCC"}}}
]}`,
    options: [
      'GET /api/mo/uni/tn-common.json',
      'GET /api/node/class/fvCEp.json',
      'POST /api/aaaLogin.json',
      'GET /api/class/topSystem.json',
    ],
    answer: [3],
    explanation: 'Every object in `imdata` is of class `topSystem`, one per fabric node (controller, leaf and spine), which is exactly what a class query, `/api/class/topSystem.json`, returns. An MO query on `uni/tn-common` returns the common tenant object. `fvCEp` is the class for learned endpoints (hosts), not switches. `aaaLogin` returns an `aaaLogin` object with a token.' },
  { topic: '3.2', type: 'multi', difficulty: 2, lesson: L32B,
    stem: 'Which two statements describe Cisco NSO? (Choose two.)',
    options: [
      'It uses Network Element Drivers (NEDs) to manage devices from many vendors through NETCONF, CLI, generic or SNMP interfaces',
      'Services are modelled in YANG and mapped to device configuration that NSO pushes as one transaction and can roll back',
      'It is a cloud service that manages only Meraki devices',
      'Its only northbound interface is a SOAP API',
      'It replaces the operating system on the devices it manages',
    ],
    answer: [0, 1],
    explanation: 'NSO talks to devices through NEDs (the docs list NETCONF, CLI, generic and SNMP NEDs) and keeps their configuration in CDB. Service models written in YANG, with templates or code, turn a service instance into device changes applied as a network-wide transaction. NSO runs on your own Linux server and manages multivendor networks; its northbound interfaces include RESTCONF, NETCONF, JSON-RPC, the CLI and a Web UI; it configures devices and never replaces their software.' },

  // ---------- 3.3 Compute ----------
  { topic: '3.3', type: 'single', difficulty: 2, lesson: L33,
    stem: 'Refer to the exhibit. Which statement about this request is true?',
    exhibit: `POST /nuova HTTP/1.1
Host: ucsm.example.com
Content-Type: application/x-www-form-urlencoded

<configResolveClass cookie="example-cookie-not-real" classId="computeBlade" inHierarchical="false" />`,
    options: [
      'It is an Intersight REST call that filters blades with OData',
      'It logs in to UCS Manager and returns a session cookie',
      'It asks the UCS Manager XML API for every object of class computeBlade, without their child objects',
      'It reads the single blade at DN sys/chassis-1/blade-1',
    ],
    answer: [2],
    explanation: 'UCS Manager\'s XML API accepts XML methods POSTed to `/nuova`; `configResolveClass` returns all objects of the given class, and `inHierarchical="false"` leaves out their children. The `cookie` attribute is the session cookie from an earlier `aaaLogin`, so this is not the login. Reading one object by DN is `configResolveDn`. Intersight is a JSON REST API under `/api/v1` with `$filter`, not XML to `/nuova`.' },
  { topic: '3.3', type: 'single', difficulty: 2, lesson: L33,
    stem: 'Refer to the exhibit. How does this script authenticate to Intersight?',
    exhibit: `config = intersight.Configuration(
    host="https://intersight.com",
    signing_info=intersight.signing.HttpSigningConfiguration(
        key_id="<YOUR_API_KEY_ID>",
        private_key_path="SecretKey.txt",
        signing_scheme=intersight.signing.SCHEME_HS2019,
        signing_algorithm=intersight.signing.ALGORITHM_ECDSA_MODE_DETERMINISTIC_RFC6979,
        hash_algorithm=intersight.signing.HASH_SHA256,
        signed_headers=[intersight.signing.HEADER_REQUEST_TARGET,
                        intersight.signing.HEADER_HOST,
                        intersight.signing.HEADER_DATE,
                        intersight.signing.HEADER_DIGEST],
    ),
)`,
    options: [
      'It sends the private key in an X-Auth-Token header on every request',
      'It signs every request with the private key; the key ID tells Intersight which public key to verify the signature with',
      'It logs in once with aaaLogin and reuses the returned cookie',
      'It sends the key ID and private key as Basic authentication',
    ],
    answer: [1],
    explanation: 'Intersight API keys have a key ID and a private key. There is no login call: the SDK computes an HTTP signature over the request target, host, date and body digest with the private key, and Intersight verifies it with the matching public key identified by the key ID. The private key never leaves the client, so it is not sent in any header or as Basic credentials. `aaaLogin` with a cookie is the UCS Manager (and APIC) pattern.' },
  { topic: '3.3', type: 'multi', difficulty: 1, lesson: L33,
    stem: 'Which two statements are true of the Cisco Intersight API? (Choose two.)',
    options: [
      'It is a JSON REST API, delivered from the cloud, described by a published OpenAPI specification',
      'List queries accept OData-style parameters such as $filter and $select',
      'It is reached by POSTing XML documents to /nuova on the Fabric Interconnects',
      'It requires a separate session login whose cookie expires after 600 seconds',
      'It manages only one UCS domain at a time',
    ],
    answer: [0, 1],
    explanation: 'Intersight is SaaS with a REST/JSON API defined by an OpenAPI 3 specification (its Python SDK is generated from it), and list endpoints such as `/api/v1/compute/PhysicalSummaries` take `$filter`, `$select`, `$top` and similar parameters. The XML API at `/nuova` with a session cookie and refresh period is UCS Manager. Intersight manages many domains and standalone servers from one place.' },

  // ---------- 3.4 Collaboration ----------
  { topic: '3.4', type: 'match', difficulty: 2, lesson: L34,
    stem: 'Match each collaboration requirement to the interface that meets it.',
    pairs: [
      ['Bulk-create 200 desk phones and their directory numbers in Unified CM', 'CUCM AXL (SOAP)'],
      ['Let users search the corporate directory and change their own call-forward target from an app', 'CUCM UDS (REST)'],
      ['Post a maintenance notice with markdown into an operations space', 'Webex messages API'],
      ['Set the volume on a cloud-registered Room Bar from a script', 'Cloud xAPI command'],
      ['Be called back by Webex whenever someone posts in a space', 'Webex webhook'],
    ],
    explanation: 'AXL is the SOAP/XML provisioning interface to the Unified CM database (phones, lines, users). UDS is the REST interface for end-user data such as directory search, devices and call forwarding. Posting into a space is `POST /v1/messages`. RoomOS devices are controlled through xAPI; for cloud-registered devices that is `POST /v1/xapi/command/Audio.Volume.Set`. A webhook (`POST /v1/webhooks`, resource `messages`, event `created`) makes Webex call your URL.' },
  { topic: '3.4', type: 'single', difficulty: 2, lesson: L34,
    stem: 'Refer to the exhibit. Which statement describes this request?',
    exhibit: `POST /axl/ HTTP/1.1
Host: cucm.example.com:8443
Authorization: Basic <base64 of axluser:example-password>
Content-Type: text/xml
SOAPAction: "CUCM:DB ver=15.0 executeSQLQuery"

<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"
                  xmlns:ns="http://www.cisco.com/AXL/API/15.0">
  <soapenv:Header/>
  <soapenv:Body>
    <ns:executeSQLQuery>
      <sql>select name, description from device</sql>
    </ns:executeSQLQuery>
  </soapenv:Body>
</soapenv:Envelope>`,
    options: [
      'A SOAP request to the Unified CM AXL service, authenticated with HTTP Basic, whose SOAPAction header names the AXL version and operation',
      'A REST request to Unified CM User Data Services that returns one user\'s speed dials',
      'A Webex REST call that uses a Bearer token to list devices',
      'An xAPI command sent to a RoomOS device',
    ],
    answer: [0],
    explanation: 'The `soapenv:Envelope`, the `/axl/` path on port 8443, `Content-Type: text/xml` and `SOAPAction` identify AXL, Unified CM\'s SOAP provisioning API; AXL uses HTTP Basic with a user that has an AXL role, and the namespace version must match the SOAPAction version. UDS uses simple REST URLs under `/cucm-uds/`. Webex uses `https://webexapis.com/v1` with Bearer tokens, and xAPI commands go to a device or to `/v1/xapi/command/...`.' },
  { topic: '3.4', type: 'single', difficulty: 2, lesson: L34,
    stem: 'An application must create spaces and post messages on behalf of each employee who signs in and approves a defined set of permissions. Which kind of Webex app should be built?',
    options: [
      'A bot, with its own long-lived token',
      'A guest issuer app',
      'An integration that uses OAuth 2.0 with the required scopes',
      'A script that uses the developer\'s personal access token',
    ],
    answer: [2],
    explanation: 'Acting on behalf of users who grant specific scopes is what integrations do: the user is sent to `/v1/authorize`, and the app exchanges the code at `/v1/access_token` for access and refresh tokens. A bot is its own identity and does not act as a user. Guest issuer apps (now deprecated in favour of Service App guest management) serve people without Webex accounts. A personal access token acts only as the developer and is short-lived.' },
  { topic: '3.4', type: 'single', difficulty: 2, lesson: L34,
    stem: 'Refer to the exhibit. A bot in a 12-person group space returns only two messages, although people posted about 40. Why?',
    exhibit: `GET /v1/messages?roomId=<ROOM_ID>&mentionedPeople=me&max=100 HTTP/1.1
Host: webexapis.com
Authorization: Bearer <BOT_ACCESS_TOKEN>

HTTP/1.1 200 OK
Content-Type: application/json

{"items": [
  {"id": "<MSG_ID_1>", "roomType": "group", "text": "opsbot status sw01", "mentionedPeople": ["<BOT_PERSON_ID>"]},
  {"id": "<MSG_ID_2>", "roomType": "group", "text": "opsbot status rtr01", "mentionedPeople": ["<BOT_PERSON_ID>"]}
]}`,
    options: [
      'The max parameter is limited to 2 for bots',
      'In group spaces a bot can read only the messages in which it is @mentioned',
      'The bot token expired, so Webex returned a partial list',
      'Messages older than one minute are deleted from group spaces',
    ],
    answer: [1],
    explanation: 'Webex documents that bots see only messages that @mention them in group spaces (in 1:1 spaces they see everything), which is also why a bot must add `mentionedPeople=me` to list messages in a group space; both returned messages mention the bot. `max=100` allows far more than two items. An expired token would give `401`, not a partial `200` list. Group space messages are not deleted after a minute.' },

  // ---------- 3.5 Security ----------
  { topic: '3.5', type: 'order', difficulty: 2, lesson: L35,
    stem: 'A script lists the devices managed by a Secure Firewall Management Center and keeps running for 45 minutes. Put its API steps in order.',
    items: [
      'POST /api/fmc_platform/v1/auth/generatetoken with Basic authentication and an empty body',
      'Read X-auth-access-token, X-auth-refresh-token and DOMAIN_UUID from the response headers',
      'GET /api/fmc_config/v1/domain/{domainUUID}/devices/devicerecords with the X-auth-access-token header',
      'Before 30 minutes pass, POST /api/fmc_platform/v1/auth/refreshtoken with both token headers',
    ],
    explanation: 'The Management Center issues tokens from `generatetoken` in response to Basic credentials and returns them, with the domain UUID, in response headers. Configuration URLs include `/domain/{domainUUID}/`, and every call carries `X-auth-access-token`. A token lasts 30 minutes and can be refreshed up to three times with `refreshtoken`, so a 45-minute run needs one refresh.' },
  { topic: '3.5', type: 'match', difficulty: 2, lesson: L35,
    stem: 'Match each security operations task to the Cisco platform whose API performs it.',
    pairs: [
      ['Create network objects and access rules, then deploy them to Threat Defense devices', 'Secure Firewall Management Center'],
      ['Isolate a laptop on which a malicious binary was executed', 'Secure Endpoint'],
      ['Detonate a suspicious attachment and download its behaviour report', 'Secure Malware Analytics'],
      ['Share authenticated session context with a third-party firewall as users log in', 'ISE pxGrid'],
      ['Enrich an IP address across integrated security products and open an incident', 'Cisco XDR'],
    ],
    explanation: 'The Management Center (formerly Firepower Management Center) owns FTD policy and deployment. Host isolation is a Secure Endpoint (formerly AMP for Endpoints) action. Sandbox detonation and reports are Secure Malware Analytics (formerly Threat Grid). pxGrid is ISE\'s publish/subscribe context-sharing framework. Cross-product enrichment and incident handling are Cisco XDR.' },
  { topic: '3.5', type: 'single', difficulty: 2, lesson: L35,
    stem: 'Refer to the exhibit. How must the script use the result to call the Cisco XDR APIs?',
    exhibit: `$ curl -s -u "$CLIENT_ID:$CLIENT_PASSWORD" \\
    -H 'Content-Type: application/x-www-form-urlencoded' \\
    -H 'Accept: application/json' \\
    -d 'grant_type=client_credentials' \\
    https://visibility.amp.cisco.com/iroh/oauth2/token

{"access_token": "example-token-not-real", "token_type": "bearer",
 "expires_in": 600, "scope": "enrich:read casebook inspect:read"}`,
    options: [
      'Send the client ID and password as Basic authentication on every API call',
      'Send the token in an X-auth-access-token header and refresh it with generatetoken',
      'Put the token in an api_key query parameter',
      'Send Authorization: Bearer example-token-not-real, and request a new token after about 600 seconds',
    ],
    answer: [3],
    explanation: 'This is the OAuth 2.0 client-credentials flow: XDR documents that the API client\'s ID and password cannot call the APIs directly, only obtain a token, which goes in `Authorization: Bearer` and is valid for `expires_in` seconds, after which the same request gets a new one. `X-auth-access-token` and `generatetoken` belong to the Management Center API. Keys in query strings are the Secure Malware Analytics sample pattern, not XDR.' },
  { topic: '3.5', type: 'single', difficulty: 1, lesson: L35,
    stem: 'A next-generation firewall from another vendor must learn, within seconds of a user\'s 802.1X login, which user and security group belong to each IP address. Which ISE interface fits?',
    options: [
      'pxGrid, subscribing to session updates',
      'ERS, polling /ers/config/endpoint every minute',
      'The ISE OpenAPI backup and restore API',
      'AXL',
    ],
    answer: [0],
    explanation: 'pxGrid is ISE\'s publish/subscribe framework for sharing context such as sessions, identities and security group tags with other products, combining HTTP APIs with WebSocket pub/sub so updates arrive as they happen. ERS is for configuration and polling it is neither real-time nor designed for session context. The OpenAPI backup API manages backups. AXL is a Unified CM interface.' },

  // ---------- 3.6 Device APIs ----------
  { topic: '3.6', type: 'multi', difficulty: 2, lesson: L36,
    stem: 'Refer to the exhibit. NETCONF works on rtr01, but RESTCONF requests to https://rtr01.example.com/restconf are refused. Which two commands must be added? (Choose two.)',
    exhibit: `rtr01# show running-config | include username|aaa|netconf|restconf|ip http
username netops privilege 15 secret 9 <REDACTED>
aaa new-model
aaa authentication login default local
aaa authorization exec default local
netconf-yang`,
    options: [
      'restconf',
      'ip http secure-server',
      'feature restconf',
      'gnxi secure-server',
      'netconf-yang feature candidate-datastore',
    ],
    answer: [0, 1],
    explanation: 'The IOS XE programmability guide enables RESTCONF with `restconf` and the HTTPS server with `ip http secure-server`; RESTCONF needs the internal NGINX web server process, which runs once `ip http secure-server` (or `ip http server`) is configured. The privilege 15 user and AAA are already in place. `feature restconf` is the NX-OS command. `gnxi secure-server` enables gNMI/gNOI. The candidate datastore affects NETCONF datastore behaviour, not whether RESTCONF answers.' },
  { topic: '3.6', type: 'single', difficulty: 2, lesson: L36,
    stem: 'Refer to the exhibit. The script fails because nothing answers on sw01. Which configuration change on the Nexus switch is needed?',
    exhibit: `import requests

payload = [{"jsonrpc": "2.0", "method": "cli",
            "params": {"cmd": "show version", "version": 1}, "id": 1}]
resp = requests.post("https://sw01.example.com/ins", json=payload,
                     headers={"Content-Type": "application/json-rpc"},
                     auth=("netops", "example-password"), timeout=30)
print(resp.json())`,
    options: [
      'feature netconf',
      'feature bash-shell',
      'feature nxapi',
      'restconf',
    ],
    answer: [2],
    explanation: 'The script sends a JSON-RPC request to `/ins`, which is NX-API CLI; it is enabled with `feature nxapi` (and `nxapi http port` or `nxapi https port` set the ports). `feature netconf` starts the NETCONF agent on port 830. `feature bash-shell` enables the on-box Bash shell. `restconf` is an IOS XE command; NX-OS uses `feature restconf`, and that serves `/restconf`, not `/ins`.' },
  { topic: '3.6', type: 'single', difficulty: 2, lesson: L36,
    stem: 'Operations wants CPU utilisation from 300 IOS XE routers pushed to a collector every 30 seconds. The subscriptions must survive router reloads, and each router must open the connection to the collector. Which telemetry approach fits?',
    options: [
      'Dial-in dynamic subscriptions created by the collector over NETCONF',
      'Configured (dial-out) subscriptions in each router\'s configuration, with the collector as the receiver',
      'SNMP polling every 30 seconds from the collector',
      'A RESTCONF GET from the collector every 30 seconds',
    ],
    answer: [1],
    explanation: 'Configured subscriptions live in the device configuration, so they persist across reloads, and the device dials out to the receiver. Dynamic (dial-in) subscriptions exist only while the collector\'s session lasts and are initiated by the collector. SNMP polling and periodic RESTCONF GETs are pull models started by the collector, not pushed telemetry.' },

  // ---------- 3.7 DevNet resources ----------
  { topic: '3.7', type: 'match', difficulty: 1, lesson: L37,
    stem: 'Match each need to the DevNet resource that fits it best.',
    pairs: [
      ['Check whether the Catalyst Center device list uses a 0-based or 1-based offset', 'API documentation'],
      ['Run edit-config against a real IOS XE router you are allowed to reconfigure, without owning one', 'DevNet Sandbox'],
      ['Find an existing open-source script that backs up Meraki configurations', 'Code Exchange'],
      ['Work through a guided, hands-on introduction to YANG and NETCONF', 'Learning Labs'],
      ['Ask other developers whether they have seen the same SD-WAN Manager API error', 'DevNet community forums'],
    ],
    explanation: 'Parameter semantics are in the API reference. A real device to test against is what the Sandbox provides (an on-demand one when you change configuration). Code Exchange indexes Cisco and community GitHub projects. Learning Labs are the guided tutorials. Peer questions go to the community forums; Support is the escalation path when the community cannot help.' },
  { topic: '3.7', type: 'single', difficulty: 2, lesson: L37,
    stem: 'Refer to the exhibit. A developer must change device management settings and interface configuration for a day of testing. Which choice is appropriate?',
    exhibit: `DevNet Sandbox catalog (summary)

IOS XE on Catalyst 8000V  - Always on
  Shared with other users; restricted access; ready in a few minutes

IOS XE on Catalyst 8000V  - On demand
  Private to your reservation; full admin access; longer to provision;
  session length and extensions set by this sandbox`,
    options: [
      'The always-on sandbox, because it needs no reservation',
      'Either one, because changes in a sandbox persist after the session ends',
      'The always-on sandbox, after asking the forum for the admin password',
      'The on-demand sandbox, because it is private and gives admin access',
    ],
    answer: [3],
    explanation: 'Configuration changes, especially to management settings, belong in an on-demand sandbox: it is private to the reservation and grants admin rights. Always-on sandboxes are shared and restricted, changes there can break them for everyone, and they now also require a reservation. Neither type keeps state after the session ends.' },
  { topic: '3.7', type: 'multi', difficulty: 2, lesson: L37,
    stem: 'According to the current DevNet Sandbox documentation, which two statements are true? (Choose two.)',
    options: [
      'Always-on sandboxes also require a reservation, which issues credentials scoped to your session',
      'You can hold one active reservation at a time across all sandboxes',
      'On-demand sandboxes are shared with other users',
      'Configuration changes are kept after the reservation ends',
      'A Cisco support contract is required to reserve a sandbox',
    ],
    answer: [0, 1],
    explanation: 'The Sandbox docs say both types need a reservation (the reservation generates your credentials) and that one active reservation is allowed at a time. On-demand environments are private, not shared. Neither type keeps state: the environment and your changes are removed when the session ends. Sandboxes are free with a Cisco.com account; no licence or support contract is needed.' },

  // ---------- 3.8 Model-driven programmability ----------
  { topic: '3.8', type: 'fill', difficulty: 2, lesson: L38,
    stem: 'Refer to the exhibit. Complete the RESTCONF URL so that it addresses only interface GigabitEthernet1/0/1. Enter the missing path segment exactly as it must be sent.',
    exhibit: `module: ietf-interfaces
  +--rw interfaces
     +--rw interface* [name]
        +--rw name           string
        +--rw description?   string
        +--rw type           identityref
        +--rw enabled?       boolean
        +--ro oper-status    enumeration

RFC 8040: a list instance is identified as <list-name>=<key value>;
reserved characters in key values must be percent-encoded.

GET https://sw01.example.com/restconf/data/ietf-interfaces:interfaces/______________
Accept: application/yang-data+json`,
    answer: ['interface=GigabitEthernet1%2F0%2F1', 'interface=GigabitEthernet1%2f0%2f1'],
    explanation: 'The tree shows a list named `interface` keyed by `name`, so one entry is `interface=<name>`. The `/` characters in `GigabitEthernet1/0/1` would otherwise be read as path separators, so each is percent-encoded as `%2F`. Writing the key without encoding, or using `interface/GigabitEthernet1/0/1` or `name=...`, addresses a different (non-existent) resource.' },
  { topic: '3.8', type: 'fill', difficulty: 2, lesson: L38,
    stem: 'Refer to the exhibit. The script must read only configuration, with no operational state, from the candidate datastore. Enter the NETCONF operation that belongs in both blanks.',
    exhibit: `<rpc message-id="201" xmlns="urn:ietf:params:xml:ns:netconf:base:1.0">
  <__________>
    <source><candidate/></source>
    <filter type="subtree">
      <interfaces xmlns="urn:ietf:params:xml:ns:yang:ietf-interfaces"/>
    </filter>
  </__________>
</rpc>`,
    answer: ['get-config', '<get-config>'],
    explanation: '`<get-config>` retrieves configuration from the datastore named in `<source>` (running, candidate or startup) and returns no state data. `<get>` takes no source: it always returns running configuration plus state such as `oper-status` and counters. `<edit-config>` writes rather than reads and uses `<target>`.' },
  { topic: '3.8', type: 'match', difficulty: 2, lesson: L38,
    stem: 'A script manages ietf-interfaces data on an IOS XE router through RESTCONF. Match each requirement to the HTTP method it should use.',
    pairs: [
      ['Create Loopback100; the call must fail if Loopback100 already exists', 'POST'],
      ['Replace the whole configuration of Loopback100 with the body sent', 'PUT'],
      ['Change only the description of GigabitEthernet2, leaving its other settings alone', 'PATCH'],
      ['Remove Loopback100', 'DELETE'],
      ['Read the oper-status of GigabitEthernet2', 'GET'],
    ],
    explanation: 'RFC 8040 maps POST to `edit-config` with `operation="create"`, which returns `409 Conflict` if the data exists. PUT is create-or-replace of the target. A plain PATCH is a merge into an existing resource, so unspecified leaves are kept. DELETE maps to `operation="delete"` and returns `204`. GET maps to `get`/`get-config` and can return state such as `oper-status`.' },
  { topic: '3.8', type: 'order', difficulty: 3, lesson: L38,
    stem: 'A NETCONF client changes an IOS XE router that has the candidate datastore enabled, following the RFC 6241 practice of locking before editing and keeping the lock until the change is committed. Put the steps in order.',
    items: [
      'Open SSH to TCP port 830 and request the netconf subsystem',
      'Exchange <hello> messages that advertise capabilities',
      'Send <lock> for the candidate datastore',
      'Send <edit-config> with <target><candidate/></target>',
      'Send <commit> to make the candidate the running configuration',
      'Send <unlock> for the candidate datastore',
      'Send <close-session>',
    ],
    explanation: 'NETCONF runs as the `netconf` SSH subsystem on port 830; both peers then send `<hello>` with their capabilities (the server\'s includes `:candidate`). Locking stops other sessions editing the same datastore, the edit goes to the candidate, and `<commit>` applies it to running. The lock is released after the commit and the session is closed politely with `<close-session>`.' },
  { topic: '3.8', type: 'single', difficulty: 2, lesson: L38,
    stem: 'Refer to the exhibit. Which statement about this YANG tree is true?',
    exhibit: `module: example-vlans
  +--rw vlans
     +--rw vlan* [id]
        +--rw id              uint16
        +--rw name?           string
        +--rw enabled?        boolean
        +--rw tagged-ports*   string
        +--ro oper-status?    enumeration`,
    options: [
      'oper-status can be set with edit-config because the module is writable',
      'tagged-ports holds exactly one string per VLAN',
      'vlans is a list that may appear many times',
      'Each vlan entry is identified by its id, and name may be omitted',
    ],
    answer: [3],
    explanation: 'In RFC 8340 notation `vlan* [id]` is a list keyed by `id`, and `?` marks `name` as optional. `ro` marks `oper-status` as state (config false), which cannot be written. The `*` on `tagged-ports` makes it a leaf-list with any number of values. `vlans` has no `*`; it is a single container that holds the list.' },
  { topic: '3.8', type: 'single', difficulty: 3, lesson: L38,
    stem: 'Refer to the exhibit. The capabilities come from an IOS XE router\'s NETCONF <hello>. How must a client change the interface description so that it takes effect?',
    exhibit: `<hello xmlns="urn:ietf:params:xml:ns:netconf:base:1.0">
  <capabilities>
    <capability>urn:ietf:params:netconf:base:1.0</capability>
    <capability>urn:ietf:params:netconf:base:1.1</capability>
    <capability>urn:ietf:params:netconf:capability:candidate:1.0</capability>
    <capability>urn:ietf:params:netconf:capability:confirmed-commit:1.1</capability>
    <capability>urn:ietf:params:netconf:capability:xpath:1.0</capability>
    <capability>urn:ietf:params:netconf:capability:validate:1.1</capability>
  </capabilities>
  <session-id>42</session-id>
</hello>`,
    options: [
      '<edit-config> with target running; the change is active at once',
      '<edit-config> with target startup, then reload the router',
      '<edit-config> with target candidate, then <commit>',
      'RESTCONF PATCH only, because NETCONF is read-only when candidate is listed',
    ],
    answer: [2],
    explanation: 'The router advertises `:candidate` and not `:writable-running`; on IOS XE, enabling the candidate datastore makes running read-only through NETCONF, so edits go to the candidate and `<commit>` applies them. Without `:startup` there is no startup datastore to target (IOS XE saves with the `cisco-ia:save-config` RPC). NETCONF is not read-only, and RESTCONF is not the only way to write.' },
  { topic: '3.8', type: 'multi', difficulty: 2, lesson: L38,
    stem: 'Which two statements correctly compare YANG model families on IOS XE? (Choose two.)',
    options: [
      'Cisco-IOS-XE-native covers platform features that vendor-neutral models do not',
      'OpenConfig models are written by a group of network operators to be vendor-neutral',
      'IETF models such as ietf-interfaces work only on Cisco devices',
      'Native models make a script portable across vendors',
      'OpenConfig models can be used only through SNMP',
    ],
    answer: [0, 1],
    explanation: 'Native (vendor) models mirror everything the platform can do, which IETF and OpenConfig models do not fully cover. OpenConfig is an operator-led, vendor-neutral set of models. IETF models are standards (for example RFC 8343) implemented by many vendors. Native models tie a script to one platform. OpenConfig models are used over NETCONF, RESTCONF and gNMI, not SNMP.' },

  // ---------- 3.9 Constructing code ----------
  { topic: '3.9', type: 'fill', difficulty: 1, lesson: L39,
    stem: 'Refer to the exhibit. Enter the header name that belongs in the blank.',
    exhibit: `Catalyst Center API reference (summary)
  Authentication API   POST /dna/system/api/v1/auth/token
    Request header:    Authorization: Basic <base64 of username:password>
    200 response:      {"Token": "<string>"}
    The token is valid for one hour and must be sent in the X-Auth-Token
    header of every other request.

----- script -----
auth = requests.post(f"{BASE}/dna/system/api/v1/auth/token",
                     auth=(USER, PASSWORD), timeout=30)
token = auth.json()["Token"]
resp = requests.get(f"{BASE}/dna/intent/api/v1/network-device",
                    headers={"____________": token, "Accept": "application/json"},
                    timeout=30)`,
    answer: ['X-Auth-Token'],
    explanation: 'Catalyst Center expects the token from the authentication API in the custom `X-Auth-Token` header. The `Authorization` header (with or without `Bearer`) is not where the reference says the token goes; it carries Basic credentials only on the token request itself.' },
  { topic: '3.9', type: 'fill', difficulty: 2, lesson: L39,
    stem: 'Refer to the exhibit. The SD-WAN Manager rejects the script\'s POST requests until it sends the token from /dataservice/client/token. Enter the header name that belongs in the blank.',
    exhibit: `SD-WAN Manager API (session authentication, summary)
  POST /j_security_check            form fields j_username, j_password
                                    -> Set-Cookie: JSESSIONID=...
  GET  /dataservice/client/token    -> XSRF prevention token (plain text)
  POST, PUT and DELETE requests must carry the JSESSIONID cookie and the
  XSRF token in the X-XSRF-TOKEN request header.

----- script -----
session = requests.Session()
session.post(f"{MANAGER}/j_security_check",
             data={"j_username": USER, "j_password": PASSWORD}, timeout=30)
xsrf = session.get(f"{MANAGER}/dataservice/client/token", timeout=30).text
session.headers["____________"] = xsrf`,
    answer: ['X-XSRF-TOKEN'],
    explanation: 'SD-WAN Manager protects changing requests with a cross-site request forgery token taken from `/dataservice/client/token` and sent in `X-XSRF-TOKEN`, together with the `JSESSIONID` cookie the session already holds. The cookie alone authenticates the session but does not satisfy the XSRF check on writes.' },
  { topic: '3.9', type: 'order', difficulty: 2, lesson: L39,
    stem: 'A script must create a Webex space, add alice@example.com to it, post a message that @mentions her (so she must already be a member), confirm the message is in the space, and remove the space at the end. Put the API calls in order.',
    items: [
      'POST /v1/rooms with a title, and keep the id from the reply',
      'POST /v1/memberships with roomId and personEmail',
      'POST /v1/messages with roomId and markdown that mentions alice',
      'GET /v1/messages?roomId=<id>',
      'DELETE /v1/rooms/<id>',
    ],
    explanation: 'Every later call needs the room id, so the space is created first. The requirement makes alice a member before the message that mentions her. The message must exist before it can be listed, and `GET /v1/messages` requires `roomId`. Deleting the space last cleans up (it returns `204 No Content`).' },
  { topic: '3.9', type: 'single', difficulty: 2, lesson: L39,
    stem: 'Refer to the exhibit. The network has about 900 clients in the last day, but the script always prints 10. What must change?',
    exhibit: `resp = session.get(f"{BASE}/networks/N_1001/clients",
                   params={"timespan": 86400}, timeout=30)
resp.raise_for_status()
print(len(resp.json()))

----- response headers -----
HTTP/1.1 200 OK
Content-Type: application/json
Link: <https://api.meraki.com/api/v1/networks/N_1001/clients?perPage=10&startingAfter=k1a2b3c&timespan=86400>; rel=next`,
    options: [
      'Set perPage (up to 5000) and keep requesting the rel=next link until there is none',
      'Increase timespan to 2678400 (31 days)',
      'Send the request as POST with the parameters in a JSON body',
      'Give the API key organization write access',
    ],
    answer: [0],
    explanation: 'This operation defaults to 10 entries per page and returns the rest through the `Link` header, so the script must raise `perPage` (3 to 5000 for this call) and follow `rel=next` until it disappears. A longer timespan returns more clients in total but still 10 per page. The list is a GET with query parameters, and the key is already authorised (the call returned `200`).' },
  { topic: '3.9', type: 'fill', difficulty: 1, lesson: L39,
    stem: 'Refer to the exhibit. Enter the JSON key that belongs in the blank so that the loop prints each member\'s email address.',
    exhibit: `GET /v1/memberships?roomId=<ROOM_ID> HTTP/1.1
Host: webexapis.com
Authorization: Bearer <YOUR_WEBEX_TOKEN>

HTTP/1.1 200 OK
Content-Type: application/json

{"items": [
  {"id": "<MEMBERSHIP_ID_1>", "roomId": "<ROOM_ID>", "personEmail": "alice@example.com", "isModerator": false},
  {"id": "<MEMBERSHIP_ID_2>", "roomId": "<ROOM_ID>", "personEmail": "bob@example.com", "isModerator": true}
]}

----- script -----
for m in resp.json()["______"]:
    print(m["personEmail"])`,
    answer: ['items'],
    explanation: 'Webex list operations return an object whose `items` array holds the results (and page with `max` and a `Link` header). The response is not a bare list, so iterating over `resp.json()` would yield the key name, and keys such as `memberships` or `response` do not exist here.' },
  { topic: '3.9', type: 'single', difficulty: 2, lesson: L39,
    stem: 'Refer to the exhibit. The script stops with KeyError. Which change fixes it?',
    exhibit: `resp = requests.get(
    "https://nso.example.com/restconf/data/tailf-ncs:devices/device?fields=name;address",
    auth=(USER, PASSWORD),
    headers={"Accept": "application/yang-data+json"}, timeout=30)
resp.raise_for_status()
for dev in resp.json()["device"]:
    print(dev["name"], dev["address"])

----- response body -----
{"tailf-ncs:device": [
  {"name": "rtr01", "address": "10.10.30.1"},
  {"name": "sw01", "address": "10.10.30.2"}
]}`,
    options: [
      'Change the Accept header to application/json',
      'Add an X-Auth-Token header obtained from a login call',
      'Read resp.json()["tailf-ncs:device"]',
      'Request /restconf/data/devices/device without the module prefix',
    ],
    answer: [2],
    explanation: 'RESTCONF JSON (RFC 7951) qualifies a top-level member with its module name, so the list arrives as `tailf-ncs:device` and the script must use that key. The request already succeeded (`raise_for_status()` passed), so neither the media type nor authentication is the problem; NSO examples use Basic credentials. The first path segment after `data/` must carry the module name, so removing it would break the URL.' },
  { topic: '3.9', type: 'multi', difficulty: 3, lesson: L39,
    stem: 'Refer to the exhibit. The script must list Catalyst Center clients seen in the last hour, starting from the first record. Which two changes does the documentation require? (Choose two.)',
    exhibit: `Catalyst Center API reference (summary)
  GET /dna/data/api/v1/clients
    startTime, endTime   UNIX epoch time in milliseconds; inclusive
    limit                maximum records to return
    offset               one-based starting point; the first record is 1
  Response: {"response": [...], "page": {"limit", "offset", "count"}, "version"}

----- script -----
now = int(time.time())
params = {"startTime": now - 3600, "endTime": now, "limit": 100, "offset": 0}
resp = requests.get(f"{BASE}/dna/data/api/v1/clients",
                    headers={"X-Auth-Token": token}, params=params, timeout=30)
for c in resp.json()["response"]:
    print(c["macAddress"], c.get("ipv4Address"))`,
    options: [
      'Express startTime and endTime in milliseconds, for example int(time.time() * 1000) and 3600 * 1000 for the hour',
      'Set offset to 1',
      'Read resp.json()["items"] instead of resp.json()["response"]',
      'Send the token in Authorization: Bearer instead of X-Auth-Token',
      'Use POST because the endpoint has a body',
    ],
    answer: [0, 1],
    explanation: 'The excerpt says both times are epoch **milliseconds**, but `time.time()` returns seconds, so the values must be multiplied by 1000 (including the 3600-second window). Offsets are one-based, so the first record is `offset=1`, not 0. The data does sit under `response`, Catalyst Center uses `X-Auth-Token`, and the documented method is GET with query parameters.' },
];

export default bank.map((item, i) => ({ id: `d3-${String(i + 1).padStart(3, '0')}`, ...item }));
