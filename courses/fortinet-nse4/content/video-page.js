// Copy and links for the Video Course page (course.js `videos.page`).
import { PLAYLIST_URL } from './videos.js';

export default {
  intro: 'IT LEARNING LABS\' free "FortiGate 7.4 & 7.6 Training LAB" series, each video tagged with the NSE 4 FortiOS 8.0 topics it supports.',
  playlist: { url: PLAYLIST_URL, label: 'Open playlist on YouTube' },
  legacy: { label: 'Not on NSE 4 8.0', title: 'Useful FortiGate background, but not listed in the NSE 4 FortiOS 8.0 exam topics' },
  gaps: {
    title: 'Coverage gaps vs NSE 4 8.0',
    intro: 'This series was recorded mostly on FortiOS 7.4/7.6. These NSE 4 8.0 topics have little or no video coverage, so lean on the lessons and questions here:',
    note: 'Also new in the 8.0 topic list: FortiAI / GenAI on the CLI, tagging and dynamic tagging, DLP for GenAI chatbots, TLS 1.3 and quantum-safe IPsec, SD-WAN by underlay bandwidth. Episode 40 gives an 8.0 overview only.',
  },
  resources: [
    { name: 'Fortinet FortiOS 8.0 Administrator self-paced course', url: 'https://training.fortinet.com/local/staticpage/view.php?page=library_fortios-administrator', note: 'Official course behind the exam: lectures free (FortiCloud login), labs paid. Includes sample questions.' },
    { name: 'IT LEARNING LABS — FortiGate 7.4 & 7.6 Training LAB', url: PLAYLIST_URL, note: 'Free, third-party, about 24 hours. Best single free video match for NSE 4.' },
    { name: 'PM Networking — The Ultimate FortiGate Firewall', url: 'https://www.youtube.com/playlist?list=PLmgyxPj-5jn4ZOTbg97jiWkT0mMZk9OzY', note: 'Free, third-party. Strong on routing and interop with Cisco-style routers.' },
    { name: 'FortiOS 8.0 Administration Guide', url: 'https://docs.fortinet.com/document/fortigate/8.0.2/administration-guide', note: 'The reference the exam is built on.' },
    { name: 'FortiGate-VM permanent trial license', url: 'https://docs.fortinet.com/document/fortigate/8.0.2/administration-guide/441460', note: 'Free lab VM: 1 vCPU / 2 GB, max 3 interfaces, 3 policies and 3 routes, no FortiGuard.' },
    { name: 'Pearson VUE — schedule a Fortinet exam', url: 'https://home.pearsonvue.com/fortinet', note: 'Test center or OnVUE online proctoring.' },
  ],
};
