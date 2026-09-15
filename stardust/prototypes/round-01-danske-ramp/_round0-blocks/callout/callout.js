import { el, icon } from '../../scripts/sb1.js';

/**
 * callout — canon tip / info box: one row, one cell of prose (heading, paragraphs, optional CTA). Variants: `tip` (Sol bulb on Sand-30,
 * default) · `info` (Vann info glyph on Frost-30) · `frost` (bulb on Frost-30 under a Sand movement). Content is MOVED into `.callout-text`.
 */
export default function decorate(block) {
  const cell = block.querySelector(':scope > div > div'); if (!cell) return;
  const info = block.classList.contains('info');
  const text = el('div', { class: 'callout-text' }, ...[...cell.childNodes]);
  block.replaceChildren(el('div', { class: `callout${info ? ' info' : ''}${block.classList.contains('frost') ? ' callout-frost' : ''}` }, icon(info ? 'info' : 'bulb'), text));
}
