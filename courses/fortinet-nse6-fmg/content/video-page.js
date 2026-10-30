// Copy and links for the Video Course page (course.js `videos.page`).
import { PLAYLIST_URL } from './videos.js';

export default {
  intro: 'The Net Knight\'s free walkthroughs of the eight FortiManager 7.6 Training Institute labs, each tagged with the NSE 6 topics it supports.',
  playlist: { url: PLAYLIST_URL, label: 'Open playlist on YouTube' },
  legacy: { label: 'Not on NSE 6', title: 'Not listed in the NSE 6 FortiManager 7.6 exam topics' },
  gaps: {
    title: 'Coverage gaps',
    intro: 'Eight lab videos can\'t cover the whole outline. These topics have little or no video coverage, so lean on the lessons and questions here:',
    note: 'Also thin on video: the JSON API (1.1), FortiManager behind NAT (5.1), database integrity checks (5.2) and ADOM upgrade (3.2).',
  },
  resources: [
    { name: 'NSE 6 - FortiManager 7.6 Administrator exam page', url: 'https://training.fortinet.com/local/staticpage/view.php?page=fortimanager_administrator_exam', note: 'Official exam topics this site is built on.' },
    { name: 'The Net Knight — FortiManager Administrator 7.6 Labs', url: PLAYLIST_URL, note: 'Free, third-party walkthroughs of the official labs.' },
    { name: 'FortiManager 7.6 Administration Guide', url: 'https://docs.fortinet.com/product/fortimanager/7.6', note: 'The reference the exam is built on.' },
    { name: 'FortiManager-VM trial license', url: 'https://docs.fortinet.com/document/fortimanager/7.6.0/vm-trial-license-guide/131614/licensing', note: 'Free lab VM: 3 devices/VDOMs, 2 ADOMs, no FortiGuard or FDS features.' },
    { name: 'Pearson VUE — schedule a Fortinet exam', url: 'https://home.pearsonvue.com/fortinet', note: 'Test center or OnVUE online proctoring.' },
  ],
};
