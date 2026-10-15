import { el } from '../../scripts/sb1.js';
import { loadFeatureData } from '../../scripts/site-config.js';
import { convertCurrency, parseNumber } from '../../scripts/calc-math.js';

/**
 * converter — the valutakalkulator (dynamics #9). Rows, in order: [Fra | default from-currency "NOK Norske kroner"] · [from code |
 * default amount] · [Til | default to-currency "EUR Euro"] · [to code | captured result] · [rate line] · [note] ×N. Labels and notes
 * are MOVED into the widget; the captured result and rate line are replaced by the computed ones once the rates load.
 * Behaviour lifted from the source component: from-currency → NOK at the bank's buy rate, NOK → to-currency at its sell rate, two
 * decimals; rate line "1 <to> = buy(to)/sell(from) <from>". Rates: the bank's daily list (GET /openapi/nettsider/ressurser/bank/valutakurser) —
 * not reachable cross-origin, so the block reads the dated code-bus snapshot (scripts/site-config.js `currencyRates`) and says
 * which day's rates it shows. Without rates the captured values stay, controls disabled.
 * @ew-exempt rate line / result — computed values (the captured ones are the no-JS fallback)
 */
const code = (s) => (s.match(/[A-Z]{3}/) || [])[0];
const fmt = (n) => n.toFixed(2);
const day = (iso) => {
  // the bank's rates are Oslo-time; say so regardless of the visitor's clock
  const parts = Object.fromEntries(new Intl.DateTimeFormat('nb-NO', {
    timeZone: 'Europe/Oslo', day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit', hourCycle: 'h23',
  }).formatToParts(new Date(iso)).map((x) => [x.type, x.value]));
  return `${parts.day}.${parts.month}.${parts.year} kl. ${parts.hour}:${parts.minute}`;
};

export default async function decorate(block) {
  const rows = [...block.children];
  const pairs = rows.filter((r) => r.children.length >= 2);
  const singles = rows.filter((r) => r.children.length < 2);
  if (pairs.length < 4) return;
  const p = (r, i) => r.children[i].querySelector('p') || r.children[i];
  const [fromRow, amountRow, toRow, resultRow] = pairs;
  const fromDefault = code(p(fromRow, 1).textContent) || 'NOK';
  const toDefault = code(p(toRow, 1).textContent) || 'EUR';
  const amountDefault = parseNumber(p(amountRow, 1).textContent) || 100;

  const fromSel = el('select', { class: 'conv-select', id: 'conv-from', disabled: true });
  const toSel = el('select', { class: 'conv-select', id: 'conv-to', disabled: true });
  const amount = el('input', {
    class: 'conv-in num', id: 'conv-amount', type: 'text', inputmode: 'decimal', maxlength: '12', value: String(amountDefault), 'aria-label': 'Valuta input', disabled: true,
  });
  const fromCode = p(amountRow, 0); const toCode = p(resultRow, 0);
  const result = el('output', { class: 'conv-out num', for: 'conv-amount conv-from conv-to', 'aria-live': 'polite' }, p(resultRow, 1));
  const [rateRow, ...noteRows] = singles;
  const rateLine = el('div', { class: 'conv-rate num', 'aria-live': 'polite' }, rateRow ? p(rateRow, 0) : '');
  const stamp = el('div', { class: 'conv-msg small muted conv-stamp' });
  const conv = el('div', { class: 'conv', 'data-dynamics': '9' },
    el('div', { class: 'conv-row' },
      el('div', { class: 'conv-field' }, el('label', { class: 'label', for: 'conv-from' }, p(fromRow, 0)), fromSel),
      el('div', { class: 'conv-field' }, el('label', { class: 'label', for: 'conv-amount' }, fromCode), amount)),
    el('div', { class: 'conv-row' },
      el('div', { class: 'conv-field' }, el('label', { class: 'label', for: 'conv-to' }, p(toRow, 0)), toSel),
      el('div', { class: 'conv-field' }, el('div', { class: 'label' }, toCode), result)),
    rateLine,
    ...noteRows.flatMap((r) => [...r.children[0].children].map((n) => el('div', { class: 'conv-msg small muted' }, n))),
    stamp);
  block.replaceChildren(el('div', { class: 'container' }, conv));

  const res = await loadFeatureData('currencyRates');
  const list = res && (Array.isArray(res.data) ? res.data : res.data.rates);
  if (!list?.length) return;
  const rates = Object.fromEntries(list.map((r) => [r.currencyCode, r]));
  const options = [['NOK', 'Norske kroner'], ...list.map((r) => [r.currencyCode, r.currencyName.trim()])];
  [fromSel, toSel].forEach((sel, i) => {
    sel.replaceChildren(...options.map(([c, name]) => el('option', { value: c }, `${c} ${name}`)));
    sel.value = i ? toDefault : fromDefault;
    sel.disabled = false;
  });
  amount.disabled = false;
  const update = () => {
    const from = fromSel.value; const to = toSel.value;
    fromCode.textContent = from; toCode.textContent = to;
    const value = parseNumber(amount.value);
    const { result: r, rate } = convertCurrency(Number.isFinite(value) ? value : 0, from, to, rates);
    result.textContent = fmt(r);
    rateLine.textContent = `1 ${to} = ${fmt(rate)} ${from}`;
  };
  [fromSel, toSel].forEach((s) => s.addEventListener('change', update));
  amount.addEventListener('input', () => { amount.value = amount.value.replace(/[^\d.,]/g, ''); update(); });
  const asOf = res.data.ratesUpdatedAt || res.data.snapshotAt;
  if (!res.live && asOf) stamp.textContent = `Kurs per ${day(asOf)}`;
  block.dataset.snapshot = res.live ? 'live' : res.data.snapshotAt;
  update();
}
