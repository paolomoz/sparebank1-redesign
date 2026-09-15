import { el } from '../../scripts/sb1.js';

/**
 * video — auto-blocked from a paragraph holding only an .mp4/.webm link (scripts.js buildMediaAutoBlocks, D1): one cell, the link.
 * The block renders the canon campaign film frame (<video controls muted loop preload="metadata">, 3:2, one-corner mask) from the
 * authored URL; the media stays on its source origin. The authored paragraph is MOVED into a hidden wrapper (EW1 — the URL stays editable).
 */
export default function decorate(block) {
  const a = block.querySelector('a[href]'); if (!a) return;
  const src = a.href; const type = /\.webm(\?|$)/i.test(src) ? 'video/webm' : 'video/mp4';
  const video = el('video', { controls: true, playsinline: true, muted: true, loop: true, preload: 'metadata' }, el('source', { src, type }));
  video.muted = true;
  const fig = el('figure', { class: 'video-fig' }, video, el('div', { class: 'video-src visually-hidden' }, a.closest('p') || a));
  block.replaceChildren(fig);
}
