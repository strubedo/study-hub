// Exam guide page content (course.js `guide`), rendered by engine/views/guide.js.
// Sources (checked 2026-10-29): NSE 7 Secure Networking 7.6 Architect exam page
// (training.fortinet.com/local/staticpage/view.php?page=secure_networking_architect_exam), the NSE 7 Secure
// Networking certification page (page=nse_7_secure_networking), training_policies, purchasing_process (SKU
// mapping) and nse_faq (score report) pages, and helpdesk notices:
// OnVUE delivery (articles/73000672931, modified 13 Oct), exam fees (articles/73000672897, updated 5 Oct 2026),
// release notices (articles/73000659982, modified 2 Oct). Strings are inline markdown.
import { EXAM } from './blueprint.js';

const PATH = [
  ['NSE 4 FortiOS', 'Required first, and must still be **active** when you earn NSE 7.'],
  ['NSE 5 SN or NSE 6 SN', 'Also required and active. NSE 5 Secure Networking: FortiSwitch 7.6, Secure Wireless LAN 7.6 or SD-WAN Core 7.6. NSE 6 Secure Networking: FortiManager 7.6 or FortiNAC-F 7.6 (FortiAnalyzer and FortiVoice exams were still "coming soon" on 2026-10-29).'],
  ['NSE 7 Secure Networking', 'Pass this exam **within 2 years of your last prerequisite exam**. The certification runs 2 years from the NSE 7 exam or the last prerequisite exam, whichever is later.'],
  ['Replaces Enterprise Firewall', 'NSE 7 Secure Networking 7.6 Architect was released on 2026-07-15. Its predecessor, NSE 7 - Enterprise Firewall 7.6 Administrator, had its last delivery date the same day. Much of the old Enterprise Firewall and SD-WAN Enterprise material carries over, but study from this blueprint.'],
];

const POLICIES = [
  ['Scoring', 'Pass or fail. An answer must be **100% correct** to earn credit: no partial credit, no deduction for wrong answers. The score report shows a grade per topic for reference only.'],
  ['Retake after a fail', 'Wait **15 days**. You can\'t retake an exam you passed.'],
  ['Validity', 'Certifications are valid for **2 years**. Earning NSE 7 SN also recertifies your NSE 1–4 and NSE 5/6 SN certifications if they are still active.'],
  ['Delivery', '**Pearson VUE test center only.** Fortinet ended OnVUE online delivery for all NSE 7 exams on 2026-09-21. (The certification page boilerplate still mentions OnVUE; the dated notice is the newer source.)'],
  ['Fees', `${EXAM.price}, USD, tax not included. NSE 7 recertification assessments also go to US$420.`],
  ['Vouchers bought before 2026-11-02', '**Unconfirmed.** Fortinet says candidates can register at the old price until November 2, and NSE 7 exams move from SKU NSE-EX-FTE2 to NSE-EX-FTE4 after that date. It does not say whether a US$200 voucher bought earlier still pays for an NSE 7 exam booked later. Ask the Training Institute help desk before relying on one.'],
];

const STRATEGY = [
  ['Think like the architect', 'Most items are designs or multi-device scenarios: pick the topology, routing design or HA mode that meets the stated requirement, then rule out the options that break a constraint (scale, failover time, route count, licensing).'],
  ['Routing and IPsec are 50–70%', 'Rules and routing and Advanced IPsec are each 25–35%. Know SD-WAN rule selection and the route lookup order, BGP on loopback vs BGP per overlay, dual hub and multiregion designs, and ADVPN 1.0 vs 2.0 cold.'],
  ['Read outputs across devices', 'Expect hub and spoke outputs side by side: `get router info bgp summary`, routing tables, `diagnose sys sdwan` health and service output, `diagnose vpn ike gateway list`, session flags. Check that addresses and interface names agree before you answer.'],
  ['Know what FortiManager generates', 'Central management is 15–25%. Know what the SD-WAN overlay template wizard builds (IPsec, BGP and CLI templates, template groups, `branch_id`) and what it does not (SD-WAN rules: you still need an SD-WAN template).'],
  ['Choose-two means exactly two', 'No partial credit: one wrong choice scores zero. The simulator here grades the same way.'],
  ['Labs need more than the trial', 'FortiGate-VM trials allow 3 interfaces, 3 policies and 3 routes and one VM per FortiCloud account, so a full dual-hub ADVPN lab needs paid labs, licences or hardware. Lab the pieces that fit (one hub, one spoke, one overlay) and study the rest from the deployment guides.'],
];

export default function guide() {
  return {
    eyebrow: 'Exam guide',
    title: 'Everything about the NSE 7 Secure Networking exam',
    intro: 'Format, prerequisites, Fortinet\'s policies, and how to approach an architect-level exam.',
    action: { label: 'Find a Pearson VUE test center', href: 'https://home.pearsonvue.com/fortinet' },
    stats: [
      [`${EXAM.minutes} min`, 'Exam time'],
      [EXAM.questionsApprox, 'Questions'],
      ['Pass / fail', 'No published cut score · no partial credit'],
      ['Test center', 'No online (OnVUE) delivery since 2026-09-21'],
    ],
    rows: [
      [{
        title: 'About this exam',
        accent: true,
        blocks: [{ type: 'text', md: `**${EXAM.name}** covers ${EXAM.product}. It tests designing, administering and supporting secure SD-WAN and an enterprise security infrastructure of multiple FortiGates: operational scenarios, incident analysis, integration with FortiManager, FortiAnalyzer and SD-WAN, and troubleshooting. Multiple choice and drag-and-drop, no labs, English and Japanese. No 8.0 version has been announced (checked 2026-10-29).` }],
      }],
      [{
        title: 'Path and prerequisites',
        blocks: [{ type: 'list', items: PATH }],
      }, {
        title: 'Fortinet exam policies',
        blocks: [{ type: 'list', items: POLICIES }],
        note: 'Policies change. Confirm on Fortinet\'s [training policies page](https://training.fortinet.com/local/staticpage/view.php?page=training_policies) and the [NSE 7 Secure Networking page](https://training.fortinet.com/local/staticpage/view.php?page=nse_7_secure_networking) before booking.',
      }],
      [{
        title: 'Domain weights',
        blocks: [{ type: 'domains', columns: ['NSE 7 Secure Networking 7.6', '%'] }],
      }, {
        title: 'Test-taking strategy',
        blocks: [{ type: 'grid', items: STRATEGY }],
      }],
    ],
  };
}
