// Domain 2 — Understanding and Using APIs. Original questions. HTTP semantics follow RFC 9110, RFC 6585 (429), RFC 7617 (Basic), RFC 6750 (Bearer), RFC 8288 (Link) and RFC 5789 (PATCH); curl behaviour follows the curl man page; requests behaviour follows requests.readthedocs.io and was confirmed where possible without a network (requests 2.34.2, Python 3.14: prepared requests, base64, raise_for_status messages, Response.links). Cisco details follow developer.cisco.com (Catalyst Center authentication and asynchronous API pages; Meraki rate-limit, pagination and authorization pages). The example API at api.example.com is invented; HTTP exchanges are written from the documentation, not captured from a live API.
const L21 = '2.1-rest-request';
const L22 = '2.2-webhooks';
const L23 = '2.3-api-constraints';
const L24 = '2.4-http-status-codes';
const L25 = '2.5-troubleshooting';
const L26 = '2.6-http-response';
const L27 = '2.7-api-authentication';
const L28 = '2.8-api-styles';
const L29 = '2.9-python-requests';

const bank = [
  // ---------- 2.1 Constructing a REST request ----------
  { topic: '2.1', type: 'single', difficulty: 2, lesson: L21,
    stem: 'Refer to the exhibit. An engineer must list the clients seen on network N_1001 during the last hour, 50 per page. Which request matches the documentation?',
    exhibit: `List the clients of a network
GET /networks/{networkId}/clients

Base URL:  https://api.example.com/api/v1
Headers:   Authorization: Bearer <API key>
           Accept: application/json

Path parameters
  networkId   string    required

Query parameters
  timespan    integer   optional   Seconds to look back (default 86400)
  perPage     integer   optional   1-1000 (default 10)`,
    options: [
      'GET https://api.example.com/api/v1/networks/clients?networkId=N_1001&timespan=3600&perPage=50',
      'POST https://api.example.com/api/v1/networks/N_1001/clients with the body {"timespan": 3600, "perPage": 50}',
      'GET https://api.example.com/api/v1/networks/N_1001/clients?timespan=3600&perPage=50',
      'GET https://api.example.com/api/v1/networks/{N_1001}/clients/timespan/3600/perPage/50',
    ],
    answer: [2],
    explanation: 'The documentation gives a GET with `networkId` as a **path** parameter and `timespan` and `perPage` as **query** parameters, so the id replaces `{networkId}` in the path and the two filters go after `?`, joined by `&`; 3600 seconds is one hour. Moving `networkId` into the query string produces a different path (`/networks/clients`) that the API does not define. POST with a JSON body is the wrong method, and a GET carries its filters in the query string, not a body. The braces are only a placeholder and are not sent, and query parameters are not path segments.' },
  { topic: '2.1', type: 'fill', difficulty: 2, lesson: L21,
    stem: 'Refer to the exhibit. The request must create a new VLAN; the server assigns the VLAN object id and, on success, answers 201 Created with a Location header. Enter the HTTP method that belongs in the blank on the request line.',
    exhibit: `______ /api/v1/networks/N_1001/vlans HTTP/1.1
Host: api.example.com
Authorization: Bearer <YOUR_API_KEY>
Content-Type: application/json
Accept: application/json
Content-Length: 57

{"vlanId": 30, "name": "voice", "subnet": "10.30.0.0/24"}`,
    answer: ['POST'],
    explanation: 'Creating a new member of a collection (`/vlans`) where the server assigns the new resource its identifier is a **POST** to the collection URL; RFC 9110 has the server answer `201 Created` and identify the new resource with `Location`. PUT would need the client to target the item URL itself (for example `/vlans/30`), PATCH modifies an existing resource, and GET sends no body.' },
  { topic: '2.1', type: 'fill', difficulty: 2, lesson: L21,
    stem: 'Refer to the exhibit. The API rejects this request with 415 Unsupported Media Type because one header is missing. The documentation says request bodies must be JSON. Enter the name of the missing header.',
    exhibit: `PATCH /api/v1/networks/N_1001/vlans/30 HTTP/1.1
Host: api.example.com
Authorization: Bearer <YOUR_API_KEY>
Accept: application/json
Content-Length: 16

{"name": "voip"}

HTTP/1.1 415 Unsupported Media Type
Content-Type: application/json
Content-Length: 50

{"error": "Content-Type must be application/json"}`,
    answer: ['Content-Type', 'Content-Type:'],
    explanation: '`Content-Type` tells the server the media type of the body the client is sending; without it (or with the wrong value) the server cannot tell the body is JSON, and RFC 9110 defines `415` for content in a format the resource does not support. The request already has `Accept`, which only states what the client wants **back**, and `Authorization`, which is accepted (a bad key would give 401). The fix is `Content-Type: application/json`.' },
  { topic: '2.1', type: 'multi', difficulty: 2, lesson: L21,
    stem: 'According to RFC 9110, which two methods are idempotent but not safe? (Choose two.)',
    options: ['GET', 'PUT', 'POST', 'DELETE', 'HEAD', 'PATCH'],
    answer: [1, 3],
    explanation: 'RFC 9110 defines GET, HEAD, OPTIONS and TRACE as safe (read-only), and PUT, DELETE and the safe methods as idempotent. So **PUT** and **DELETE** are idempotent (repeating them has the same intended effect) while requesting a change, which makes them unsafe. GET and HEAD are both safe and idempotent. POST is neither safe nor idempotent. RFC 5789 says PATCH is neither safe nor idempotent in general, although a specific PATCH can be written to be idempotent.' },
  { topic: '2.1', type: 'single', difficulty: 3, lesson: L21,
    stem: 'Refer to the exhibit. The documentation says PUT replaces the whole VLAN resource with the representation sent. After the PUT succeeds, what does a GET on the same URL return?',
    exhibit: `GET /api/v1/networks/N_1001/vlans/30   ->  200 OK
{"vlanId": 30, "name": "voice", "subnet": "10.30.0.0/24", "dhcp": "enabled"}

PUT /api/v1/networks/N_1001/vlans/30
Content-Type: application/json

{"vlanId": 30, "name": "voip"}

->  200 OK`,
    options: [
      '{"vlanId": 30, "name": "voip", "subnet": "10.30.0.0/24", "dhcp": "enabled"}, because PUT only changes the fields sent',
      'Two VLAN 30 objects, because PUT adds a new representation alongside the old one',
      '{"vlanId": 30, "name": "voice", "subnet": "10.30.0.0/24", "dhcp": "enabled"}, because a PUT without every field is ignored',
      '{"vlanId": 30, "name": "voip"} plus any server defaults for subnet and dhcp, because the old subnet and dhcp values were replaced',
    ],
    answer: [3],
    explanation: 'PUT asks the server to make the resource\'s state **match the representation enclosed** (RFC 9110): the old `subnet` and `dhcp` values are not kept, so only what was sent (plus whatever defaults the server applies to omitted fields) remains. Keeping the old fields and changing only `name` is what **PATCH** does. PUT targets one URL, so it cannot create a second VLAN 30 there. The server answered `200 OK`, so the request was not ignored; an API that rejected an incomplete body would answer with a 4xx instead.' },
  { topic: '2.1', type: 'single', difficulty: 2, lesson: L21,
    stem: 'A script sends a request, and the connection drops before any response arrives. The engineer wants the script to resend automatically without risking a duplicate change. For which request is that safe by HTTP semantics alone?',
    options: [
      'POST /api/v1/networks/N_1001/vlans with a new VLAN in the body',
      'PUT /api/v1/networks/N_1001/vlans/30 with the complete VLAN 30 object',
      'POST /api/v1/devices/42/reboot',
      'PATCH /api/v1/counters/7 with {"increment": 1}',
    ],
    answer: [1],
    explanation: '**PUT** is idempotent: sending the same full representation twice leaves VLAN 30 in the same state, and RFC 9110 names this exact case (retrying an idempotent request after the connection closes). A repeated POST to the collection can create a second VLAN; a repeated POST to the reboot action can reboot the device twice; and an "increment" PATCH is a textbook non-idempotent change. None of those can be retried blindly.' },
  { topic: '2.1', type: 'single', difficulty: 2, lesson: L21,
    stem: 'Refer to the exhibit. Which Content-Type header does curl send with this request?',
    exhibit: `curl -X POST "https://api.example.com/api/v1/devices" \\
  -H "Authorization: Bearer <YOUR_API_KEY>" \\
  -d '{"hostname": "sw01", "vlan": 10}'`,
    options: [
      'Content-Type: application/x-www-form-urlencoded',
      'Content-Type: application/json, because the body starts with {',
      'No Content-Type header, because only -H sets headers',
      'Content-Type: text/plain',
    ],
    answer: [0],
    explanation: 'The curl man page says `-d` sends the data "using the content-type application/x-www-form-urlencoded". curl does not inspect the data, so a body that looks like JSON is still labelled as form data, and a JSON API typically answers 400 or 415. Add `-H "Content-Type: application/json"`, or use `--json` (curl 7.82.0 and later), which sets both `Content-Type` and `Accept` to `application/json`. `text/plain` is not what curl uses.' },
  { topic: '2.1', type: 'match', difficulty: 2, lesson: L21,
    stem: 'The documentation for an inventory API lists the operations below. Match each task to the request that performs it.',
    pairs: [
      ['Read only the devices whose status is offline', 'GET /api/v1/devices?status=offline'],
      ['Add a new device; the server assigns its id', 'POST /api/v1/devices'],
      ['Change only the description of device 42', 'PATCH /api/v1/devices/42'],
      ['Replace the entire record of device 42', 'PUT /api/v1/devices/42'],
      ['Remove device 42 from the inventory', 'DELETE /api/v1/devices/42'],
    ],
    explanation: 'Filtering a collection is a GET with a query parameter. Creating where the server picks the id is a POST to the collection. PATCH changes only the fields sent (RFC 5789); PUT replaces the whole representation at a known URL; DELETE removes it. The id of a specific device goes in the path, not the query string.' },
  { topic: '2.1', type: 'single', difficulty: 1, lesson: L21,
    stem: 'Refer to the exhibit. What is the purpose of the Accept header in this request?',
    exhibit: `GET /api/v1/networks/N_1001/vlans HTTP/1.1
Host: api.example.com
Authorization: Bearer <YOUR_API_KEY>
Accept: application/json`,
    options: [
      'It tells the server that the request body is JSON',
      'It lists the HTTP methods the client is allowed to use',
      'It confirms that the client accepts the server\'s terms of use',
      'It tells the server which media type the client wants in the response',
    ],
    answer: [3],
    explanation: '`Accept` is the client\'s statement of the response media types it can handle; a server that cannot produce any of them may answer `406 Not Acceptable`. The format of a request body is stated by `Content-Type`, and this GET has no body at all. Allowed methods are returned by the server in the `Allow` header. There is no "terms of use" meaning.' },

  // ---------- 2.2 Webhooks ----------
  { topic: '2.2', type: 'single', difficulty: 1, lesson: L22,
    stem: 'A team checks Meraki every 60 seconds for switches that went down. Alerts arrive up to a minute late, and the polling uses much of the organisation\'s API budget. Which approach addresses both problems?',
    options: [
      'Poll every 5 seconds instead of every 60 seconds',
      'Configure a webhook so that Meraki sends an HTTP POST to the team\'s receiver when the alert fires',
      'Switch from JSON to XML responses to reduce their size',
      'Use PUT instead of GET so that the request is idempotent',
    ],
    answer: [1],
    explanation: 'A **webhook** reverses the direction: the platform calls the registered receiver URL when the event happens, so there is no polling delay and no API call is spent when nothing changes. Polling faster reduces the delay but uses even more of the rate limit (lesson 2.3). Changing the data format affects neither latency nor call count, and GET is already idempotent; PUT would modify data.' },
  { topic: '2.2', type: 'single', difficulty: 3, lesson: L22,
    stem: 'Refer to the exhibit. A webhook receiver rejects some genuine Webex deliveries because the signature does not match, although the secret is correct. What is the most likely cause?',
    exhibit: `def handle(raw_body: bytes, headers: dict) -> int:
    payload = json.loads(raw_body)
    body = json.dumps(payload).encode()
    expected = hmac.new(SECRET, body, hashlib.sha1).hexdigest()
    if not hmac.compare_digest(expected, headers["X-Spark-Signature"]):
        return 401
    queue.put(payload)
    return 200`,
    options: [
      'hmac.compare_digest cannot compare two strings and must be replaced with ==',
      'The receiver should answer 500 instead of 401 so that Webex retries',
      'The HMAC is computed over re-serialised JSON instead of the exact raw bytes received, so different spacing or escaping changes the digest',
      'Webex signs payloads with the receiver\'s TLS certificate, not with the secret',
    ],
    answer: [2],
    explanation: 'The Webex documentation says `X-Spark-Signature` is an HMAC-SHA1 over the **unmodified raw request body**. `json.dumps(json.loads(raw))` can change whitespace, separators and character escaping, so the digest differs whenever Webex\'s serialisation differs from Python\'s. Compute the HMAC over `raw_body`. `hmac.compare_digest` accepts two strings and should be kept because it compares in constant time. Returning 500 would not fix the mismatch. The signature is keyed with the shared secret, not a certificate.' },
  { topic: '2.2', type: 'order', difficulty: 2, lesson: L22,
    stem: 'Put the steps of setting up and handling a Webex webhook in order.',
    items: [
      'Deploy an HTTPS receiver that Webex can reach from the internet and note its public URL',
      'Register the webhook through the API with that URL as targetUrl, plus a resource, event and secret',
      'An event occurs and Webex POSTs a JSON notification to the targetUrl',
      'The receiver computes the HMAC of the raw body and compares it with X-Spark-Signature',
      'The receiver answers with a 2xx status straight away',
      'A background worker fetches the full resource with the API (for example the message text) and acts on it',
    ],
    explanation: 'The receiver must exist before Webex is told its URL. Registration supplies the `targetUrl`, the `resource` and `event` to subscribe to, and a `secret` for signing. Each notification is verified against the raw body before anything is trusted, the receiver acknowledges quickly so the delivery is not treated as failed, and slow work, such as fetching encrypted message content that the notification does not include, happens afterwards.' },
  { topic: '2.2', type: 'multi', difficulty: 2, lesson: L22,
    stem: 'Which two statements about webhook delivery are true? (Choose two.)',
    options: [
      'A receiver can get the same event more than once, so processing should be idempotent, keyed on the event id',
      'Webhooks guarantee exactly-once, in-order delivery, so no reconciliation is ever needed',
      'The receiver should acknowledge with a 2xx status quickly and do slow work afterwards',
      'The receiver must poll the platform to collect each webhook',
      'Webhook payloads are always sent with the GET method',
    ],
    answer: [0, 2],
    explanation: 'Platforms retry deliveries that time out or fail, so the same event can arrive twice (at-least-once delivery): record event ids and ignore repeats. A slow or failing receiver looks like a failed delivery, so answer 2xx at once and queue the work. Delivery is not guaranteed to be exactly once or in order, which is why occasional reconciliation polls are useful. The platform pushes the notification, so there is nothing to poll for it, and webhook notifications are POST requests with a body, not GETs.' },

  // ---------- 2.3 Constraints ----------
  { topic: '2.3', type: 'single', difficulty: 2, lesson: L23,
    stem: 'Refer to the exhibit. A script receives this response in the middle of a loop over 400 switches. What should the script do?',
    exhibit: `HTTP/1.1 429 Too Many Requests
Content-Type: application/json
Retry-After: 2

{"errors": ["API rate limit exceeded for organization"]}`,
    options: [
      'Re-authenticate, because the API key has been revoked',
      'Resend immediately with a PATCH, because GET requests are rate-limited separately',
      'Stop permanently, because 4xx errors can never succeed on retry',
      'Wait at least 2 seconds, resend the same request, and slow the loop down',
    ],
    answer: [3],
    explanation: 'RFC 6585 defines `429` as too many requests in a given time ("rate limiting") and allows a `Retry-After` header; here it says 2 seconds. Wait that long, retry the unchanged request, and throttle so the limit is not hit again. The key is fine: an invalid key would give 401. 429 is an exception to "4xx will not succeed on retry" (408 Request Timeout is another). Changing the method changes what the request does and does not avoid the limit.' },
  { topic: '2.3', type: 'single', difficulty: 2, lesson: L23,
    stem: 'Refer to the exhibit. An organisation has 340 devices, but the script always reports 100. Every call returns 200. What is the cause?',
    exhibit: `>>> r = requests.get(f"{BASE}/organizations/123456/devices",
...                  headers=HEADERS, params={"perPage": 100}, timeout=30)
>>> r.status_code, len(r.json())
(200, 100)
>>> r.headers["Link"]
'<https://api.example.com/api/v1/organizations/123456/devices?perPage=100&startingAfter=Q2XX-0100>; rel="next"'`,
    options: [
      'The API key only has permission to see 100 devices',
      'The timeout of 30 seconds cut the response short',
      'The response is paginated and the script never requests the URL in the Link header with rel="next"',
      'The perPage parameter is ignored, and the server has a hard limit of 100 devices per organisation',
    ],
    answer: [2],
    explanation: 'The `Link` header (RFC 8288) contains a `rel="next"` URL, which means more pages exist. The script must follow it (in requests, `r.links["next"]["url"]`) until no `next` link is returned. A permissions problem would usually show as 403 or an empty list, not a next-page link. A timeout raises an exception instead of returning a complete `200` with 100 items. `perPage=100` was honoured: exactly 100 came back.' },
  { topic: '2.3', type: 'fill', difficulty: 2, lesson: L23,
    stem: 'Refer to the exhibit. The API uses offset/limit pagination, and the script fetches pages in order until a page comes back with fewer items than the limit. Enter the offset value the script must send on its third request.',
    exhibit: `Request 1: GET /api/v1/devices?offset=0&limit=100     -> 200 OK, 100 items
Request 2: GET /api/v1/devices?offset=100&limit=100   -> 200 OK, 100 items
Request 3: GET /api/v1/devices?offset=____&limit=100  -> ?`,
    answer: ['200'],
    explanation: 'With offset/limit paging, each request skips `offset` items and returns up to `limit`. The first two calls covered items 0-99 and 100-199, so the third starts at **200**. The loop continues until a page holds fewer than 100 items (or none).' },
  { topic: '2.3', type: 'single', difficulty: 2, lesson: L23,
    stem: 'A long-running Catalyst Center script runs fine for about an hour, then every request starts returning 401 Unauthorized. Nothing in the script\'s requests changed. What is the most likely cause?',
    options: [
      'The X-Auth-Token obtained at start-up has expired',
      'The script exceeded the rate limit',
      'The user\'s role was changed to read-only',
      'The API version in the URL was retired',
    ],
    answer: [0],
    explanation: 'Catalyst Center documents a token lifetime of **60 minutes**, after which calls return `401 Unauthorized` and the client must request a new token from `/dna/system/api/v1/auth/token`. Rate limiting returns 429. A role change gives 403 for the operations no longer allowed, not 401 on every request. A retired API version gives 404 or similar, not 401.' },
  { topic: '2.3', type: 'multi', difficulty: 2, lesson: L23,
    stem: 'Which two statements about constraints when consuming APIs are true? (Choose two.)',
    options: [
      'A server that refuses a request body because it is too large answers 413 Content Too Large',
      'The Python requests library times out after 60 seconds by default',
      'Putting the version in the path, as in /api/v1/, lets a provider release v2 without breaking clients written for v1',
      'Retry-After can only contain an HTTP date, never a number of seconds',
      'Offset/limit pagination is immune to items being added or removed between page requests',
    ],
    answer: [0, 2],
    explanation: 'RFC 9110 defines `413 Content Too Large` for request content bigger than the server will process. Versioning in the URL path lets old and new versions run side by side, so existing clients keep working. requests has **no** default timeout; its documentation warns that a request without one can hang indefinitely. `Retry-After` may be an HTTP date **or** a number of seconds. Offset paging can skip or repeat items when the collection changes between calls, which is one reason cursors exist.' },

  // ---------- 2.4 HTTP response codes ----------
  { topic: '2.4', type: 'match', difficulty: 2, lesson: L24,
    stem: 'Match each API outcome to the status code a REST API normally returns for it.',
    pairs: [
      ['A POST created VLAN 30; the response includes a Location header', '201 Created'],
      ['A DELETE removed the VLAN and the response has no body', '204 No Content'],
      ['A discovery job was queued and a task id was returned to check later', '202 Accepted'],
      ['The script sent 40 requests in one second to an API that allows 10', '429 Too Many Requests'],
      ['An unhandled exception in the API\'s code aborted the request', '500 Internal Server Error'],
    ],
    explanation: '201 means a new resource was created and identified by `Location`. 204 means success with no content: a 204 cannot carry a body. 202 means accepted for processing but not finished, the asynchronous pattern Catalyst Center uses with task ids. 429 is rate limiting (RFC 6585). 500 is an unexpected server-side failure, which the client cannot fix by changing the request.' },
  { topic: '2.4', type: 'single', difficulty: 2, lesson: L24,
    stem: 'Refer to the exhibit. What does this response tell the client?',
    exhibit: `HTTP/1.1 401 Unauthorized
WWW-Authenticate: Bearer realm="api", error="invalid_token", error_description="The access token expired"
Content-Type: application/json
Content-Length: 41

{"error": "The access token has expired"}`,
    options: [
      'The token was accepted, but it lacks permission for this resource',
      'The token is not valid any more; the client should obtain a new one and retry',
      'The resource does not exist',
      'The server is temporarily unavailable and the client should retry with the same token',
    ],
    answer: [1],
    explanation: '`401 Unauthorized` means the request lacks valid authentication credentials, and the `WWW-Authenticate` header must state the expected scheme. RFC 6750 uses `error="invalid_token"` for tokens that are expired, revoked or malformed, and says the client may request a new token and retry. A valid token without enough permission is `403` (`insufficient_scope`). A missing resource is 404, and temporary unavailability is 503; retrying with the same expired token would fail again.' },
  { topic: '2.4', type: 'single', difficulty: 2, lesson: L24,
    stem: 'Refer to the exhibit. Which statement explains the second response?',
    exhibit: `GET /api/v1/networks/N_1001/vlans/30
Authorization: Bearer <YOUR_API_KEY>
->  200 OK

DELETE /api/v1/networks/N_1001/vlans/30
Authorization: Bearer <YOUR_API_KEY>
->  403 Forbidden
    {"errors": ["Your role (read-only) does not permit this operation"]}`,
    options: [
      'The API key is invalid and must be regenerated',
      'VLAN 30 does not exist',
      'The key authenticates the user, but the user is not authorised to delete; an account with write permission is needed',
      'DELETE is not supported on this resource, and the Allow header lists the supported methods',
    ],
    answer: [2],
    explanation: 'The same key succeeded on the GET, so authentication works. RFC 9110 defines 403 as the server understanding the request and refusing it, and the body names the reason: a read-only role. Use an account with write rights; resending the same credentials will not help. An invalid key would give 401 on both calls. The GET proves VLAN 30 exists (no 404). An unsupported method would be `405 Method Not Allowed` with an `Allow` header.' },
  { topic: '2.4', type: 'multi', difficulty: 2, lesson: L24,
    stem: 'A script receives each of the following status codes in response to a well-formed request. For which two can resending the identical request later reasonably succeed? (Choose two.)',
    options: ['400 Bad Request', '404 Not Found', '429 Too Many Requests', '503 Service Unavailable', '415 Unsupported Media Type', '401 Unauthorized'],
    answer: [2, 3],
    explanation: '**429** is rate limiting and **503** is temporary overload or maintenance; both may carry `Retry-After`, and the unchanged request can succeed once the condition clears. 400, 404 and 415 describe something wrong with the request itself (syntax, URL, `Content-Type`), so sending it again unchanged gives the same answer. 401 needs new or corrected credentials, which changes the request.' },
  { topic: '2.4', type: 'single', difficulty: 2, lesson: L24,
    stem: 'Refer to the exhibit. What does the response tell the engineer?',
    exhibit: `POST /api/v1/devices/42 HTTP/1.1
Host: api.example.com
Authorization: Bearer <YOUR_API_KEY>
Content-Type: application/json
Content-Length: 28

{"description": "core link"}

HTTP/1.1 405 Method Not Allowed
Allow: GET, PUT, PATCH, DELETE
Content-Length: 0`,
    options: [
      'Device 42 does not exist',
      'The API key does not have write permission',
      'The body is not valid JSON',
      'The URL identifies a real resource, but it does not accept POST; PATCH or PUT is needed to change it',
    ],
    answer: [3],
    explanation: 'RFC 9110 defines 405 as a method that is known but not supported by the target resource, and requires the `Allow` header, which lists GET, PUT, PATCH and DELETE. To change the description, PATCH the item (or PUT the full object). A missing device would be 404, a permissions problem 403, and invalid JSON 400 (the body shown is valid JSON); the 405 and its `Allow` header point at the method.' },
  { topic: '2.4', type: 'single', difficulty: 2, lesson: L24,
    stem: 'A POST to start a network discovery returns 202 Accepted with a task id. What can the script conclude from the status code alone?',
    options: [
      'The request was accepted for processing, which has not finished and may still fail',
      'The discovery has finished successfully',
      'The discovery failed and must be resubmitted',
      'The server created the discovery resource at the URL in the Location header',
    ],
    answer: [0],
    explanation: 'RFC 9110 says 202 means the request was accepted for processing but processing has not completed, and it might not be acted upon. Catalyst Center\'s documentation stresses that 202 does not imply the task succeeded: check the task until it reports an end time and `isError`. Success with completion would be 200; creation of a resource with `Location` is 201.' },
  { topic: '2.4', type: 'fill', difficulty: 2, lesson: L24,
    stem: 'Refer to the exhibit. The status code has been removed from the response to a POST that added a new VLAN to the collection. Enter the three-digit status code the server sent.',
    exhibit: `POST /api/v1/networks/N_1001/vlans HTTP/1.1
Host: api.example.com
Content-Type: application/json
Content-Length: 31

{"vlanId": 40, "name": "guest"}

HTTP/1.1 ___ Created
Location: /api/v1/networks/N_1001/vlans/40
Content-Type: application/json
Content-Length: 31

{"vlanId": 40, "name": "guest"}`,
    answer: ['201'],
    explanation: '**201 Created**: the request created a new resource, identified by the `Location` header (RFC 9110). 200 would not carry the reason phrase "Created"; 202 would mean the work is still pending; 204 would have no body.' },

  // ---------- 2.5 Troubleshooting ----------
  { topic: '2.5', type: 'single', difficulty: 2, lesson: L25,
    stem: 'Refer to the exhibit. The documentation for the endpoint is "GET /networks/{networkId}/vlans, base URL https://api.example.com/api/v1". What is the cause of the error?',
    exhibit: `$ curl -s -i "https://api.example.com/api/v1/network/N_1001/vlans" \\
    -H "Authorization: Bearer <YOUR_API_KEY>" -H "Accept: application/json"
HTTP/1.1 404 Not Found
Content-Type: application/json
Content-Length: 34

{"errors": ["Resource not found"]}`,
    options: [
      'The API key is wrong',
      'The path says network instead of networks, so the URL matches no resource',
      'GET is not allowed on this resource',
      'The Accept header must be application/xml',
    ],
    answer: [1],
    explanation: 'Comparing the request with the documentation, `/network/` should be `/networks/`, and a URL that points at no resource gives 404. A bad key would give 401. An unsupported method would give 405 with an `Allow` header. An unsupported `Accept` value would give 406, and JSON is what the client asked for.' },
  { topic: '2.5', type: 'match', difficulty: 2, lesson: L25,
    stem: 'An engineer collects failed calls from several scripts. Match each symptom to the status code the API returns for it.',
    pairs: [
      ['The token was pasted with its last character missing', '401 Unauthorized'],
      ['A valid key for a read-only administrator is used to DELETE a network', '403 Forbidden'],
      ['The path is /api/v1/networkz/N_1001 instead of /networks/N_1001', '404 Not Found'],
      ['POST sent to /devices/42, whose documentation lists only GET, PUT and DELETE', '405 Method Not Allowed'],
      ['A JSON body is sent with Content-Type: text/plain to an endpoint that accepts only application/json', '415 Unsupported Media Type'],
      ['Well-formed JSON sets vlanId to 5000 on an API that distinguishes semantic errors from syntax errors', '422 Unprocessable Content'],
    ],
    explanation: 'A mangled token is missing valid credentials: 401. A valid identity without permission: 403. A URL that matches no resource: 404. A real resource that does not support the method: 405, with an `Allow` header. A body media type the endpoint will not take: 415. RFC 9110 uses 422 when the media type is understood and the syntax is correct but the contents cannot be processed, as with an out-of-range VLAN id. (Many APIs return 400 for that too, which is why the stem says this API distinguishes them.)' },
  { topic: '2.5', type: 'single', difficulty: 2, lesson: L25,
    stem: 'Refer to the exhibit. What should the engineer change?',
    exhibit: `POST /api/v1/devices HTTP/1.1
Host: api.example.com
Authorization: Bearer <YOUR_API_KEY>
Content-Type: application/json
Content-Length: 35

{'hostname': 'sw01', 'site': 'HQ',}

HTTP/1.1 400 Bad Request
Content-Type: application/json
Content-Length: 79

{"error": "Expecting property name enclosed in double quotes: line 1 column 2"}`,
    options: [
      'Change Content-Type to application/x-www-form-urlencoded',
      'Send the request as PUT instead of POST',
      'Build the body as valid JSON: double quotes and no trailing comma, for example with json.dumps() or requests json=',
      'Request a new token, because 400 indicates an expired token',
    ],
    answer: [2],
    explanation: 'The body uses single quotes and a trailing comma, so it is not valid JSON (RFC 8259, lesson 1.1), and the error body says exactly that. Generating the body with `json.dumps()` or passing a dict to `requests` with `json=` avoids hand-written JSON. Labelling it as form data would make things worse. The method is correct for creating a device. An expired token gives 401, not 400.' },
  { topic: '2.5', type: 'single', difficulty: 2, lesson: L25,
    stem: 'Refer to the exhibit. The call returns 401 although the key is valid and works in the vendor\'s web console. What is wrong?',
    exhibit: `API documentation:
  Authentication: send the API key in the Authorization header using the
  Bearer scheme, for example  Authorization: Bearer <API key>

Request sent:
  GET /api/v1/organizations HTTP/1.1
  Host: api.example.com
  Authorization: <YOUR_API_KEY>
  Accept: application/json

Response:
  HTTP/1.1 401 Unauthorized
  WWW-Authenticate: Bearer realm="api"`,
    options: [
      'The Authorization value is missing the Bearer scheme word before the key',
      'The key must be sent in the query string as ?api_key=',
      'GET is not allowed on /organizations',
      'The user lacks permission to list organisations',
    ],
    answer: [0],
    explanation: 'The documentation and the `WWW-Authenticate: Bearer` challenge both say the value must be `Bearer <key>`; without the scheme word the server cannot interpret the credential, so it reports missing or invalid authentication (401). Moving the key into the query string is not what the documentation says and leaks it into logs. A disallowed method would be 405, and a permission problem 403.' },
  { topic: '2.5', type: 'fill', difficulty: 2, lesson: L25,
    stem: 'Refer to the exhibit. The request returns 401 even though the token is fresh. Enter the header name that the token must be sent in.',
    exhibit: `Catalyst Center API documentation (excerpt)
  POST /dna/system/api/v1/auth/token    Basic authentication -> {"Token": "<token>"}
  All other requests: include the token in the X-Auth-Token header.

Request sent:
  GET /dna/intent/api/v1/network-device HTTP/1.1
  Host: catalyst.example.com
  Authorization: Bearer example-token-not-real
  Accept: application/json

Response:
  HTTP/1.1 401 Unauthorized`,
    answer: ['X-Auth-Token', 'X-Auth-Token:'],
    explanation: 'Catalyst Center expects its token in the custom **X-Auth-Token** header. The same token in `Authorization: Bearer` is not where the server looks, so the request is treated as unauthenticated and gets 401. Header names are case-insensitive, so any capitalisation of `X-Auth-Token` works.' },
  { topic: '2.5', type: 'single', difficulty: 3, lesson: L25,
    stem: 'Refer to the exhibit. The script reports success, but no device is ever created. What is the cause?',
    exhibit: `>>> r = requests.post("http://api.example.com/api/v1/devices", json=new_device, timeout=10)
>>> r.status_code, r.history, r.request.method, r.url
(200, [<Response [301]>], 'GET', 'https://api.example.com/api/v1/devices')
>>> r.history[0].headers["Location"]
'https://api.example.com/api/v1/devices'
>>> r.json()
[{'hostname': 'sw01'}, {'hostname': 'sw02'}]`,
    options: [
      'The device was created, and the API returns the whole list instead of 201',
      'The POST was redirected with 301, the client followed the redirect with a GET, and the GET simply listed the existing devices',
      'The server ignores POST requests that use JSON',
      'The 301 indicates that the API key must be renewed',
    ],
    answer: [1],
    explanation: 'RFC 9110 notes that for historical reasons a user agent may change POST to GET when following a 301 or 302, and requests does exactly that: `r.history` shows the 301, and `r.request.method` is GET. The 200 is for listing the collection, so nothing was created. Use the `https://` URL directly (a 307 or 308 redirect would have preserved the method). A create would normally answer 201, and the body here is the existing collection. POST with JSON is the documented way to create, and a 301 says nothing about keys.' },

  // ---------- 2.6 Parts of an HTTP response ----------
  { topic: '2.6', type: 'single', difficulty: 2, lesson: L26,
    stem: 'Refer to the exhibit. Which statement about this response is true?',
    exhibit: `HTTP/1.1 200 OK
Date: Sun, 22 Nov 2026 14:05:11 GMT
Content-Type: application/json; charset=utf-8
Content-Length: 178
Link: <https://api.example.com/api/v1/networks/N_1001/devices?perPage=2&startingAfter=Q2XX-0002>; rel="next"

[
  {"serial": "Q2XX-0001", "name": "sw01", "model": "MS250-48", "lanIp": "10.10.20.11"},
  {"serial": "Q2XX-0002", "name": "sw02", "model": "MS250-48", "lanIp": "10.10.20.12"}
]`,
    options: [
      'The body is a JSON array of two objects, and at least one more page of devices is available',
      'The network has exactly two devices',
      'The body is XML, because Content-Type includes a charset parameter',
      'Content-Length: 178 means the body contains 178 devices',
    ],
    answer: [0],
    explanation: 'The status line says success, `Content-Type` says JSON in UTF-8, and the body is an array of two objects. The `Link` header with `rel="next"` means another page exists, so the network has more than two devices. `charset` is a normal parameter of a JSON media type, not a sign of XML. `Content-Length` is the size of the body in bytes.' },
  { topic: '2.6', type: 'fill', difficulty: 1, lesson: L26,
    stem: 'Refer to the exhibit. Enter the name of the response header that tells the client the URL of the newly created VLAN.',
    exhibit: `HTTP/1.1 201 Created
Date: Sun, 22 Nov 2026 14:06:02 GMT
Location: /api/v1/networks/N_1001/vlans/30
Content-Type: application/json
Content-Length: 57

{"vlanId": 30, "name": "voice", "subnet": "10.30.0.0/24"}`,
    answer: ['Location', 'Location:'],
    explanation: 'RFC 9110: the primary resource created by a request answered with 201 is identified by the **Location** header field (or, if there is none, by the target URI). `Content-Type` describes the body format, `Content-Length` its size, and `Date` when the response was generated.' },
  { topic: '2.6', type: 'multi', difficulty: 2, lesson: L26,
    stem: 'Refer to the exhibit. Which two statements are true? (Choose two.)',
    exhibit: `HTTP/1.1 503 Service Unavailable
Content-Type: text/html
Retry-After: 120
Content-Length: 74

<html><body><h1>Down for maintenance, back in 2 minutes</h1></body></html>`,
    options: [
      'Calling response.json() on this response in requests raises a JSONDecodeError',
      'The client should wait about 120 seconds before retrying',
      'The status line shows that the client sent a malformed request',
      'Retry-After: 120 means the client may retry after 120 milliseconds',
      'The body must be ignored because error responses never contain a body',
    ],
    answer: [0, 1],
    explanation: 'The body is HTML (`Content-Type: text/html`), so parsing it as JSON fails; such pages often come from a proxy or maintenance page in front of the API. `Retry-After: 120` is in **seconds** (RFC 9110), so wait about two minutes. 503 is a server-side (5xx) condition, not a malformed request. Error responses normally do carry a body that explains the problem.' },
  { topic: '2.6', type: 'single', difficulty: 2, lesson: L26,
    stem: 'Refer to the exhibit. Why does the last line raise an exception?',
    exhibit: `>>> r = requests.delete(f"{BASE}/networks/N_1001/vlans/30", headers=HEADERS, timeout=10)
>>> r.status_code
204
>>> r.text
''
>>> r.json()
requests.exceptions.JSONDecodeError: Expecting value: line 1 column 1 (char 0)`,
    options: [
      'The DELETE failed, and the server returned an error page',
      'The headers dictionary is missing Accept: application/json',
      'The json() method only works on POST responses',
      'A 204 No Content response has no body, so there is no JSON to parse',
    ],
    answer: [3],
    explanation: '204 means success with no content: RFC 9110 says a 204 response ends with its headers and cannot contain a body. `r.text` is an empty string, and parsing an empty string as JSON fails. Check `r.status_code` (or `r.ok`) instead. The DELETE succeeded. `.json()` works on any response with a JSON body, whatever the method. `Accept` cannot create a body that a 204 does not have.' },

  // ---------- 2.7 Authentication ----------
  { topic: '2.7', type: 'single', difficulty: 2, lesson: L27,
    stem: 'Refer to the exhibit. Which statement about this header is true?',
    exhibit: `GET /restconf/data/ietf-interfaces:interfaces HTTP/1.1
Host: rtr01.example.com
Authorization: Basic YWxpY2U6ZXhhbXBsZS1wYXNzd29yZA==
Accept: application/yang-data+json`,
    options: [
      'The value is the password encrypted with the server\'s public key, so it is safe over plain HTTP',
      'The value is a one-time token that expires after this request',
      'The value is a hash of the password, which the server cannot reverse',
      'The value is base64 of "alice:example-password", which anyone who sees it can decode, so the connection must use TLS',
    ],
    answer: [3],
    explanation: 'RFC 7617 Basic sends base64(user-id ":" password). `YWxpY2U6ZXhhbXBsZS1wYXNzd29yZA==` decodes to `alice:example-password` (`base64.b64decode` in Python). Base64 is an encoding with no key, not encryption or hashing, so Basic is only safe inside TLS. The same value is sent on every request; it is not a one-time token.' },
  { topic: '2.7', type: 'order', difficulty: 2, lesson: L27,
    stem: 'A script uses the Catalyst Center API for several hours. Put the steps in the order they occur.',
    items: [
      'POST /dna/system/api/v1/auth/token with the username and password as Basic authentication',
      'Read the Token value from the JSON response',
      'Send GET /dna/intent/api/v1/network-device with the token in the X-Auth-Token header',
      'After about 60 minutes a request returns 401 Unauthorized',
      'Request a new token from /dna/system/api/v1/auth/token',
      'Resend the failed request with the new token in X-Auth-Token',
    ],
    explanation: 'Catalyst Center authenticates once with Basic on the token endpoint and returns `{"Token": "..."}`. Every later request carries it in `X-Auth-Token`. The documented lifetime is 60 minutes; after that the API returns 401 and the client must authenticate again, then retry the request that failed.' },
  { topic: '2.7', type: 'single', difficulty: 2, lesson: L27,
    stem: 'An API accepts its key either in the X-API-Key header or as ?api_key= in the URL. Why is the header the better choice?',
    options: [
      'Query strings are not encrypted by TLS',
      'Full URLs, including query strings, are commonly written to server and proxy logs, browser history and monitoring tools, where the key can leak',
      'Headers are limited to ASCII, which makes the key harder to guess',
      'The header makes the request idempotent',
    ],
    answer: [1],
    explanation: 'Access logs, proxy logs, browser history and `Referer` headers routinely record the whole URL, so a key in the query string ends up stored in places the owner does not control; RFC 6750 warns against tokens in URLs for the same reason. Over HTTPS the query string **is** encrypted in transit; the risk is what happens at the endpoints. The character set of a header does not affect guessability, and idempotency is a property of the method.' },
  { topic: '2.7', type: 'match', difficulty: 2, lesson: L27,
    stem: 'Match each script behaviour to the authentication mechanism it uses.',
    pairs: [
      ['Every request carries base64 of the username and password joined by a colon', 'Basic authentication'],
      ['A login call returns a value that later requests send in X-Auth-Token until it expires', 'Custom token'],
      ['A long-lived string generated in the platform\'s web portal is sent with every request', 'API key'],
      ['An authorisation server issues a short-lived token with scopes, sent as Authorization: Bearer', 'OAuth 2.0 bearer token'],
    ],
    explanation: 'Basic (RFC 7617) re-sends the encoded credentials on every call. A custom token comes from a login call and travels in a vendor-defined header, as with Catalyst Center\'s `X-Auth-Token`. An API key is generated in a portal and normally does not expire on its own (Meraki keys, for example). OAuth 2.0 access tokens are issued by an authorisation server, carry scopes, expire, and are sent with the Bearer scheme of RFC 6750; Bearer goes beyond the three mechanisms the exam topic lists but is now the common modern form.' },
  { topic: '2.7', type: 'fill', difficulty: 1, lesson: L27,
    stem: 'Refer to the exhibit. Enter the word that belongs in the blank.',
    exhibit: `Meraki Dashboard API v1 documentation (excerpt)
  Send your API key in the Authorization header using the Bearer scheme.

Request:
  GET /api/v1/organizations HTTP/1.1
  Host: api.meraki.com
  Authorization: ______ <YOUR_API_KEY>
  Accept: application/json`,
    answer: ['Bearer'],
    explanation: 'The Meraki Dashboard API v1 authorization page says the `Authorization` value is the word **Bearer** followed by the API key (the older v0 header `X-Cisco-Meraki-API-Key` is not used in v1). The format comes from RFC 6750: `Authorization: Bearer <token>`.' },
  { topic: '2.7', type: 'multi', difficulty: 2, lesson: L27,
    stem: 'Which two statements about HTTP Basic authentication are true? (Choose two.)',
    options: [
      'The credentials are sent in the Authorization header as the word Basic followed by base64(username:password)',
      'Base64 encryption protects the password from anyone who captures the request',
      'The server signals that it wants Basic with a WWW-Authenticate: Basic challenge in a 401 response',
      'Basic credentials expire after 60 minutes',
      'Basic authentication cannot be used over HTTPS',
    ],
    answer: [0, 2],
    explanation: 'RFC 7617 defines the `Authorization: Basic <base64(user-id:password)>` format and the `WWW-Authenticate: Basic realm="..."` challenge that comes with a 401. Base64 is an encoding, not encryption; anyone can decode it, which is why Basic must be used **with** TLS (HTTPS), not instead of it. The credentials do not expire; they are the account password itself. The 60-minute lifetime is Catalyst Center\'s token, which is obtained with Basic but is a different credential.' },
  { topic: '2.7', type: 'single', difficulty: 3, lesson: L27,
    stem: 'Refer to the exhibit. What must change for the request to succeed?',
    exhibit: `PUT /api/v1/networks/N_1001/firewall/rules HTTP/1.1
Host: api.example.com
Authorization: Bearer example-token-not-real
Content-Type: application/json
Content-Length: 13

{"rules": []}

HTTP/1.1 403 Forbidden
WWW-Authenticate: Bearer realm="api", error="insufficient_scope", scope="firewall:write"`,
    options: [
      'The token must be base64-encoded',
      'A new token must be requested with exactly the same permissions',
      'The client needs a token whose grant includes the firewall:write scope',
      'The Content-Type must be changed to application/xml',
    ],
    answer: [2],
    explanation: 'RFC 6750 defines `insufficient_scope` as a token that is valid but lacks the privileges needed, answered with 403, and allows the `scope` attribute that names the missing permission. The token was accepted as authentic; it simply is not authorised for this write. Encoding the token or getting another one with the same permissions changes nothing, and the error is not about the body format (that would be 415).' },

  // ---------- 2.8 API styles ----------
  { topic: '2.8', type: 'single', difficulty: 2, lesson: L28,
    stem: 'Refer to the exhibit. Every operation of this API is sent as a POST to the same URL. Which API style is it?',
    exhibit: `POST /ins HTTP/1.1
Host: sw01.example.com
Content-Type: application/json-rpc

[{"jsonrpc": "2.0", "method": "cli", "params": {"cmd": "show version", "version": 1}, "id": 1}]`,
    options: [
      'REST, because it uses HTTP',
      'Asynchronous, because the body has an id',
      'RPC, because the operation to run and its parameters are named in the message body rather than expressed as a resource URL and HTTP method',
      'SOAP, because it uses POST',
    ],
    answer: [2],
    explanation: 'This is JSON-RPC 2.0 (the format NX-API offers): the body names a `method` with `params`, and the `id` pairs the reply with the request. The verb lives in the message, not in the HTTP method, which is the defining feature of RPC. Using HTTP does not make an API RESTful. The `id` is a request correlator, not a task id for later collection. SOAP uses XML envelopes, not a JSON body.' },
  { topic: '2.8', type: 'order', difficulty: 2, lesson: L28,
    stem: 'A script starts a long job on Catalyst Center\'s asynchronous API. Put the steps in order.',
    items: [
      'POST the request to start the job',
      'Receive 202 Accepted with a taskId and a task url',
      'GET the task url',
      'The task has no endTime yet, so wait and GET it again',
      'The task shows an endTime',
      'Check isError (and failureReason if it is true) before treating the job as done',
    ],
    explanation: 'Catalyst Center\'s asynchronous operations answer at once with `202 Accepted` and a body containing `taskId` and `url`. The client polls that task URL; the documentation says the presence of `endTime` means the task completed, and `isError` says whether it succeeded, with `failureReason` explaining a failure. The 202 alone does not mean success.' },
  { topic: '2.8', type: 'match', difficulty: 2, lesson: L28,
    stem: 'Match each description from API documentation to the API style it shows. Each description is about one property only.',
    pairs: [
      ['Each object has its own URL, such as /devices/{id}, and the standard HTTP methods read, replace, modify and delete it', 'REST'],
      ['Every call is a POST to a single endpoint, and the body names the operation to run and its arguments', 'RPC'],
      ['A long job returns 202 Accepted at once with a task id that the client checks later', 'Asynchronous'],
      ['A short read returns its data in the body of the response to the same request', 'Synchronous'],
    ],
    explanation: 'Resources identified by URLs and handled with uniform methods are REST. Named operations sent to one endpoint are RPC. Returning an acknowledgement and a task to check later is asynchronous; returning the result in the same response is synchronous. REST vs RPC and synchronous vs asynchronous are independent choices: a REST API can have asynchronous endpoints, as Catalyst Center does.' },
  { topic: '2.8', type: 'single', difficulty: 2, lesson: L28,
    stem: 'An engineer sends <rpc message-id="101"><get-config><source><running/></source></get-config></rpc> to a router over SSH port 830. Which statement describes this API?',
    options: [
      'It is RPC: NETCONF (RFC 6241) sends named operations in XML <rpc> messages and matches each <rpc-reply> by message-id',
      'It is REST, because it reads a resource',
      'It is a webhook, because the router replies on its own',
      'It is gRPC, because it uses port 830',
    ],
    answer: [0],
    explanation: 'NETCONF is an RPC protocol: operations such as `<get-config>`, `<edit-config>` and `<commit>` are procedures carried in `<rpc>` elements over SSH (port 830, RFC 6242), and the device answers with `<rpc-reply>` carrying the same `message-id`. Its REST-style counterpart is RESTCONF, which uses HTTP methods on resource URLs. The reply is solicited by the request, not a webhook. gRPC uses Protocol Buffers over HTTP/2, not XML over SSH.' },

  // ---------- 2.9 Python requests ----------
  { topic: '2.9', type: 'fill', difficulty: 1, lesson: L29,
    stem: 'Refer to the exhibit. The documentation says "PATCH /networks/{networkId}/vlans/{vlanId}: modify the fields supplied in the JSON body". Enter the requests function that belongs in the blank.',
    exhibit: `import requests

url = f"{BASE_URL}/networks/N_1001/vlans/30"
r = requests.______(url, headers=HEADERS, json={"name": "voip"}, timeout=10)
r.raise_for_status()`,
    answer: ['patch', 'requests.patch'],
    explanation: 'requests has one function per method, so the documented PATCH is `requests.patch()`. `put` would send a full replacement (and the documentation asks for PATCH), and `post` would be the method for creating in a collection.' },
  { topic: '2.9', type: 'single', difficulty: 2, lesson: L29,
    stem: 'Refer to the exhibit. The JSON-only API answers 415 Unsupported Media Type. Which change fixes the script?',
    exhibit: `payload = {"hostname": "sw01", "site": "HQ"}
r = requests.post(f"{BASE_URL}/devices", headers=HEADERS, data=payload, timeout=10)
print(r.status_code, r.request.headers["Content-Type"])

415 application/x-www-form-urlencoded`,
    options: [
      'Replace data=payload with json=payload',
      'Replace data=payload with params=payload',
      'Add verify=False',
      'Replace requests.post with requests.put',
    ],
    answer: [0],
    explanation: 'With `data=`, a dict is form-encoded (`hostname=sw01&site=HQ`) and labelled `application/x-www-form-urlencoded`, as the printed header shows. `json=` serialises the dict to JSON **and** sets `Content-Type: application/json`. `params=` would move the values into the query string and send no body. `verify=False` only disables certificate checks, and PUT changes the meaning of the request without fixing the media type.' },
  { topic: '2.9', type: 'single', difficulty: 2, lesson: L29,
    stem: 'Refer to the exhibit. When the API server stops responding mid-request, this nightly script never finishes and never logs an error. What is the best fix?',
    exhibit: `with requests.Session() as s:
    s.headers.update(HEADERS)
    for net in networks:
        r = s.get(f"{BASE_URL}/networks/{net}/devices")
        r.raise_for_status()
        save(net, r.json())`,
    options: [
      'Call r.raise_for_status() before s.get()',
      'Use requests.get instead of a Session, because Sessions never time out',
      'Pass a timeout on each call, such as s.get(url, timeout=(5, 30)), and handle requests.exceptions.Timeout',
      'Add verify=False so the TLS handshake is faster',
    ],
    answer: [2],
    explanation: 'The requests documentation says that if no timeout is specified explicitly, requests do not time out, and that nearly all production code should set one. With `timeout=(5, 30)` a stalled server raises `Timeout` (`ConnectTimeout` or `ReadTimeout`), which the script can log and handle. `raise_for_status()` needs a response, so it cannot be called first. Plain `requests.get` has the same missing default, and Session has no session-wide timeout setting. `verify=False` removes certificate checking and has nothing to do with a hung server.' },
  { topic: '2.9', type: 'multi', difficulty: 2, lesson: L29,
    stem: 'Refer to the exhibit. Which two statements about this code are true? (Choose two.)',
    exhibit: `r = requests.get(f"{BASE_URL}/devices/99", headers=HEADERS, timeout=10)
print(r.status_code, r.ok)
r.raise_for_status()
print("done")

Output:
404 False
Traceback (most recent call last):
  ...
requests.exceptions.HTTPError: 404 Client Error: Not Found for url: https://api.example.com/api/v1/devices/99`,
    options: [
      'requests.get() itself raised the HTTPError as soon as the 404 arrived',
      'r.ok is False because the status code is 400 or higher',
      'raise_for_status() raised HTTPError because the response was a 4xx',
      '"done" was printed before the traceback',
      'The exception would also be raised for a 302 response',
    ],
    answer: [1, 2],
    explanation: '`requests.get()` returned a normal Response (the first print ran), so it did not raise. `r.ok` is True only for status codes below 400; for 404 it is False. `raise_for_status()` raises `HTTPError` for 4xx and 5xx responses, with the message shown, so `print("done")` never ran. A 302 is below 400, so `raise_for_status()` would not raise for it (and requests normally follows the redirect anyway).' },
  { topic: '2.9', type: 'fill', difficulty: 2, lesson: L29,
    stem: 'Refer to the exhibit. The API paginates with RFC 8288 Link headers. Enter the Response attribute that belongs in the blank so that the loop follows the next page.',
    exhibit: `items = []
url = f"{BASE_URL}/organizations/123456/devices?perPage=100"
while url:
    resp = session.get(url, timeout=(5, 30))
    resp.raise_for_status()
    items.extend(resp.json())
    url = resp.______.get("next", {}).get("url")`,
    answer: ['links', 'resp.links'],
    explanation: '`Response.links` is the parsed `Link` header: a dict keyed by `rel`, where `resp.links["next"]["url"]` is the next page. When the last page has no `next` link, `.get("next", {})` returns an empty dict, `.get("url")` returns None and the loop ends. `resp.headers["Link"]` would give the raw string, which would need parsing.' },
  { topic: '2.9', type: 'single', difficulty: 2, lesson: L29,
    stem: 'A lab Catalyst Center appliance uses a certificate signed by the company\'s private CA, and requests fails with "certificate verify failed". Which approach keeps the connection secure?',
    options: [
      'Pass verify=False on every call',
      'Set timeout=None so the handshake has longer to complete',
      'Change the URL from https:// to http://',
      'Pass verify="/path/to/company-ca.pem" so that requests trusts the private CA',
    ],
    answer: [3],
    explanation: '`verify` accepts a path to a CA bundle, so requests can validate the appliance\'s certificate against the private CA. The requests documentation warns that `verify=False` accepts any certificate, including the wrong host name or an expired one, leaving the script open to man-in-the-middle attacks. Plain HTTP sends the credentials and token unencrypted. A timeout does not affect certificate validation.' },
  { topic: '2.9', type: 'single', difficulty: 2, lesson: L29,
    stem: 'Refer to the exhibit. Which statement about the script is true?',
    exhibit: `import os
import requests

with requests.Session() as s:
    s.headers.update({"X-Auth-Token": os.environ["CC_TOKEN"],
                      "Accept": "application/json"})
    devices = s.get(f"{BASE}/dna/intent/api/v1/network-device", timeout=30).json()
    sites = s.get(f"{BASE}/dna/intent/api/v1/site", timeout=30).json()`,
    options: [
      'Only the first request carries the X-Auth-Token header',
      'Both requests carry the session headers, and the session can reuse the same TCP/TLS connection to the host',
      'The token is printed to the terminal by os.environ',
      'The with block makes both requests run in parallel',
    ],
    answer: [1],
    explanation: 'Headers set on a Session are merged into every request it sends, and the Session pools connections, so the second call can reuse the first one\'s connection. `os.environ["CC_TOKEN"]` only reads the variable (and raises KeyError if it is missing). The `with` block closes the session at the end; the requests still run one after the other.' },
];

export default bank.map((item, i) => ({ id: `d2-${String(i + 1).padStart(3, '0')}`, ...item }));
