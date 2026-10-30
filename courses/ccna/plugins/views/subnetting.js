// Subnetting trainer: endless drills, a timed sprint, and a calculator with binary view.
import { html, raw, icon, toast } from '../../../../engine/ui.js';
import { PROBLEM_KINDS, generateProblem, checkAnswer, subnetInfo, ipToInt, maskToPrefix, eui64, expandIPv6 } from '../lib/subnet.js';

const KIND_LABEL = {
  network: 'Network address', broadcast: 'Broadcast address', first: 'First host', last: 'Last host', hosts: 'Usable hosts',
  prefixForHosts: 'Prefix for N hosts', wildcard: 'Wildcard mask', mask: 'Prefix → mask', eui64: 'IPv6 EUI-64', compress: 'IPv6 compression',
};
const SPRINT_SECONDS = 300;

function binaryOf(ip, prefix) {
  const bits = ipToInt(ip).toString(2).padStart(32, '0');
  const octets = [0, 8, 16, 24].map((s) => bits.slice(s, s + 8).split('').map((b, i) => {
    const pos = s + i;
    return `<span class="${pos < prefix ? 'net' : 'host'}">${b}</span>`;
  }).join(''));
  return octets.join('<span class="faint">.</span>');
}

function parseCidr(input) {
  const m = String(input).trim().match(/^(\d+\.\d+\.\d+\.\d+)\s*(?:\/\s*(\d{1,2})|\s+(\d+\.\d+\.\d+\.\d+))$/);
  if (!m) throw new Error('Use 192.168.1.10/26 or 192.168.1.10 255.255.255.192');
  ipToInt(m[1]);
  const prefix = m[2] !== undefined ? Number(m[2]) : maskToPrefix(m[3]);
  if (prefix < 0 || prefix > 32) throw new Error('Prefix must be 0–32');
  return { ip: m[1], prefix };
}

