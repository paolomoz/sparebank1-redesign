import { el } from '../../scripts/sb1.js';

/**
 * columns — canon split media and promo bands (Block Collection name, D11): one row = [media] [text] (or text first → `text-first`).
 * Variants: `split` (photo + h2/lead/CTA, 5/7 or 7/5) · `promo` (spot illustration + title-sm + line + one pill; `in-rail` after a card rail)
 * · `help` (two stacked columns, hub) · `rows` (several split rows in one movement) · family classes (questions, resident, …).
 * Authored elements are MOVED (EW1–EW3); the first non-CTA paragraph after a heading gets a `lead-wrap`, CTAs a `cta-row`;
 * `sheets` (theme): the body paragraphs after the heading share one `prose-wrap` so the sheets subgrid-align [illustration, h2, prose, links].
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
        const fig = el('figure', { class: 'col-media' }, pic);
        // additive (omoss `expert`): paragraphs authored after the image in the media cell are its caption — MOVED, not dropped
        const caption = [...cell.children].filter((n) => n.textContent.trim() || n.querySelector('picture, img'));
        if (caption.length) fig.append(el('div', { class: 'col-caption' }, ...caption));
        grid.append(fig);
        return;
      }
      const text = el('div', { class: 'col-text' }); const ctaRow = el('div', { class: 'cta-row' }); let leadDone = false;
      const inlineLinks = block.classList.contains('text'); // additive (omoss `text`): running text keeps its link paragraphs in place
      [...cell.children].forEach((n) => {
        if (!inlineLinks && n.matches('p') && (n.querySelector('a.button, strong > a, em > a') || (n.querySelector('a') && n.textContent.trim() === n.querySelector('a').textContent.trim()))) { ctaRow.append(n); return; }
        if (block.classList.contains('split') && n.matches('p') && !leadDone && text.querySelector('h1, h2, h3')) { leadDone = true; text.append(el('div', { class: 'lead-wrap' }, n)); return; }
        if (block.classList.contains('sheets') && n.matches('p') && !n.querySelector('picture, img') && text.querySelector('h1, h2, h3')) { const w = text.lastElementChild?.matches('.prose-wrap') ? text.lastElementChild : el('div', { class: 'prose-wrap' }); if (!w.parentNode) text.append(w); w.append(n); return; } // sheets: the prose paragraphs share one wrapper (one subgrid row)
        text.append(n);
      });
      if (ctaRow.children.length) text.append(ctaRow);
      grid.append(text);
    });
    wrap.append(grid);
  });
  block.replaceChildren(wrap);
}
