// Video course library: the course's videos mapped to its blueprint topics.
// Page copy and links come from the course's `videos.page` module.
import { html, icon, fmtDuration, openModal, esc, toast } from '../ui.js';
import { setDone } from '../progress.js';
import { courseUrl } from '../course.js';
import { youtubeEmbed } from './lesson.js';

const DEFAULT_PAGE = { intro: '', playlist: null, legacy: null, gaps: null, resources: [] };

async function loadPage(course) {
  if (!course.videos.page) return DEFAULT_PAGE;
  try {
    return { ...DEFAULT_PAGE, ...(await import(courseUrl(course, course.videos.page))).default };
  } catch (e) {
    console.error('[videos] could not load the page copy', e);
    toast('Some of the video page could not be loaded.', 'err');
    return DEFAULT_PAGE;
  }
}

export async function render(root, params, ctx) {
  const { content, store, course } = ctx;
  const page = await loadPage(course);
  let filter = params.query.domain ? `d:${params.query.domain}` : 'all';
  let group = 'course';
  let activeModal = null;

  const matches = (v) => {
    if (filter === 'all') return true;
    if (filter === 'unwatched') return !store.get('videosWatched', {})[v.id];
    if (filter === 'legacy') return v.legacy;
    return v.topics.some((t) => t.startsWith(`${filter.slice(2)}.`));
  };

  function card(v, watched) {
    return html`<div class="card video-card">
      <button class="thumb" data-play="${v.id}" style="background-image:url('https://i.ytimg.com/vi/${v.id}/mqdefault.jpg')" aria-label="Play ${v.title}">
        <span class="dur">${fmtDuration(v.seconds)}</span><span class="play">${icon('play', 36)}</span>
        ${watched ? html`<span class="watched badge badge-ok">${icon('check', 12)} Watched</span>` : ''}
      </button>
      <div class="body"><span class="title">${v.title}</span>
        <div class="row small" style="gap:6px">${v.topics.map((t) => html`<a class="badge" href="#/topic/${t}">${t}</a>`)}
          ${v.legacy && page.legacy ? html`<span class="badge badge-warn" title="${page.legacy.title}">${page.legacy.label}</span>` : ''}
          ${v.kind === 'lab' ? html`<span class="badge badge-accent">Lab</span>` : ''}</div></div>
    </div>`;
  }

  function draw() {
    const watched = store.get('videosWatched', {});
    const list = content.videos.filter(matches);
    const watchedCount = content.videos.filter((v) => watched[v.id]).length;
    const totalSec = content.videos.reduce((s, v) => s + v.seconds, 0);
    let body;
    if (group === 'topic') {
      body = html`${content.topics.map((t) => {
        const vids = list.filter((v) => v.topics.includes(t.id));
        return vids.length ? html`<h3 class="mt">${t.id} · ${t.verb} ${t.title}</h3><div class="grid grid-auto">${vids.map((v) => card(v, watched[v.id]))}</div>` : '';
      })}`;
    } else {
      body = html`<div class="grid grid-auto">${list.map((v) => card(v, watched[v.id]))}</div>`;
    }
    root.innerHTML = String(html`
      <div class="page-header"><div><div class="eyebrow">Video course</div><h1>Watch & learn</h1>
        <p>${content.videos.length} videos · ${Math.round(totalSec / 3600)} hours · ${watchedCount} watched.${page.intro ? ` ${page.intro}` : ''}</p></div>
        ${page.playlist ? html`<a class="btn" href="${page.playlist.url}" target="_blank" rel="noopener">${icon('external')} ${page.playlist.label}</a>` : ''}</div>
      <div class="row between" style="margin-bottom:16px">
        <div class="chips">${[['all', 'All'], ['unwatched', 'Unwatched'], ...content.domains.map((d) => [`d:${d.id}`, `D${d.id} ${d.short}`]), ...(page.legacy ? [['legacy', page.legacy.label]] : [])].map(([k, l]) => html`
          <button class="chip ${filter === k ? 'on' : ''}" data-filter="${k}">${l}</button>`)}</div>
        <div class="seg"><button class="${group === 'course' ? 'active' : ''}" data-group="course">Course order</button><button class="${group === 'topic' ? 'active' : ''}" data-group="topic">By topic</button></div>
      </div>
      ${list.length ? body : html`<div class="empty">No videos match this filter.</div>`}
      ${page.gaps ? html`<div class="card mt"><h3>${page.gaps.title}</h3>
        <p class="small muted">${page.gaps.intro}</p>
        <div class="chips">${content.topics.filter((t) => !content.videos.some((v) => v.topics.includes(t.id))).map((t) => html`<a class="chip" href="#/topic/${t.id}">${t.id} ${t.title.slice(0, 48)}…</a>`)}</div>
        ${page.gaps.note ? html`<p class="small muted mb0 mt">${page.gaps.note}</p>` : ''}</div>` : ''}
      ${page.resources.length ? html`<div class="card mt"><h3>Official & recommended resources</h3><div class="list">${page.resources.map((r) => html`
        <a class="list-item" href="${r.url}" target="_blank" rel="noopener"><span class="grow"><span class="title">${r.name}</span><span class="sub">${r.note}</span></span>${icon('external', 16)}</a>`)}</div></div>` : ''}`);
  }

  function play(id) {
    const v = content.videos.find((x) => x.id === id);
    if (!v) return;
    const watched = Boolean(store.get('videosWatched', {})[id]);
    activeModal?.close();
    const { el, close } = openModal(String(html`
      <div class="row between" style="margin-bottom:12px"><h3 class="mb0">${v.title}</h3><button class="icon-btn" data-close aria-label="Close">${icon('x')}</button></div>
      ${youtubeEmbed(v.id)}
      <div class="row between mt"><div class="row small">${v.topics.map((t) => html`<a class="badge" href="#/topic/${t}">${t}</a>`)}
        <a class="small" href="https://www.youtube.com/watch?v=${esc(v.id)}" target="_blank" rel="noopener">Open on YouTube ${icon('external', 13)}</a></div>
        <button class="btn ${watched ? '' : 'btn-primary'}" data-watched>${icon('check')} ${watched ? 'Watched' : 'Mark as watched'}</button></div>`),
    {
      onClose: () => {
        activeModal = null;
        if (!root.isConnected) return; // closed because the user navigated away
        if (location.hash.startsWith('#/videos?')) history.replaceState(null, '', '#/videos');
        draw();
      },
    });
    activeModal = { close };
    el.addEventListener('click', (e) => {
      if (e.target.closest('[data-close]') || e.target.closest('a.badge')) close();
      if (e.target.closest('[data-watched]')) {
        const now = !store.get('videosWatched', {})[id];
        setDone('videosWatched', id, now);
        if (now) ctx.logActivity(2);
        e.target.closest('[data-watched]').outerHTML = `<button class="btn ${now ? '' : 'btn-primary'}" data-watched>${icon('check')} ${now ? 'Watched' : 'Mark as watched'}</button>`;
      }
    });
  }

  root.addEventListener('click', (e) => {
    const t = e.target.closest('[data-play], [data-filter], [data-group]');
    if (!t) return;
    if (t.dataset.play) play(t.dataset.play);
    if (t.dataset.filter) { filter = t.dataset.filter; draw(); }
    if (t.dataset.group) { group = t.dataset.group; draw(); }
  });
  draw();
  if (params.query.play) play(params.query.play);
  return () => activeModal?.close();
}
