import { el, icon } from '../../scripts/sb1.js';

/**
 * accordion — the canon FAQ (Block Collection name, D11): one row per question [question as <h3>] [answer].
 * Variants `wide` (hub: answers span the column, sub-headings h4/h5) and `rate` (hub: a fixed "Var dette nyttig?" Ja/Nei row before the
 * trailing read-more link — block chrome, @ew-exempt labels, dynamics #5 interim). Variant `more`: the FIRST row is the disclosure label ("Se flere spørsmål og svar") and the remaining rows sit behind it (dynamics #4 interim).
 * The question paragraph is MOVED into a heading row whose whole surface toggles the answer (EW7: the toggle is a chevron-only
 * <button>, the authored text never sits inside a <button>/<summary>). Answers are hidden until opened (`hidden`), so the
 * page height matches the canon collapsed state.
 */
let n = 0;
/** additive (hub `rate`): the per-answer "Var dette nyttig?" Ja/Nei row — block chrome (dynamics #5 interim, static), @ew-exempt labels. */
function rateRow() {
  const mk = (name, label) => el('button', { type: 'button', class: 'button secondary thumb', 'aria-label': label }, icon(name), el('span', {}, label));
  const row = el('div', { class: 'faq-foot-feedback', role: 'group', 'aria-label': 'Var dette nyttig?' }, el('span', { class: 'feedback-q' }, 'Var dette nyttig?'), mk('thumb-up', 'Ja'), mk('thumb-down', 'Nei'));
  row.addEventListener('click', (e) => { const b = e.target.closest('.thumb'); if (!b) return; row.querySelectorAll('.thumb').forEach((x) => x.classList.remove('is-on')); b.classList.add('is-on'); });
  return row;
}
function item(row, opts = {}) {
  const [qCell, aCell] = row.children;
  n += 1; const id = `faq-${n}`;
  const btn = el('button', { type: 'button', class: 'faq-toggle', 'aria-expanded': 'false', 'aria-controls': id, 'aria-label': 'Vis svar' }, icon('down'));
  const head = el('div', { class: 'faq-head' }, el('div', { class: 'faq-q' }, ...(qCell ? [...qCell.childNodes] : [])), btn);
  const body = el('div', { class: 'answer prose', id, hidden: true }, ...(aCell ? [...aCell.childNodes] : []));
  if (opts.rate) { const more = body.querySelector(':scope > p:last-child:has(> a:only-child)'); if (more) more.before(rateRow()); else body.append(rateRow()); }
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
  const opts = { rate: block.classList.contains('rate') };
  rows.forEach((r) => list.append(item(r, opts)));
  block.replaceChildren(list);
}
