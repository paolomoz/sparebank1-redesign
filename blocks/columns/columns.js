import { el } from '../../scripts/sb1.js';

/**
 * columns — round 01: split media and promo rows as bento cards (Block Collection name, D11): one row = [media] [text] (or text first → `text-first`).
 * Variants: `split` (photo card 5 + text card 7 on Sand-70; `text-first` = text card 5 + photo card 7) · `promo` (illustration tile on Frost-30, 3 cols +
 * teaser card, 9 cols; `promo-2` = two promos on one row 2+4+2+4) · `help` (two stacked columns, hub) · `rows` (several split rows in one movement)
 * · `steps` (hub: numbered ledger, CTAs stay in authored order) · family classes (questions, resident, …).
 * Authored elements are MOVED (EW1–EW3); the first non-CTA paragraph after a heading gets a `lead-wrap`, CTAs a `cta-row`;
 * `sheets` (theme): the body paragraphs after the heading share one `prose-wrap` so the sheets subgrid-align [illustration, h2, prose, links].
 */
export default function decorate(block) {
  const wrap = el('div', { class: 'container' });
  const promo = block.classList.contains('promo'); const split = block.classList.contains('split');
  const carded = promo || split;
  [...block.children].forEach((row) => {
    const grid = el('div', { class: `split-row${carded ? ' bento' : ''}` });
    [...row.children].forEach((cell) => {
      const media = cell.querySelector('picture, img') && !cell.querySelector('h1, h2, h3, h4');
      if (media) {
        const pic = cell.querySelector('picture, img'); const img = pic.matches('img') ? pic : pic.querySelector('img');
        if (img) img.classList.add(promo ? 'promo-illu' : 'photo', 'photo-sm');
        const fig = el('figure', { class: `col-media${carded ? ` card ${promo ? 'card--frost promo-art' : 'q-photo'}` : ''}` }, pic);
        // additive (omoss `expert`): paragraphs authored after the image in the media cell are its caption — MOVED, not dropped
        const caption = [...cell.children].filter((n) => n.textContent.trim() || n.querySelector('picture, img'));
        if (caption.length) fig.append(el('div', { class: 'col-caption' }, ...caption));
        grid.append(fig);
        return;
      }
      const text = el('div', { class: `col-text${carded ? ' card card--tint is-link' : ''}` }); const body = carded ? el('div', { class: 'card-body' }) : text; const ctaRow = el('div', { class: 'cta-row' }); let leadDone = false;
      const inlineLinks = block.classList.contains('text'); // additive (omoss `text`): running text keeps its link paragraphs in place
      const inPlace = block.classList.contains('steps'); // additive (hub `steps`): the pill keeps its authored place between the paragraph and the trailing note
      [...cell.children].forEach((n) => {
        if (!inlineLinks && n.matches('p') && (n.querySelector('a.button, strong > a, em > a') || (n.querySelector('a') && n.textContent.trim() === n.querySelector('a').textContent.trim()))) { if (inPlace) body.append(el('div', { class: 'cta-row' }, n)); else ctaRow.append(n); return; }
        if (split && n.matches('p') && !leadDone && body.querySelector('h1, h2, h3')) { leadDone = true; body.append(el('div', { class: 'lead-wrap' }, n)); return; }
        if (block.classList.contains('sheets') && n.matches('p') && !n.querySelector('picture, img') && body.querySelector('h1, h2, h3')) { const w = body.lastElementChild?.matches('.prose-wrap') ? body.lastElementChild : el('div', { class: 'prose-wrap' }); if (!w.parentNode) body.append(w); w.append(n); return; }
        body.append(n);
      });
      if (ctaRow.children.length) body.append(ctaRow);
      if (carded) { text.append(body); if (ctaRow.querySelectorAll('a').length !== 1) text.classList.remove('is-link'); }
      grid.append(text);
    });
    wrap.append(grid);
  });
  block.replaceChildren(wrap);
}
