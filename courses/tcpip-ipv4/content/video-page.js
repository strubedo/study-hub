// Copy and links for the Video Course page (course.js `videos.page`).
export default {
  intro: 'A curated set of free videos, each tagged with the course topics it supports. Check numbers and commands against the lessons.',
  playlist: null,
  legacy: { label: 'Older', title: 'Older recording; the concepts hold but some tool output or screens look different today' },
  gaps: {
    title: 'Coverage gaps',
    intro: 'Free videos are thin on some topics, so lean on the lessons and questions here:',
    note: 'Free videos cover DHCP relay and option 82, T1/T2 timers, DNS negative caching and TCP fallback, reverse lookups, ICMP type and code numbers, the special-purpose address blocks (shared 100.64.0.0/10, link-local, multicast), Linux ip/ss and Windows netstat/route output, tcpdump expressions and CGNAT effects only thinly or not at all, so rely on the lessons and questions for those.',
  },
  resources: [
    { name: 'RFC 791: Internet Protocol', url: 'https://www.rfc-editor.org/rfc/rfc791', note: 'The IPv4 specification.' },
    { name: 'RFC 9293: Transmission Control Protocol', url: 'https://www.rfc-editor.org/rfc/rfc9293', note: 'The current consolidated TCP specification.' },
    { name: 'IANA IPv4 Special-Purpose Address Registry', url: 'https://www.iana.org/assignments/iana-ipv4-special-registry/', note: 'Authoritative list of reserved blocks.' },
    { name: 'IANA Service Name and Port Number Registry', url: 'https://www.iana.org/assignments/service-names-port-numbers/', note: 'Official port assignments.' },
    { name: 'Wireshark User\'s Guide', url: 'https://www.wireshark.org/docs/wsug_html_chunked/', note: 'Capture and display filters.' },
  ],
};
