import { el } from '../../scripts/sb1.js';

/**
 * calculator — the loan calculator's static shell (dynamics #7 interim: the API is owner-bound, controls are disabled, every string is
 * the captured widget text). Rows, in order: [Faner | <ul> tab labels] · [group legend | <ul> option labels] ×N · [field label | value] ×N
 * · [result label | result value] (the LAST two-cell row) · [CTAs] · [note] ×N. Every authored paragraph and list is MOVED into the shell
 * (tabs and pills are the authored <li>s styled as controls; field values are the authored <p>s styled as read-only inputs), so the whole
 * widget copy stays editable. No exemptions.
 */
export default function decorate(block) {
  const rows = [...block.children];
  const calc = el('div', { class: 'calc', 'aria-disabled': 'true', 'data-dynamics': '7' });
  const twoCell = rows.filter((r) => r.children.length === 2 && !r.querySelector('ul'));
  const resultRow = twoCell[twoCell.length - 1];
  const groups = el('div', { class: 'calc-groups' }); const fields = el('div', { class: 'calc-fields' }); const notes = [];
  let ctasEl = null; let result = null; let tabs = null;
  rows.forEach((r) => {
    const [a, b] = r.children;
    if (b && b.querySelector('ul')) {
      const ul = b.querySelector('ul'); const label = a.querySelector('p') || a;
      if (!tabs && /faner/i.test(label.textContent)) { ul.classList.add('calc-tabs'); tabs = el('div', { class: 'calc-tabs-wrap', role: 'group', 'aria-label': 'Kalkulatorfaner' }, ul); label.classList.add('visually-hidden'); tabs.prepend(label); [...ul.children].forEach((li, i) => { li.classList.add('calc-tab'); if (!i) li.classList.add('is-on'); }); return; }
      ul.classList.add('pill-row'); [...ul.children].forEach((li, i) => { li.classList.add('pill'); if (!i) li.classList.add('is-on'); });
      groups.append(el('div', { class: 'calc-pills', role: 'group' }, el('div', { class: 'label' }, label), ul)); return;
    }
    if (b) {
      const label = a.querySelector('p') || a; const value = b.querySelector('p') || b; value.classList.add('num');
      if (r === resultRow) { result = el('div', { class: 'calc-result' }, el('div', { class: 'calc-result-label' }, label), el('div', { class: 'calc-result-value' }, value)); return; }
      fields.append(el('div', { class: 'field' }, el('div', { class: 'label' }, label), el('div', { class: 'input' }, value))); return;
    }
    if (a.querySelector('a')) { ctasEl = el('div', { class: 'calc-ctas' }, ...[...a.children]); return; }
    [...a.children].forEach((p) => notes.push(el('div', { class: 'calc-note' }, p)));
  });
  if (tabs) calc.append(tabs);
  if (groups.children.length) calc.append(groups);
  if (fields.children.length) calc.append(fields);
  if (result) calc.append(result);
  if (ctasEl) calc.append(ctasEl);
  notes.forEach((n) => calc.append(n));
  block.replaceChildren(el('div', { class: 'container calc-wrap' }, calc));
}
