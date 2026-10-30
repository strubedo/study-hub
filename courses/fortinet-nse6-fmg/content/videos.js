// The Net Knight "FortiManager Administrator 7.6 Labs" playlist (YouTube, third-party, free):
// walkthroughs of the eight FortiManager 7.6 Training Institute labs, mapped to NSE 6 topics.
// Listing taken 2026-10-29 (8 videos, about 4.4 h). Lab 8 "Additional Configuration" is mapped to
// HA and FortiGuard from its title; check the video for its exact content.
export const PLAYLIST_URL = 'https://www.youtube.com/playlist?list=PLbbGpxN09JemOsFN6KuosVI8LB_rw7oWN';

const CHANNEL = 'The Net Knight';
const PLAYLIST = 'PLbbGpxN09JemOsFN6KuosVI8LB_rw7oWN';

const RAW = [
  ['MIgoOaTMztA', 2070, 'FortiManager Administrator 7.6 Training Institute Labs | Lab-1 (Initial Configuration)', ['1.2']],
  ['mgdIYrzAqe4', 2197, 'FortiManager Administrator 7.6 Training Institute Labs | Lab-2 (Administration & Management)', ['1.1', '1.3']],
  ['0qie-B5k-Wo', 1845, 'FortiManager Administrator 7.6 Training Institute Labs | Lab-3 (Device Registration)', ['2.1']],
  ['l2U5VQgUbp4', 2248, 'FortiManager Administrator 7.6 Training Institute Labs | Lab-4 (Device Level Config & Installation)', ['2.2', '2.3', '3.4']],
  ['DEnVPQJMqeg', 3365, 'FortiManager Administrator 7.6 Training Institute Labs | Lab-5 (Policies and Objects)', ['3.1', '3.4']],
  ['qJiryJaNbhw', 1194, 'FortiManager Administrator 7.6 Training Institute Labs | Lab-6 (Global ADOM Policy Configuration)', ['4.3']],
  ['Kn0FSTYwTdc', 1967, 'FortiManager Administrator 7.6 Training Institute Labs | Lab-7 (Diagnostics and Troubleshooting)', ['5.2', '5.3', '5.4']],
  ['5iN0djTq5-0', 1001, 'FortiManager Administrator 7.6 Training Institute Labs | Lab-8 (Additional Configuration)', ['4.1', '4.2']],
];

export default RAW.map(([id, seconds, title, topics], i) => ({
  id, title, seconds, kind: 'lecture', topics, legacy: false, order: i + 1, channel: CHANNEL, playlist: PLAYLIST,
}));
