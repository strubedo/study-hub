// Course registry for the hub (/index.html) and scripts/validate-content.mjs.
//
// Ready courses list only `id`, `status` and `path`: name, vendor, exams and store
// prefix come from the course's own course.js, so there is one source of truth.
// Coming-soon courses carry their card text here until their directory exists.
// `exams` holds exam codes; an empty list means a course with no exam (shown as "Course").
// To launch a course: build courses/<id>/ (see README.md), then change its entry
// to { id, status: 'ready', path: '<id>/' }.

export default [
  { id: 'ccna', status: 'ready', path: 'ccna/' },
  { id: 'winserver', status: 'ready', path: 'winserver/' },
  // Fortinet Secure Networking path, in build order: NSE 4 → NSE 5/6 options → NSE 7.
  { id: 'fortinet-nse4', status: 'ready', path: 'fortinet-nse4/' },
  { id: 'fortinet-nse6-fmg', status: 'ready', path: 'fortinet-nse6-fmg/' },
  { id: 'fortinet-nse5-sdwan', status: 'ready', path: 'fortinet-nse5-sdwan/' },
  { id: 'fortinet-nse7', status: 'ready', path: 'fortinet-nse7/' },
  { id: 'fortinet-nse5-fsw', status: 'ready', path: 'fortinet-nse5-fsw/' },
  { id: 'fortinet-nse5-wlan', status: 'ready', path: 'fortinet-nse5-wlan/' },
  { id: 'fortinet-nse6-nac', status: 'ready', path: 'fortinet-nse6-nac/' },
  { id: 'paloalto-ngfw', status: 'ready', path: 'paloalto-ngfw/' },
  { id: 'lpi-devops', status: 'ready', path: 'lpi-devops/' },
  { id: 'tcpip-ipv4', status: 'ready', path: 'tcpip-ipv4/' },
  { id: 'winserver-essentials', status: 'ready', path: 'winserver-essentials/' },
  { id: 'ai-prompting', status: 'ready', path: 'ai-prompting/' },
  { id: 'az-900', status: 'ready', path: 'az-900/' },
];
