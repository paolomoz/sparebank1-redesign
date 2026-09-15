import { el } from '../../scripts/sb1.js';

/**
 * hero — the canon split hero (product-hero / campaign-carousel / campaign): photo as content on one side, text on the other.
 * Authoring: ONE row, two cells — [photo] [h1 (or the hidden page h1 + h2.display on the market landing), lead paragraph,
 * optional note, CTAs as <strong>/<em>/<em><strong> links]. Variants: `product` (photo right on desktop, h1 left) · `campaign`
 * (market landing: photo left, display h2) · `portrait` (kontakt: circle portrait, h1 beside the photo on phones) · `ask`
 * (kundeservice: h1 beside the photo, then title + lead + line, then the chat form authored as a SECOND row
 * [field label + note][button label] — dynamics #6 interim: controls disabled; the textarea placeholder repeats the field label
 * (@ew-exempt: derived attribute, the label paragraph itself stays editable)).
 * Every authored element is MOVED (EW1–EW3); wrappers carry the layout classes (hero-h1, lead-wrap, note-wrap, cta-row, ask-*).
 * The first image is the LCP: eager + fetchpriority high (#100); the media slot is reserved by aspect-ratio.
 * Story group (additive): `video` (campaign landing: the media cell holds an .mp4 link → <video controls muted loop>, the link stays in a
 * hidden wrapper) · `article` (news: a photo caption paragraph in the media cell → figcaption; a paragraph of <em> only → meta line;
 * three share buttons appended as block chrome — @ew-exempt: their aria-labels "Del på Facebook / LinkedIn / X" are fixed config, not authored text).
 */
const SHARE = [['Del på Facebook', '<path d="M13.5 21v-7.5h2.5l.4-3h-2.9V8.6c0-.9.3-1.5 1.5-1.5h1.6V4.4c-.3 0-1.2-.1-2.3-.1-2.3 0-3.8 1.4-3.8 3.9v2.3H8v3h2.5V21z"/>'], ['Del på LinkedIn', '<path d="M6.5 9.5v9M6.5 6.2v.1M10.5 18.5v-9M10.5 13.2c0-2 1.3-3.7 3.5-3.7s3.5 1.5 3.5 3.7v5.3M17.5 18.5v-5.3"/>'], ['Del på X', '<path d="M5 4l14 16M19 4 5 20"/>']];
const VIDEO = /\.(mp4|webm)(\?|$)/i;
const isMeta = (n) => n.matches('p') && n.children.length > 0 && [...n.children].every((c) => c.tagName === 'EM') && !n.querySelector('a') && ![...n.childNodes].some((t) => t.nodeType === 3 && t.textContent.trim());
function askForm(row) {
  const [fieldCell, btnCell] = [...row.children];
  const paras = fieldCell ? [...fieldCell.querySelectorAll('p')] : [];
  const labelNodes = paras.length ? [paras[0]] : [...(fieldCell?.childNodes || [])];
  const label = el('div', { class: 'ask-label label', id: 'ask-label' }, ...labelNodes);
  const input = el('textarea', { class: 'ask-input', id: 'ask-input', name: 'q', rows: '1', maxlength: '110', 'aria-labelledby': 'ask-label', 'aria-describedby': 'ask-note', disabled: true });
  input.placeholder = label.textContent.trim(); // @ew-exempt (derived from the editable label)
  const btn = el('button', { type: 'submit', class: 'button primary', disabled: true }, el('span', { class: 'ask-btn-label' }, ...(btnCell ? [...btnCell.childNodes] : [])));
  const note = el('div', { class: 'ask-note small muted', id: 'ask-note' }, ...paras.slice(1));
  const form = el('form', { class: 'ask', 'data-dynamics': '6' }, label, el('div', { class: 'ask-row' }, input, btn));
  if (note.childNodes.length) form.append(note);
  form.addEventListener('submit', (e) => e.preventDefault());
  return form;
}

export default function decorate(block) {
  const rows = [...block.children]; const row = rows[0]; if (!row) return;
  const cells = [...row.children];
  const mediaCell = cells.find((c) => (c.querySelector('picture, img') || [...c.querySelectorAll('a[href]')].some((a) => VIDEO.test(a.getAttribute('href') || ''))) && !c.querySelector('h1, h2, h3'));
  const vidLink = mediaCell ? [...mediaCell.querySelectorAll('a[href]')].find((a) => VIDEO.test(a.getAttribute('href') || '')) : null;
  const textCell = cells.find((c) => c !== mediaCell) || cells[0];
  const pic = mediaCell ? mediaCell.querySelector('picture, img') : null;
  const splitH1 = block.classList.contains('ask') || block.classList.contains('portrait');
  const text = el('div', { class: 'hero-text' });
  const ctaRow = el('div', { class: 'cta-row' });
  let leadDone = false; let h1Wrap = null;
  [...textCell.children].forEach((n) => {
    if (splitH1 && n.matches('h1')) { h1Wrap = el('div', { class: 'hero-h1' }, n); return; }
    if (isMeta(n)) { text.append(el('div', { class: 'meta-wrap' }, n)); return; } // <em>tag</em><em>date</em> byline (article) — never the lead
    if (n.matches('p') && (n.querySelector('a.button, strong > a, em > a') || (n.querySelector('a') && n.textContent.trim() === n.querySelector('a').textContent.trim()))) { ctaRow.append(n); return; } // pills AND the canon inline tertiary link share the CTA row
    if (n.matches('p') && !leadDone && !n.querySelector('picture, img')) { leadDone = true; text.append(el('div', { class: 'lead-wrap' }, n)); return; }
    if (n.matches('p') && !n.querySelector('picture, img')) { text.append(el('div', { class: 'note-wrap' }, n)); return; }
    text.append(n);
  });
  if (ctaRow.children.length) text.append(ctaRow);
  if (block.classList.contains('ask') && rows[1]) text.append(askForm(rows[1]));
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
  if (h1Wrap) grid.append(h1Wrap);
  grid.append(text);
  block.replaceChildren(el('div', { class: 'container' }, grid));
}
