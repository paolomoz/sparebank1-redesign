import { el } from '../../scripts/sb1.js';

/**
 * hero — the canon split hero (product-hero / campaign-carousel / campaign): photo as content on one side, text on the other.
 * Authoring: ONE row, two cells — [photo] [h1 (or the hidden page h1 + h2.display on the market landing), lead paragraph,
 * optional note, CTAs as <strong>/<em>/<em><strong> links]. Variants: `product` (photo right on desktop, h1 left) · `campaign`
 * (market landing: photo left, display h2) · `portrait` (kontakt: circle portrait) · `ask` (kundeservice: chat form rows follow).
 * Every authored element is MOVED (EW1–EW3); wrappers carry the layout classes (lead-wrap, note-wrap, cta-row).
 * The first image is the LCP: eager + fetchpriority high (#100); the media slot is reserved by aspect-ratio.
 * Story group (additive): `video` (campaign landing: the media cell holds an .mp4 link → <video controls muted loop>, the link stays in a
 * hidden wrapper) · `article` (news: a photo caption paragraph in the media cell → figcaption; a paragraph of <em> only → meta line;
 * three share buttons appended as block chrome — @ew-exempt: their aria-labels "Del på Facebook / LinkedIn / X" are fixed config, not authored text).
 */
const SHARE = [['Del på Facebook', '<path d="M13.5 21v-7.5h2.5l.4-3h-2.9V8.6c0-.9.3-1.5 1.5-1.5h1.6V4.4c-.3 0-1.2-.1-2.3-.1-2.3 0-3.8 1.4-3.8 3.9v2.3H8v3h2.5V21z"/>'], ['Del på LinkedIn', '<path d="M6.5 9.5v9M6.5 6.2v.1M10.5 18.5v-9M10.5 13.2c0-2 1.3-3.7 3.5-3.7s3.5 1.5 3.5 3.7v5.3M17.5 18.5v-5.3"/>'], ['Del på X', '<path d="M5 4l14 16M19 4 5 20"/>']];
const VIDEO = /\.(mp4|webm)(\?|$)/i;
const isMeta = (n) => n.matches('p') && n.children.length > 0 && [...n.children].every((c) => c.tagName === 'EM') && !n.querySelector('a') && ![...n.childNodes].some((t) => t.nodeType === 3 && t.textContent.trim());
export default function decorate(block) {
  const row = block.querySelector(':scope > div'); if (!row) return;
  const cells = [...row.children];
  const mediaCell = cells.find((c) => (c.querySelector('picture, img') || [...c.querySelectorAll('a[href]')].some((a) => VIDEO.test(a.getAttribute('href') || ''))) && !c.querySelector('h1, h2, h3'));
  const vidLink = mediaCell ? [...mediaCell.querySelectorAll('a[href]')].find((a) => VIDEO.test(a.getAttribute('href') || '')) : null;
  const textCell = cells.find((c) => c !== mediaCell) || cells[0];
  const pic = mediaCell ? mediaCell.querySelector('picture, img') : null;
  const text = el('div', { class: 'hero-text' });
  const ctaRow = el('div', { class: 'cta-row' });
  let leadDone = false;
  [...textCell.children].forEach((n) => {
    if (isMeta(n)) { text.append(el('div', { class: 'meta-wrap' }, n)); return; } // <em>tag</em><em>date</em> byline (article) — never the lead
    if (n.matches('p') && (n.querySelector('a.button, strong > a, em > a') || (n.querySelector('a') && n.textContent.trim() === n.querySelector('a').textContent.trim()))) { ctaRow.append(n); return; } // pills AND the canon inline tertiary link share the CTA row
    if (n.matches('p') && !leadDone && !n.querySelector('picture, img')) { leadDone = true; text.append(el('div', { class: 'lead-wrap' }, n)); return; }
    if (n.matches('p') && !n.querySelector('picture, img')) { text.append(el('div', { class: 'note-wrap' }, n)); return; }
    text.append(n);
  });
  if (ctaRow.children.length) text.append(ctaRow);
  if (block.classList.contains('article')) {
    const share = el('ul', { class: 'share', 'aria-label': 'Del artikkelen' });
    SHARE.forEach(([label, path]) => { const svg = document.createElement('template'); svg.innerHTML = `<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">${path}</svg>`; share.append(el('li', {}, el('button', { type: 'button', class: 'share-btn', 'aria-label': label }, svg.content.firstElementChild))); });
    text.append(share);
  }
  const grid = el('div', { class: 'hero-grid' });
  if (pic) {
    const img = pic.matches('img') ? pic : pic.querySelector('img');
    if (img) { img.classList.add('photo'); img.setAttribute('loading', 'eager'); img.setAttribute('fetchpriority', 'high'); }
    const figure = el('figure', { class: 'hero-media' }, pic);
    const caption = [...mediaCell.children].filter((n) => n !== pic && !n.contains(pic) && n.matches('p') && n.textContent.trim()); // article: <em>caption</em> under the photo
    if (caption.length) figure.append(el('div', { class: 'caption-wrap' }, ...caption));
    grid.append(figure);
  } else if (vidLink) {
    const video = el('video', { controls: true, playsinline: true, muted: true, loop: true, preload: 'metadata' }, el('source', { src: vidLink.href, type: /\.webm/i.test(vidLink.href) ? 'video/webm' : 'video/mp4' }));
    video.muted = true;
    grid.append(el('figure', { class: 'hero-media hero-video' }, video, el('div', { class: 'video-src visually-hidden' }, vidLink.closest('p') || vidLink)));
  }
  grid.append(text);
  block.replaceChildren(el('div', { class: 'container' }, grid));
}