export async function render(root, params, ctx) {
  const { store } = ctx;
  let tab = params.query.tab ?? 'drill';
  let kinds = store.get('subnetKinds', ['network', 'broadcast', 'first', 'last', 'hosts', 'prefixForHosts']);
  let problem = null;
  let answered = false;
  let sprint = null;
  let timer = null;
  const stats = () => store.get('subnetStats', { attempts: 0, correct: 0, bestStreak: 0, streak: 0, bestSprint: 0 });

  // The sprint always uses the IPv4 kinds and never touches the user's saved drill selection.
  const SPRINT_KINDS = ['network', 'broadcast', 'first', 'last', 'hosts', 'prefixForHosts', 'wildcard', 'mask'];

  const newProblem = () => {
    const chosen = sprint ? SPRINT_KINDS : kinds;
    const pool = chosen.length ? chosen : PROBLEM_KINDS;
    problem = generateProblem(pool[Math.floor(Math.random() * pool.length)]);
    answered = false;
  };

  function statBadges() {
    const s = stats();
    return html`<span class="badge">Accuracy ${s.attempts ? Math.round((s.correct / s.attempts) * 100) : 0}% (${s.attempts})</span>
      <span class="badge badge-ok">Streak ${s.streak} · best ${s.bestStreak}</span><span class="badge badge-accent">Best sprint ${s.bestSprint}</span>`;
  }

  function header() {
    return html`<div class="page-header"><div><div class="eyebrow">Practice</div><h1>Subnetting Trainer</h1>
      <p>Unlimited generated problems with worked explanations. Speed matters, so aim for under 30 seconds each.</p></div>
      <div class="row" id="sub-stats">${statBadges()}</div></div>
      <div class="tabs">${[['drill', 'Drill'], ['sprint', '5-minute sprint'], ['calc', 'Calculator'], ['chart', 'Cheat chart']].map(([k, l]) => html`
        <button class="tab ${tab === k ? 'active' : ''}" data-tab="${k}">${l}</button>`)}</div>`;
  }

  function problemCard(label) {
    return html`<div class="card" style="max-width:760px">
      <div class="row between"><span class="badge badge-accent">${KIND_LABEL[problem.kind]}</span>${label ?? ''}</div>
      <h2 style="margin:16px 0" class="mono">${problem.prompt}</h2>
      <form data-form="answer" class="row" style="flex-wrap:nowrap">
        <input type="text" class="answer-input" name="answer" autocomplete="off" spellcheck="false" placeholder="Your answer" ${answered ? 'disabled' : ''} autofocus>
        <button class="btn btn-primary btn-lg" type="submit">${answered ? 'Next' : 'Check'}</button>
      </form>
      <div id="result"></div>
    </div>`;
  }

  function drawDrill() {
    if (!problem) newProblem();
    root.innerHTML = String(html`${header()}
      <div class="chips" style="margin-bottom:16px">${PROBLEM_KINDS.map((k) => html`<button class="chip ${kinds.includes(k) ? 'on' : ''}" data-kind="${k}">${KIND_LABEL[k]}</button>`)}</div>
      ${problemCard(html`<span class="small muted">Press Enter to check, Enter again for the next problem.</span>`)}`);
    root.querySelector('input[name=answer]')?.focus();
  }

  function drawSprint() {
    if (!sprint) {
      root.innerHTML = String(html`${header()}<div class="card" style="max-width:760px">
        <h2>5-minute sprint</h2><p class="muted">Mixed IPv4 problems against the clock. Wrong answers cost nothing but time, so keep moving.</p>
        <button class="btn btn-primary btn-lg" data-act="sprint-start">${icon('bolt')} Start sprint</button></div>`);
      return;
    }
    const left = Math.max(0, SPRINT_SECONDS - Math.floor((Date.now() - sprint.started) / 1000));
    root.innerHTML = String(html`${header()}${problemCard(html`<span class="row"><span class="timer ${left < 30 ? 'low' : ''}" id="sprint-time">${Math.floor(left / 60)}:${String(left % 60).padStart(2, '0')}</span><span class="badge badge-ok">${sprint.correct} correct</span><span class="badge">${sprint.wrong} wrong</span></span>`)}`);
    root.querySelector('input[name=answer]')?.focus();
  }

  function drawCalc(value = store.get('subnetCalcLast', '172.16.45.200/21')) {
    root.innerHTML = String(html`${header()}
      <div class="grid" style="grid-template-columns:repeat(auto-fit,minmax(min(100%,380px),1fr));align-items:start">
        <div class="card"><h3>IPv4 calculator</h3>
          <input type="text" class="answer-input" data-calc value="${value}" placeholder="10.1.2.3/27 or 10.1.2.3 255.255.255.224" spellcheck="false">
          <div id="calc-out"></div></div>
        <div class="card"><h3>IPv6 EUI-64 builder</h3>
          <div class="grid grid-2"><label class="field">/64 prefix<input type="text" data-v6="prefix" value="2001:db8:acad:1::" spellcheck="false"></label>
          <label class="field">MAC address<input type="text" data-v6="mac" value="5254.0012.3456" spellcheck="false"></label></div>
          <div id="v6-out" class="mt mono"></div></div>
      </div>`);
    updateCalc(value);
    drawV6();
  }

  function updateCalc(value) {
    let out;
    try {
      const { ip, prefix } = parseCidr(value);
      const s = subnetInfo(ip, prefix);
      const rows = [['Address', `${ip}/${prefix}`], ['Network', s.network], ['Broadcast', prefix >= 31 ? 'n/a (/31 and /32 have no broadcast)' : s.broadcast], ['First host', s.firstHost], ['Last host', s.lastHost],
        ['Usable hosts', s.usableHosts.toLocaleString()], ['Mask', s.mask], ['Wildcard', s.wildcard],
        ['Private?', /^(10\.|172\.(1[6-9]|2\d|3[01])\.|192\.168\.)/.test(ip) ? 'Yes, RFC 1918' : /^169\.254\./.test(ip) ? 'Link-local (APIPA)' : /^100\.(6[4-9]|[7-9]\d|1[01]\d|12[0-7])\./.test(ip) ? 'Shared address space (RFC 6598, CGNAT)' : 'No, public or special-use'],
      ];
      out = html`<table class="ref-table mt">${rows.map(([k, v]) => html`<tr><th style="width:160px">${k}</th><td class="mono">${v}</td></tr>`)}</table>
        <div class="mt"><div class="small muted">Binary (<span style="color:var(--accent)">network</span> / <span style="color:var(--warn)">host</span> bits)</div>
        <div class="binary">${raw(`${binaryOf(ip, prefix)}<br>${binaryOf(s.mask, prefix)}`)}</div></div>`;
    } catch (e) {
      out = html`<p class="muted mt">${e.message}</p>`;
    }
    root.querySelector('#calc-out').innerHTML = String(out);
  }

  function drawV6() {
    const prefix = root.querySelector('[data-v6=prefix]')?.value;
    const mac = root.querySelector('[data-v6=mac]')?.value;
    const outEl = root.querySelector('#v6-out');
    if (!outEl) return;
    try {
      const addr = eui64(prefix, mac);
      outEl.innerHTML = String(html`<div class="big-number" style="font-size:1.2rem">${addr}</div><div class="small muted mt">Expanded: ${expandIPv6(addr)}</div>
        <div class="small muted">Link-local equivalent: ${eui64('fe80::', mac)}</div>`);
    } catch (e) {
      outEl.innerHTML = String(html`<span class="muted">${e.message}</span>`);
    }
  }

  function drawChart() {
    const rows = Array.from({ length: 17 }, (_, i) => 16 + i).map((p) => {
      const s = subnetInfo('10.0.0.0', p);
      const octet = Math.floor(p / 8);
      const block = p % 8 === 0 ? (p === 32 ? 1 : 256) : 256 - Number(s.mask.split('.')[octet]);
      return [p, s.mask, s.wildcard, (2 ** (32 - p)).toLocaleString(), p >= 31 ? (p === 31 ? '2 (RFC 3021)' : '1') : s.usableHosts.toLocaleString(), p === 32 ? '—' : `${block} in octet ${p % 8 === 0 ? octet : octet + 1}`];
    });
    root.innerHTML = String(html`${header()}<div class="card"><div class="table-wrap"><table class="ref-table">
      <thead><tr><th>Prefix</th><th>Mask</th><th>Wildcard</th><th>Addresses</th><th>Usable hosts</th><th>Block size</th></tr></thead>
      <tbody>${rows.map((r) => html`<tr>${r.map((c, i) => html`<td class="${i < 3 ? 'mono' : ''}">${i === 0 ? `/${c}` : c}</td>`)}</tr>`)}</tbody></table></div>
      <p class="small muted mt mb0">Powers of two to memorize: 2, 4, 8, 16, 32, 64, 128, 256, 512, 1024, 2048, 4096. Mask octet values: 128, 192, 224, 240, 248, 252, 254, 255.</p></div>`);
  }

  function draw() {
    if (tab === 'drill') drawDrill();
    else if (tab === 'sprint') drawSprint();
    else if (tab === 'calc') drawCalc();
    else drawChart();
  }

  function submitAnswer(value) {
    if (answered) {
      newProblem();
      draw();
      return;
    }
    if (!value.trim()) return;
    const ok = checkAnswer(problem, value);
    answered = true;
    store.update('subnetStats', (s) => {
      const streak = ok ? s.streak + 1 : 0;
      return { ...s, attempts: s.attempts + 1, correct: s.correct + (ok ? 1 : 0), streak, bestStreak: Math.max(s.bestStreak, streak) };
    }, stats());
    ctx.logActivity();
    if (sprint) {
      sprint = { ...sprint, correct: sprint.correct + (ok ? 1 : 0), wrong: sprint.wrong + (ok ? 0 : 1) };
      if (!ok) toast(`✗ ${problem.answers[0]}`, 'err');
      newProblem();
      drawSprint();
      return;
    }
    const resultEl = root.querySelector('#result');
    root.querySelector('input[name=answer]').disabled = true;
    root.querySelector('[data-form] button').textContent = 'Next';
    root.querySelector('[data-form] button').focus();
    resultEl.innerHTML = String(html`<div class="feedback ${ok ? 'good' : 'bad'}">
      <h3>${icon(ok ? 'check' : 'x')} ${ok ? 'Correct' : `Answer: ${problem.answers[0]}`}</h3>
      <p class="mb0">${problem.explain}</p></div>`);
    const statsEl = root.querySelector('#sub-stats');
    if (statsEl) statsEl.innerHTML = String(statBadges());
  }

  function endSprint() {
    clearInterval(timer);
    timer = null;
    const result = sprint;
    sprint = null;
    store.update('subnetStats', (s) => ({ ...s, bestSprint: Math.max(s.bestSprint, result.correct) }), stats());
    root.innerHTML = String(html`${header()}<div class="card" style="max-width:760px"><h2>Sprint complete</h2>
      <div class="row" style="gap:32px"><div class="stat"><span class="value">${result.correct}</span><span class="label">correct</span></div>
      <div class="stat"><span class="value">${result.wrong}</span><span class="label">wrong</span></div>
      <div class="stat"><span class="value">${result.correct + result.wrong ? Math.round((SPRINT_SECONDS / (result.correct + result.wrong))) : 0}s</span><span class="label">per problem</span></div></div>
      <button class="btn btn-primary mt" data-act="sprint-start">Go again</button></div>`);
  }

  root.addEventListener('submit', (e) => {
    e.preventDefault();
    submitAnswer(new FormData(e.target).get('answer') ?? '');
  });
  root.addEventListener('click', (e) => {
    const t = e.target.closest('button');
    if (!t) return;
    if (t.dataset.tab) { tab = t.dataset.tab; if (tab !== 'sprint' && sprint) { clearInterval(timer); sprint = null; } draw(); }
    if (t.dataset.kind) {
      kinds = kinds.includes(t.dataset.kind) ? kinds.filter((k) => k !== t.dataset.kind) : [...kinds, t.dataset.kind];
      store.set('subnetKinds', kinds);
      newProblem();
      drawDrill();
    }
    if (t.dataset.act === 'sprint-start') {
      sprint = { started: Date.now(), correct: 0, wrong: 0 };
      newProblem();
      drawSprint();
      clearInterval(timer);
      timer = setInterval(() => {
        const left = SPRINT_SECONDS - Math.floor((Date.now() - sprint.started) / 1000);
        if (left <= 0) { endSprint(); return; }
        const el = root.querySelector('#sprint-time');
        if (el) { el.textContent = `${Math.floor(left / 60)}:${String(left % 60).padStart(2, '0')}`; el.classList.toggle('low', left < 30); }
      }, 250);
    }
  });
  root.addEventListener('input', (e) => {
    if (e.target.dataset.calc !== undefined) {
      store.set('subnetCalcLast', e.target.value);
      updateCalc(e.target.value);
    }
    if (e.target.dataset.v6) drawV6();
  });

  draw();
  return () => clearInterval(timer);
}
