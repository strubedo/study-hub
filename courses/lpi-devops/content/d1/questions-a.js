// Domain 1 questions for topics 1.1 and 1.2 (ids assigned in questions.js).
const q = (topic, lesson, type, difficulty, stem, rest) => ({ topic, type, difficulty, stem, ...rest, lesson });
const SA = '1.1-service-architecture';
const AP = '1.1-apis-data-cloudnative';
const AG = '1.1-agile-devops-tdd';
const PL = '1.2-platform-components';

export default [
  // ---------------- 1.1 ----------------
  q('1.1', SA, 'single', 1, 'Which description best fits a microservices architecture?', {
    options: ['Small services that are deployed independently, each owning one business capability and its own data', 'One deployable unit that contains all business logic and shares a single database', 'A central enterprise service bus through which every function is exposed as a coarse SOAP service', 'A set of virtual machines that are patched in place by the operations team'], answer: [0],
    explanation: 'Microservices are small, independently deployable services that own a capability and its data.\n\n* A single deployable unit with one database is a monolith.\n* A central ESB with coarse services describes classic SOA.\n* Patching machines in place is the opposite of immutable infrastructure and is unrelated to service decomposition.' }),
  q('1.1', SA, 'single', 2, 'A critical library vulnerability is fixed in a new base image. In an immutable-server approach, what should the team do?', {
    options: ['Build a new image or server definition with the fix, deploy it and discard the old instances', 'SSH to each running instance and upgrade the package in place', 'Add an exception to the load balancer so the old instances keep serving traffic', 'Restart the old instances so they pick up the fix automatically'], answer: [0],
    explanation: 'Immutable servers are never modified after deployment; changes are made by building a new artifact and replacing instances.\n\n* In-place patching creates configuration drift and is what immutability avoids.\n* A load balancer exception does not fix anything.\n* A restart reloads the same image, so the vulnerability remains.' }),
  q('1.1', SA, 'single', 2, 'What does loose coupling between two services mean?', {
    options: ['Each service depends only on the other service\'s published interface, not on its internals or database', 'The services always run on the same host so that calls are fast', 'The services share one database schema to avoid duplicating data', 'The services must be written in the same programming language'], answer: [0],
    explanation: 'Loose coupling means interaction through a stable contract (API or messages), so either side can change internally or be redeployed independently.\n\n* Sharing a host, a schema or a language all increase coupling.' }),
  q('1.1', SA, 'single', 2, 'In a service-based application, an order is written by the order service and a payment is written by the payment service, each in its own database. What is the usual consequence for consistency?', {
    options: ['There is no single transaction across both; designs use sagas with compensating actions and accept eventual consistency', 'A single ACID transaction automatically spans both databases', 'The services must be merged, because distributed consistency is impossible', 'Consistency is guaranteed by the load balancer'], answer: [0],
    explanation: 'Without a shared database there is no local ACID transaction across services. Sagas (local transactions plus compensations) and eventual consistency are the standard approach.\n\n* No automatic cross-database transaction exists.\n* Merging is not required.\n* A load balancer only distributes requests.' }),
  q('1.1', SA, 'single', 2, 'Which approach to replacing a legacy monolith routes selected functions to new services through a proxy while the monolith keeps running and shrinks over time?', {
    options: ['Strangler fig pattern', 'Big-bang rewrite', 'Blue-green deployment', 'Canary release'], answer: [0],
    explanation: 'The strangler fig pattern migrates incrementally behind a facade.\n\n* A big-bang rewrite replaces everything at once and is the high-risk option.\n* Blue-green and canary are deployment strategies for releases, not migration patterns.' }),
  q('1.1', SA, 'multi', 2, 'Which two are typical risks when integrating or migrating a monolithic legacy application to services? (Choose two.)', {
    options: ['Many modules write the same database tables, so the data cannot be split cleanly', 'In-process calls become network calls, adding latency and new failure modes', 'The application can no longer be stored in version control', 'Containers cannot run applications written before 2010', 'Loose coupling is forbidden by the HTTP protocol'], answer: [0, 1],
    explanation: 'A shared, entangled database and added network latency/failures are the classic migration risks.\n\n* Version control is unaffected.\n* Age of the application does not prevent containerisation (lift and shift).\n* HTTP does not forbid loose coupling.' }),
  q('1.1', SA, 'single', 1, 'Compared with SOA, microservices typically emphasise which of the following?', {
    options: ['Small, independently deployable services with their own data and lightweight communication', 'A central enterprise service bus that contains the business logic', 'A single shared database for all services', 'Longer release cycles that coordinate all services together'], answer: [0],
    explanation: 'Microservices favour small, independent services and lightweight protocols; SOA often relies on coarse reusable services and shared middleware such as an ESB.\n\n* A shared database and coordinated releases contradict independent deployability.' }),
  q('1.1', AP, 'single', 1, 'Refer to the exhibit. What does the status code tell the client?', {
    exhibit: `POST /v1/orders HTTP/1.1
Host: api.example.com
Content-Type: application/json

{"sku": "WS-100", "quantity": 2}

HTTP/1.1 201 Created
Location: /v1/orders/1042`,
    options: ['A new order resource was created and its URL is in the Location header', 'The request was accepted but nothing was stored yet', 'The client is not authorised to create orders', 'The order already existed and nothing changed'], answer: [0],
    explanation: '201 Created means the resource was created; Location gives its URL.\n\n* Accepted-but-not-processed is 202.\n* Not authorised is 401 or 403.\n* An existing resource would typically produce 200, 204 or 409.' }),
  q('1.1', AP, 'single', 2, 'Refer to the exhibit. A client sends this body with Content-Type: application/json and receives 400 Bad Request. What is the reason?', {
    exhibit: `{
  'sku': 'WS-100',
  "quantity": 2,
}`,
    options: ['The body is not valid JSON: strings need double quotes and trailing commas are not allowed', 'JSON bodies cannot be sent with POST', 'The quantity must be sent as a string', 'JSON objects must be enclosed in square brackets'], answer: [0],
    explanation: 'JSON allows only double-quoted strings and no trailing comma, so the parser rejects this body.\n\n* POST bodies can be JSON.\n* Numbers are valid JSON values.\n* Square brackets denote arrays, not objects.' }),
  q('1.1', AP, 'fill', 1, 'Which HTTP method is conventionally used to replace a resource completely and is idempotent? (Type the method.)', {
    answer: ['PUT', 'put'],
    explanation: 'PUT replaces the target resource with the supplied representation, and repeating it leaves the same state. PATCH is for partial updates; POST is not idempotent.' }),
  q('1.1', AP, 'single', 2, 'Why is statelessness an important REST constraint for scaling?', {
    options: ['Any instance can serve any request because each request carries all the information needed', 'It forces every client to use the same server for the whole session', 'It means the service has no database', 'It prevents the use of HTTP caching'], answer: [0],
    explanation: 'Stateless requests allow any instance behind a load balancer to handle them, so you can add or remove instances freely.\n\n* Pinning clients to a server is the sticky-session model.\n* Stateless refers to server-held session state, not to having no database.\n* Statelessness does not prevent caching.' }),
  q('1.1', AP, 'single', 2, 'A web application stores sessions in the memory of each instance and the load balancer uses sticky sessions. What is the main problem?', {
    options: ['If an instance fails or is replaced its sessions are lost, and load is distributed unevenly', 'HTTP does not allow session cookies', 'The sessions can only be read by the database', 'It makes horizontal scaling impossible in every case'], answer: [0],
    explanation: 'Sticky sessions with in-memory state couple a user to one instance; losing it loses the session. A signed token or shared session store (for example Redis) avoids this.\n\n* Cookies are allowed.\n* The database is not involved.\n* Scaling is possible but impaired, not impossible.' }),
  q('1.1', AP, 'multi', 2, 'Which three design rules suit software that will run in containers? (Choose three.)', {
    options: ['Write logs to stdout and stderr', 'Read configuration from environment variables or mounted files', 'Shut down gracefully on SIGTERM', 'Store persistent data on the container\'s writable layer', 'Bake production passwords into the image', 'Run an SSH daemon in every container for administration'], answer: [0, 1, 2],
    explanation: 'Logging to streams, external configuration and graceful SIGTERM handling are core cloud native container practices.\n\n* The writable layer is lost with the container; use volumes or external services.\n* Baked-in passwords leak through the image.\n* An SSH daemon contradicts immutable, single-process containers.' }),
  q('1.1', AP, 'fill', 2, 'Which signal do container platforms send to the main process first to ask it to stop gracefully? (Type the signal name.)', {
    answer: ['SIGTERM', 'TERM'],
    explanation: 'Docker and Kubernetes send SIGTERM first and follow with SIGKILL after a grace period.' }),
  q('1.1', AP, 'single', 3, 'Refer to the exhibit. Several versions of the service run at the same time during a rolling deployment. Which step is the safest way to rename the column fullname to display_name?', {
    exhibit: `-- release N
ALTER TABLE customer ADD COLUMN display_name text;
-- release N+1 : application writes both columns, reads display_name
-- release N+2 : drop the old column
ALTER TABLE customer DROP COLUMN fullname;`,
    options: ['Follow the expand/contract sequence shown, so old and new code both work against the schema at every step', 'Run a single ALTER TABLE ... RENAME COLUMN during the deployment', 'Stop all instances, rename the column and start them again', 'Keep the old column forever, because migrations may never delete columns'], answer: [0],
    explanation: 'Expand/contract keeps the schema compatible with both application versions during the rollout; the destructive step comes only after nothing uses the old column.\n\n* A single rename breaks instances that still run the old code.\n* A full stop causes downtime and is unnecessary.\n* Columns may be dropped once no version uses them.' }),
  q('1.1', AG, 'order', 1, 'Put the steps of test-driven development in order.', {
    items: ['Write a failing test', 'Run the test and see it fail', 'Write the simplest code that passes', 'Refactor while keeping tests green'],
    explanation: 'Red (failing test), green (minimal code to pass), refactor. Seeing the test fail first proves it can detect the missing behaviour.' }),
  q('1.1', AG, 'single', 1, 'Which statement describes DevOps best?', {
    options: ['A culture and set of practices in which development and operations share responsibility and use automation to deliver and run software', 'A job title for the person who administers the build server', 'A single tool that replaces version control and monitoring', 'A methodology of two-week sprints with a product backlog'], answer: [0],
    explanation: 'DevOps is cultural and practice-based: shared ownership, automation, fast feedback.\n\n* It is not a job title or a tool.\n* Sprints and backlogs describe Scrum, an agile framework.' }),
  q('1.1', AG, 'multi', 2, 'Which two are practices commonly associated with DevOps? (Choose two.)', {
    options: ['Infrastructure defined as code in version control', 'Automated build, test and deployment pipelines', 'Quarterly manual releases handed from developers to operations', 'Operations staff being the only people who may view production metrics', 'Fixing production servers by hand without recording changes'], answer: [0, 1],
    explanation: 'Infrastructure as code and automated pipelines are core DevOps practices.\n\n* Manual hand-offs, restricted metrics and undocumented manual fixes are what DevOps tries to remove.' }),
  q('1.1', AG, 'single', 2, 'In the test pyramid, which kind of test should there be the most of?', {
    options: ['Unit tests', 'End-to-end acceptance tests', 'Manual exploratory tests', 'Load tests'], answer: [0],
    explanation: 'Unit tests are fast, cheap and isolated, so the pyramid has many of them; fewer integration tests; fewest end-to-end tests.\n\n* The others are slower and more expensive, so fewer of them are kept.' }),
  q('1.1', AG, 'match', 2, 'Match each term with its meaning.', {
    pairs: [['Scrum', 'Agile framework with fixed-length sprints and a backlog'], ['Kanban', 'Visual board that limits work in progress'], ['Immutable server', 'Instance replaced instead of modified'], ['Red-green-refactor', 'The test-driven development cycle']],
    explanation: 'Scrum uses sprints; Kanban limits WIP on a board; immutable servers are replaced; red-green-refactor is the TDD loop.' }),
  q('1.1', AP, 'single', 2, 'Refer to the exhibit. What does the 401 response mean?', {
    exhibit: `GET /v1/orders/1042 HTTP/1.1
Host: api.example.com

HTTP/1.1 401 Unauthorized
WWW-Authenticate: Bearer realm="example"`,
    options: ['The request lacked valid credentials; the client should authenticate and retry', 'The credentials are valid but the user may not read this order', 'The order does not exist', 'The server failed with an internal error'], answer: [0],
    explanation: '401 means authentication is missing or invalid; WWW-Authenticate tells the client which scheme to use.\n\n* Authenticated but not permitted is 403.\n* A missing resource is 404.\n* An internal error is 500.' }),
  q('1.1', AP, 'fill', 2, 'According to twelve-factor cloud native practice, where should an application send its log events? (One word or short phrase.)', {
    answer: ['stdout', 'standard output', 'stdout/stderr', 'stdout and stderr', 'stderr'],
    explanation: 'Applications write logs as an event stream to stdout/stderr and the platform collects them, instead of managing log files.' }),

  // ---------------- 1.2 ----------------
  q('1.2', PL, 'single', 1, 'A development team uploads only application code and the platform handles the operating system, runtime, patching and scaling. Which service model is this?', {
    options: ['PaaS', 'IaaS', 'SaaS', 'Bare-metal hosting'], answer: [0],
    explanation: 'In PaaS the provider runs the OS and runtime; you manage the application and its data.\n\n* IaaS leaves the OS to you.\n* SaaS delivers a finished application.\n* Bare-metal hosting gives you hardware only.' }),
  q('1.2', PL, 'single', 2, 'Which is a characteristic of FaaS?', {
    options: ['Short, event-triggered, stateless functions billed per execution, with scaling handled by the provider', 'Long-running virtual machines with persistent local disks', 'A finished hosted application accessed through a browser', 'Servers you must patch and scale yourself'], answer: [0],
    explanation: 'FaaS (serverless functions) runs code on events and bills per invocation; state must be external.\n\n* Long-running VMs are IaaS.\n* A hosted application is SaaS.\n* Patching and scaling yourself describes IaaS.' }),
  q('1.2', PL, 'single', 2, 'Which statement about object storage is correct?', {
    options: ['Objects are addressed by key in a bucket over an HTTP API, and changing an object means replacing it', 'Objects can be edited in place by seeking to a byte offset', 'It provides a POSIX filesystem with directories as real structures', 'It supports SQL joins across objects'], answer: [0],
    explanation: 'Object stores such as S3 use buckets and keys over HTTP; "folders" are only key prefixes and objects are replaced whole.\n\n* In-place byte edits and POSIX semantics belong to block and file storage.\n* SQL joins belong to databases.' }),
  q('1.2', PL, 'match', 2, 'Match each product with its category.', {
    pairs: [['PostgreSQL', 'Relational database'], ['Redis', 'In-memory key-value store'], ['MongoDB', 'Document database'], ['InfluxDB', 'Time series database'], ['Elasticsearch', 'Search and analytics engine']],
    explanation: 'PostgreSQL is relational, Redis is key-value, MongoDB stores documents, InfluxDB is a time series database and Elasticsearch is a search/analytics engine.' }),
  q('1.2', PL, 'single', 2, 'Each message published to a work queue must be processed by exactly one of several worker processes. Which messaging model fits?', {
    options: ['A queue (point to point) with competing consumers', 'Publish/subscribe where every subscriber receives every message', 'A CDN edge cache', 'An object storage bucket with versioning'], answer: [0],
    explanation: 'A queue delivers each message to one consumer, distributing work.\n\n* Pub/sub delivers a copy to every subscriber.\n* A CDN and object storage are not messaging systems.' }),
  q('1.2', PL, 'single', 2, 'What distinguishes Apache Kafka from a classic message queue?', {
    options: ['It stores messages in a durable, partitioned log that consumers can re-read by offset', 'It deletes each message the moment any consumer reads it', 'It is a relational database with SQL transactions', 'It is a lightweight protocol intended for constrained IoT devices'], answer: [0],
    explanation: 'Kafka is a distributed log; consumers track offsets and can replay.\n\n* Deleting on read is classic queue behaviour.\n* It is not an RDBMS.\n* The lightweight IoT protocol is MQTT.' }),
  q('1.2', PL, 'fill', 1, 'Which lightweight publish/subscribe protocol is widely used for IoT devices? (Type the acronym.)', {
    answer: ['MQTT', 'mqtt'],
    explanation: 'MQTT is a small publish/subscribe protocol with QoS levels 0, 1 and 2, with brokers such as Mosquitto.' }),
  q('1.2', PL, 'single', 2, 'The file app.3f2a1c.js is served by a CDN with a long TTL. Why is the hash in the file name?', {
    options: ['A new build gets a new name, so edge caches never serve stale content and no purge is needed', 'The CDN refuses files without a hash', 'It encrypts the file contents', 'It allows the origin server to be switched off'], answer: [0],
    explanation: 'Versioned file names allow aggressive caching: an updated file has a different URL.\n\n* CDNs accept any name.\n* A hash in a name is not encryption.\n* The origin is still needed for cache misses.' }),
  q('1.2', PL, 'single', 2, 'Refer to the exhibit. What is wrong with this IAM policy for an application that only reads reports from one bucket?', {
    exhibit: `{
  "Effect": "Allow",
  "Action": "s3:*",
  "Resource": "*"
}`,
    options: ['It violates least privilege: it allows every S3 action on every resource', 'The Effect must be Deny to be valid', 'Policies may not contain wildcards of any kind', 'It grants no access at all'], answer: [0],
    explanation: 'Least privilege means granting only the needed actions (for example s3:GetObject) on only the needed resource (that bucket or prefix).\n\n* Allow is a valid effect.\n* Wildcards are valid syntax, which is why this is dangerous.\n* It grants broad access, not none.' }),
  q('1.2', PL, 'multi', 2, 'Which two are benefits of placing a message broker between a producer and a consumer? (Choose two.)', {
    options: ['The producer and consumer are decoupled in time, so the consumer can be offline briefly', 'The broker buffers bursts so consumers can process at their own pace', 'The producer receives the consumer\'s result as the return value of its call', 'It guarantees that no message can ever be delivered twice', 'It removes the need for any network'], answer: [0, 1],
    explanation: 'Asynchronous decoupling and buffering are the main benefits.\n\n* A synchronous return value is request/response, not messaging.\n* At-least-once delivery means duplicates can occur; consumers should be idempotent.\n* A broker is itself reached over the network.' }),
  q('1.2', PL, 'single', 2, 'What is OpenSearch?', {
    options: ['An Apache 2.0-licensed fork of Elasticsearch used for search and log analytics', 'A document database from the MongoDB family', 'A message broker based on MQTT', 'A content delivery network'], answer: [0],
    explanation: 'OpenSearch was forked from Elasticsearch and is licensed under Apache 2.0.\n\n* It is not a MongoDB product, a broker or a CDN.' }),
  q('1.2', PL, 'single', 2, 'Which is the best practice for giving a workload running in the cloud access to an object storage bucket?', {
    options: ['Attach a role so the workload receives short-lived credentials', 'Embed a long-lived access key in the container image', 'Make the bucket public', 'Share the root account password with the developers'], answer: [0],
    explanation: 'Roles with temporary credentials follow least privilege and avoid leaked long-lived keys.\n\n* Keys in images leak with the image.\n* A public bucket exposes the data to everyone.\n* Sharing root credentials is the worst option.' }),
];
