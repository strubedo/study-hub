// Copy and links for the Video Course page (course.js `videos.page`).
export default {
  intro: 'A curated set of free videos, each tagged with the ENCOR topics it supports. Many were recorded for ENCOR v1.0 or v1.1: the routing and switching content still applies, but wireless is no longer on the exam and some product names have changed (DNA Center is now Catalyst Center).',
  playlist: null,
  legacy: { label: 'Older', title: 'Recorded with older product names (DNA Center, vManage) or older ENCOR topic numbering; concepts still apply' },
  gaps: {
    title: 'Coverage gaps',
    intro: 'Free videos are thin on some topics, so lean on the lessons and questions here:',
    note: 'No good free video was found for these topics: 3.3.a PTP (only generic IEEE 1588 overviews, nothing on IOS XE configuration), 4.2 Flexible NetFlow (only small-channel walkthroughs), 5.2.b CoPP, 5.4.b endpoint security (vendor marketing only) and the MACsec half of 5.4.d. Coverage is also partial for 1.1.a (enterprise design tiers, fabric and cloud), 6.4 (the only API walkthroughs predate the renaming, so they say DNA Center and vManage), 6.5 (general HTTP status codes, nothing on Catalyst Center task objects or RESTCONF error bodies) and the EEM data-collection and troubleshooting examples in 6.6. Several videos were recorded for CCNA 200-301 or for ENCOR v1.0 / v1.1: the protocol content still applies, but wireless is no longer on the exam and topic numbers in some titles have changed (SPAN is 4.3 in v1.2). Where a video and a lesson disagree, trust the lesson.',
  },
  resources: [
    { name: 'Cisco exam page: 350-401 ENCOR', url: 'https://www.cisco.com/site/us/en/learn/training-certifications/exams/encor.html', note: 'Exam facts and registration.' },
    { name: 'Official exam topics', url: 'https://learningnetwork.cisco.com/s/encor-exam-topics', note: 'The v1.2 topic list this course follows.' },
    { name: 'Cisco DevNet', url: 'https://developer.cisco.com/', note: 'Sandbox labs and API documentation for Catalyst Center, SD-WAN and IOS XE.' },
    { name: 'RFC Editor', url: 'https://www.rfc-editor.org/', note: 'The standards behind OSPF, BGP, VRRP, VXLAN, LISP, NETCONF and RESTCONF.' },
  ],
};
