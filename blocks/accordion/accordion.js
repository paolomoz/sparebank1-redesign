import { el, icon } from '../../scripts/sb1.js';

/**
 * accordion — the canon FAQ (Block Collection name, D11): one row per question [question as <h3>] [answer].
 * Variant `more`: the FIRST row is the disclosure label ("Se flere spørsmål og svar") and the remaining rows sit behind it (dynamics #4 interim).
 * The question paragraph is MOVED into a heading row whose whole surface toggles the answer (EW7: the toggle is a chevron-only
 * <button>, the authored text never sits inside a <button>/<summary>). Answers are hidden until opened (`hidden`), so the
 * page height matches the canon collapsed state.
 */
let n = 0;
function item(row) {
  const [qCell, aCell] = row.children;
  n += 1; const id = `faq-${n}`;
  const btn = el('button', { type: 'button', class: 'faq-toggle', 'aria-expanded': 'false', 'aria-controls': id, 'aria-label': 'Vis svar' }, icon('down'));
  const head = el('div', { class: 'faq-head' }, el('div', { class: 'faq-q' }, ...(qCell ? [...qCell.childNodes] : [])), btn);
  const body = el('div', { class: 'answer prose', id, hidden: true }, ...(aCell ? [...aCell.childNodes] : []));
  const it = el('div', { class: 'faq-item' }, head, body);
  const toggle = () => { const open = btn.getAttribute('aria-expanded') === 'true'; btn.setAttribute('aria-expanded', String(!open)); body.hidden = open; it.classList.toggle('is-open', !open); };
  head.addEventListener('click', (e) => { if (e.target.closest('a')) return; toggle(); });
  return it;
}

export default function decorate(block) {
  const rows = [...block.children];
  const list = el('div', { class: 'faq' });
  if (block.classList.contains('more') && rows.length) {
    const label = rows.shift();
    const btn = el('button', { type: 'button', class: 'faq-more-toggle', 'aria-expanded': 'false' }, icon('down'));
    const head = el('div', { class: 'faq-more-head' }, el('div', { class: 'faq-more-label' }, ...[...label.children].flatMap((c) => [...c.childNodes])), btn);
    const items = el('div', { class: 'faq faq-more-items', hidden: true });
    rows.forEach((r) => items.append(item(r)));
    const toggle = () => { const open = btn.getAttribute('aria-expanded') === 'true'; btn.setAttribute('aria-expanded', String(!open)); items.hidden = open; block.classList.toggle('is-open', !open); };
    head.addEventListener('click', toggle);
    block.replaceChildren(el('div', { class: 'faq-more' }, head, items));
    return;
  }
  rows.forEach((r) => list.append(item(r)));
  block.replaceChildren(list);
}
