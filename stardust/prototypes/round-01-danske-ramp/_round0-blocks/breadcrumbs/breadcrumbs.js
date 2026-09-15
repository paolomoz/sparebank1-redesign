import { el, icon } from '../../scripts/sb1.js';

/**
 * breadcrumbs — the canon back link ("← Låne"): one row, one cell, <p><a>parent</a></p>. The authored paragraph is MOVED
 * into a <nav>; the arrow is a fixed chrome icon prepended to the anchor (no text). Block Collection name (D11).
 */
export default function decorate(block) {
  const p = block.querySelector('p') || block.querySelector('a');
  if (!p) return;
  const a = p.matches('a') ? p : p.querySelector('a');
  if (a) a.prepend(icon('back'));
  block.replaceChildren(el('nav', { class: 'backlink-row', 'aria-label': 'Tilbake' }, p));
}
