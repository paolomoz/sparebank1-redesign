import { el } from '../../scripts/sb1.js';

/**
 * table — Block Collection table (D11): one block row per table row, the FIRST row is the header (variant `no-header` opts out).
 * Variant `directory` (kontakt): the first column holds row headers (<th scope="row">) — the bank directory.
 * Authored cell content is MOVED into <th>/<td> (EW1); phone numbers stay the authored tel: links.
 */
export default function decorate(block) {
  const rows = [...block.children];
  const header = !block.classList.contains('no-header');
  const rowHeaders = block.classList.contains('directory') || block.classList.contains('row-headers'); // `row-headers` (omoss): generic row-header table without the directory styling
  const table = el('table');
  const thead = el('thead'); const tbody = el('tbody');
  rows.forEach((row, i) => {
    const tr = el('tr');
    [...row.children].forEach((cell, j) => {
      const isHead = header && i === 0; const isRowHead = rowHeaders && j === 0 && !isHead;
      const td = el(isHead || isRowHead ? 'th' : 'td', { scope: isHead ? 'col' : isRowHead ? 'row' : null }, ...cell.childNodes);
      tr.append(td);
    });
    (header && i === 0 ? thead : tbody).append(tr);
  });
  if (thead.children.length) table.append(thead);
  table.append(tbody);
  block.replaceChildren(el('div', { class: 'table-wrap' }, table));
}
