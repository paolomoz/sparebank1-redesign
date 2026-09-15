import { el, icon } from '../../scripts/sb1.js';

/**
 * table — Block Collection table (D11): one block row per table row, the FIRST row is the header (variant `no-header` opts out).
 * Variant `directory` (kontakt): the first column holds row headers (<th scope="row">) — the bank directory.
 * Variant `disclose` (iban, valutakurser): the FIRST row is the toggle label (secondary pill, chevron-only <button> — EW7), an optional
 * single-cell heading row follows, then the header + data rows sit in a hidden panel until opened (the canon <details> starts closed).
 * Authored cell content is MOVED into <th>/<td> (EW1); phone numbers stay the authored tel: links.
 */
function buildTable(rows, { header, rowHeaders }) {
  const table = el('table'); const thead = el('thead'); const tbody = el('tbody');
  rows.forEach((row, i) => {
    const tr = el('tr');
    [...row.children].forEach((cell, j) => {
      const isHead = header && i === 0; const isRowHead = rowHeaders && j === 0 && !isHead;
      tr.append(el(isHead || isRowHead ? 'th' : 'td', { scope: isHead ? 'col' : isRowHead ? 'row' : null }, ...cell.childNodes));
    });
    (header && i === 0 ? thead : tbody).append(tr);
  });
  if (thead.children.length) table.append(thead);
  table.append(tbody);
  return el('div', { class: 'table-wrap' }, table);
}

let n = 0;
export default function decorate(block) {
  const rows = [...block.children];
  const opts = { header: !block.classList.contains('no-header'), rowHeaders: block.classList.contains('directory') };
  if (block.classList.contains('disclose') && rows.length) {
    n += 1; const id = `table-disclose-${n}`;
    const label = rows.shift();
    const heading = rows[0] && rows[0].children.length === 1 && rows[0].querySelector('h1, h2, h3, h4') ? rows.shift() : null;
    const btn = el('button', { type: 'button', class: 'disclose-toggle', 'aria-expanded': 'false', 'aria-controls': id, 'aria-label': 'Vis' }, icon('down'));
    const head = el('div', { class: 'disclose-head' }, el('div', { class: 'disclose-label' }, ...[...label.children].flatMap((c) => [...c.childNodes])), btn);
    const panel = el('div', { class: 'disclose-body', id, hidden: true });
    if (heading) panel.append(el('div', { class: 'disclose-heading' }, ...[...heading.children].flatMap((c) => [...c.childNodes])));
    panel.append(buildTable(rows, opts));
    const toggle = () => { const open = btn.getAttribute('aria-expanded') === 'true'; btn.setAttribute('aria-expanded', String(!open)); panel.hidden = open; block.classList.toggle('is-open', !open); };
    head.addEventListener('click', toggle);
    block.replaceChildren(el('div', { class: 'disclose' }, head, panel));
    return;
  }
  block.replaceChildren(buildTable(rows, opts));
}
