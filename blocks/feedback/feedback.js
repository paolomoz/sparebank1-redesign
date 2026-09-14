import { el, icon } from '../../scripts/sb1.js';

/**
 * feedback — "Hva synes du om denne siden?" with Ja / Nei thumbs (dynamics #5 interim: static, no network).
 * Authoring: one row, three cells [question heading] [Ja label] [Nei label]. Variant `labels` shows the labels beside the thumbs
 * (presse, markedsnytt); the default hides them visually (product, hub). The question is MOVED; the two labels are MOVED into the
 * buttons' label slots — the button hosts fixed chrome (the icon) and the authored <p> inside a span (EW7 accepted: static control,
 * the thanks state is block-owned).
 */
export default function decorate(block) {
  const row = block.querySelector(':scope > div'); if (!row) return;
  const [qCell, yesCell, noCell] = row.children;
  const q = qCell ? [...qCell.childNodes] : [];
  const visible = block.classList.contains('labels');
  const mk = (cell, name, fallback) => {
    const p = cell?.querySelector('p') || el('p', {}, fallback);
    const label = el('span', { class: visible ? 'thumb-label' : 'visually-hidden' }, p);
    const b = el('button', { type: 'button', class: 'button secondary thumb' }, icon(name), label);
    b.addEventListener('click', () => { block.querySelectorAll('.thumb').forEach((x) => x.classList.remove('is-on')); b.classList.add('is-on'); block.classList.add('is-answered'); });
    return b;
  };
  block.replaceChildren(el('div', { class: 'container feedback-row' }, el('div', { class: 'feedback-q' }, ...q), el('div', { class: 'feedback-btns' }, mk(yesCell, 'thumb-up', 'Ja'), mk(noCell, 'thumb-down', 'Nei'))));
}
