// Copy and links for the Video Course page (course.js `videos.page`).
export default {
  intro: 'A curated set of free videos from Palo Alto Networks and third-party channels, each tagged with the NGFW Engineer topics it supports. Older videos may show earlier PAN-OS releases, so check menu paths and CLI against the lessons.',
  playlist: null,
  legacy: { label: 'Older PAN-OS', title: 'Recorded on an older PAN-OS release or covers a PCNSE-era topic' },
  gaps: {
    title: 'Coverage gaps',
    intro: 'Free videos are thin on several blueprint topics, so lean on the lessons and questions here:',
    note: 'Little or no current free video exists for: 1.1 virtual wire/Layer 2/AE specifics on PAN-OS 11.2+, 1.2 zone protection beyond a 2016 tutorial, 2.1 administrator roles and authentication sequences (none), 2.3 Strata Logging Service and collector groups, 2.6 on-premises User-ID redistribution, 2.7 the PAN-OS web proxy, 3.1 VM-Series licensing and current bootstrapping plus Cloud NGFW for Azure, 3.2 REST API and API key lifecycle (only a short intro), 3.3 the 2.x Terraform panos provider and Kubernetes/CN-Series on 11.x, 3.4 device group hierarchy and pre/post rule order. Domain 3 videos mostly cover Panorama templates, ACC/reports and Ansible; rely on the lessons for the rest.',
  },
  resources: [
    { name: 'NGFW Engineer certification page', url: 'https://www.paloaltonetworks.com/services/education/palo-alto-networks-ngfw-engineer', note: 'Official page with the datasheet and learning path.' },
    { name: 'NGFW Engineer datasheet (Nov 2025)', url: 'https://www.paloaltonetworks.com/content/dam/pan/en_US/assets/pdf/datasheets/education/ngfw-engineer-datasheet.pdf', note: 'The blueprint this site is built on.' },
    { name: 'Palo Alto Networks Beacon', url: 'https://beacon.paloaltonetworks.com/', note: 'Free digital learning path for the exam.' },
    { name: 'PAN-OS documentation', url: 'https://docs.paloaltonetworks.com/ngfw', note: 'Administration guides, CLI and API references.' },
    { name: 'Pearson VUE — Palo Alto Networks', url: 'https://home.pearsonvue.com/paloaltonetworks', note: 'Schedule the exam.' },
  ],
};
