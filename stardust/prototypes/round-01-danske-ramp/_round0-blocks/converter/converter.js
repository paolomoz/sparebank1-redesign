import { el } from '../../scripts/sb1.js';

/**
 * converter — the currency converter's static shell (dynamics #9 interim: the rate API is owner-bound, controls are disabled, every string
 * is the captured widget text). Rows, in order: [field label | captured value] ×N (paired two per line: from-currency + amount, to-currency
 * + result) · [rate line] · [note] ×N. Every authored paragraph is MOVED (labels into the field labels, values into read-only fields),
 * so the whole widget copy stays editable. No exemptions.
 */
export default function decorate(block) {
  const rows = [...block.children];
  const conv = el('div', { class: 'conv', 'aria-disabled': 'true', 'data-dynamics': '9' });
  let line = null; let fields = 0;
  rows.forEach((r) => {
    const [a, b] = r.children;
    if (b) {
      if (!line || line.children.length === 2) { line = el('div', { class: 'conv-row' }); conv.append(line); }
      const label = a.querySelector('p') || a; const value = b.querySelector('p') || b;
      fields += 1;
      line.append(el('div', { class: 'conv-field' }, el('div', { class: 'label' }, label), el('div', { class: 'conv-out num', 'aria-readonly': 'true' }, value)));
      return;
    }
    [...a.children].forEach((p, i) => conv.append(el('div', { class: conv.querySelector('.conv-rate') ? 'conv-msg small muted' : 'conv-rate num' }, p)));
  });
  block.replaceChildren(el('div', { class: 'container' }, conv));
}
