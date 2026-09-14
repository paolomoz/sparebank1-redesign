import { el } from '../../scripts/sb1.js';

/**
 * columns — canon split media and promo bands (Block Collection name, D11): one row = [media] [text] (or text first → `text-first`).
 * Variants: `split` (photo + h2/lead/CTA, 5/7 or 7/5) · `promo` (spot illustration + title-sm + line + one pill; `in-rail` after a card rail)
 * · `help` (two stacked columns, hub) · `rows` (several split rows in one movement) · family classes (questions, resident, …).
 * Authored elements are MOVED (EW1–EW3); the first non-CTA paragraph after a heading gets a `lead-wrap`, CTAs a `cta-row`.
 */
export default function decorate(block) {
  const wrap = el('div', { class: 'container' });
  [...block.children].forEach((row) => {
    const grid = el('div', { class: 'split-row' });
    [...row.children].forEach((cell) => {
      const media = cell.querySelector('picture, img') && !cell.querySelector('h1, h2, h3, h4');
      if (media) {
        const pic = cell.querySelector('picture, img'); const img = pic.matches('img') ? pic : pic.querySelector('img');
        if (img) img.classList.add(block.classList.contains('promo') ? 'promo-illu' : 'photo', 'photo-sm');
        grid.append(el('figure', { class: 'col-media' }, pic));
        return;
      }
      const text = el('div', { class: 'col-text' }); const ctaRow = el('div', { class: 'cta-row' }); let leadDone = false;
      [...cell.children].forEach((n) => {
        if (n.matches('p') && (n.querySelector('a.button, strong > a, em > a') || (n.querySelector('a') && n.textContent.trim() === n.querySelector('a').textContent.trim()))) { ctaRow.append(n); return; }
        if (block.classList.contains('split') && n.matches('p') && !leadDone && text.querySelector('h1, h2, h3')) { leadDone = true; text.append(el('div', { class: 'lead-wrap' }, n)); return; }
        text.append(n);
      });
      if (ctaRow.children.length) text.append(ctaRow);
      grid.append(text);
    });
    wrap.append(grid);
  });
  block.replaceChildren(wrap);
}
