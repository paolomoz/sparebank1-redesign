import { el } from '../../scripts/sb1.js';

/**
 * table — a genuine data table (D10 exception; Block Collection name, D11). Authoring: one block row per table row, one cell per
 * column; the first row is the header row unless the block carries `no-header`. Variant `row-headers`: the first cell of every body
 * row is a row header (<th scope="row">). Cell content is MOVED into the <td>/<th> (EW1): the pipeline unwraps single-paragraph
 * cells, so a cell's inline run (text, <br>, <strong>, links) arrives as bare nodes and keeps its prose index on the cell.
 */
export default function decorate(block) {
  const rows = [...block.children];
  const header = !block.classList.contains('no-header');
  const rowHeaders = block.classList.contains('row-headers');
  const table = el('table');
  const thead = el('thead'); const tbody = el('tbody');
  rows.forEach((row, i) => {
    const tr = el('tr');
    [...row.children].forEach((cell, j) => {
      const isTh = (header && i === 0) || (rowHeaders && j === 0);
      const c = el(isTh ? 'th' : 'td', isTh ? { scope: header && i === 0 ? 'col' : 'row' } : {}, ...[...cell.childNodes]);
      tr.append(c);
    });
    (header && i === 0 ? thead : tbody).append(tr);
  });
  if (thead.children.length) table.append(thead);
  table.append(tbody);
  block.replaceChildren(el('div', { class: 'table-wrap' }, table));
}
