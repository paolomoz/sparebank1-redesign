import { el } from '../../scripts/sb1.js';

/**
 * hero — the canon split hero (product-hero / campaign-carousel / campaign): photo as content on one side, text on the other.
 * Authoring: ONE row, two cells — [photo] [h1 (or the hidden page h1 + h2.display on the market landing), lead paragraph,
 * optional note, CTAs as <strong>/<em>/<em><strong> links]. Variants: `product` (photo right on desktop, h1 left) · `campaign`
 * (market landing: photo left, display h2) · `portrait` (kontakt: circle portrait) · `ask` (kundeservice: chat form rows follow).
 * Every authored element is MOVED (EW1–EW3); wrappers carry the layout classes (lead-wrap, note-wrap, cta-row).
 * The first image is the LCP: eager + fetchpriority high (#100); the media slot is reserved by aspect-ratio.
 */
export default function decorate(block) {
  const row = block.querySelector(':scope > div'); if (!row) return;
  const cells = [...row.children];
  const mediaCell = cells.find((c) => c.querySelector('picture, img') && !c.querySelector('h1, h2, h3'));
  const textCell = cells.find((c) => c !== mediaCell) || cells[0];
  const pic = mediaCell ? mediaCell.querySelector('picture, img') : null;
  const text = el('div', { class: 'hero-text' });
  const ctaRow = el('div', { class: 'cta-row' });
  let leadDone = false;
  [...textCell.children].forEach((n) => {
    if (n.matches('p') && n.querySelector('a.button, strong > a, em > a')) { ctaRow.append(n); return; }
    if (n.matches('p') && !leadDone && !n.querySelector('picture, img')) { leadDone = true; text.append(el('div', { class: 'lead-wrap' }, n)); return; }
    if (n.matches('p') && !n.querySelector('picture, img')) { text.append(el('div', { class: 'note-wrap' }, n)); return; }
    text.append(n);
  });
  if (ctaRow.children.length) text.append(ctaRow);
  const grid = el('div', { class: 'hero-grid' });
  if (pic) {
    const img = pic.matches('img') ? pic : pic.querySelector('img');
    if (img) { img.classList.add('photo'); img.setAttribute('loading', 'eager'); img.setAttribute('fetchpriority', 'high'); }
    grid.append(el('figure', { class: 'hero-media' }, pic));
  }
  grid.append(text);
  block.replaceChildren(el('div', { class: 'container' }, grid));
}
