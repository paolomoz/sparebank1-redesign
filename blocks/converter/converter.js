import { el } from '../../scripts/sb1.js';
import { siteConfig } from '../../scripts/site-config.js';

/**
 * converter — the currency converter (dynamics #9). Rows, in order: [from label | default currency "NOK Norske kroner"] ·
 * [amount label | default amount] · [to label | default currency] · [result label | captured result] · optional
 * [date label "Kurs per" | –] · [rate line] · [note] ×N. The authored values render first as the static shell (EW1: every
 * paragraph is MOVED); the block then loads the rates and turns the shell into the working converter.
 * Rates: the dated code-bus snapshot data/currency-converter/valutakurser.json (stardust/scripts/sync-currency-rates.mjs) until
 * siteConfig.currencyRates is enabled — the source's live feed is CORS-closed (owner decision). Compute recovered from the
 * source widget (clientlib_base, currency-converter): amount × (from.buyCurrencyChequeRate / from.unitNumber) /
 * (to.sellCurrencyChequeRate / to.unitNumber), shown with toFixed(2); rate line "1 <to> = <to.buy/unit ÷ from.sell/unit> <from>".
 * @ew-exempt <p> from/to default currencies, default amount — values copied into the controls
 */

const RATES_SNAPSHOT = '/data/currency-converter/valutakurser.json';

/** the source's amount parser: "1 000,50" → 1000.5; non-numeric → NaN */
export function parseAmount(v) {
  const s = String(v).trim();
  if (s === '') return 0;
  return Number.isNaN(Number(s)) ? Number(s.replace(/,/g, '.').replace(/[^\d.,-]/g, '')) : Number(s);
}

/** amount in `from` → amount in `to` at transfer (cheque) rates */
export function convert(amount, from, to) {
  return (from.buyCurrencyChequeRate / from.unitNumber / (to.sellCurrencyChequeRate / to.unitNumber)) * amount;
}

/** 1 `to` in `from` */
export function unitRate(from, to) {
  return (to.buyCurrencyChequeRate / to.unitNumber) / (from.sellCurrencyChequeRate / from.unitNumber);
}

async function loadRates() {
  const live = siteConfig.currencyRates;
  const res = await fetch(live?.enabled ? live.endpoint : RATES_SNAPSHOT);
  if (!res.ok) throw new Error(`rates ${res.status}`);
  const rates = await res.json();
  if (!Array.isArray(rates) || rates.length < 2) throw new Error('rates shape');
  return rates;
}

export default async function decorate(block) {
  const rows = [...block.children];
  const conv = el('div', { class: 'conv', 'data-dynamics': '9' });
  const pairs = []; const singles = [];
  rows.forEach((r) => {
    const [a, b] = r.children;
    if (b) pairs.push({ label: a.querySelector('p') || a, value: b.querySelector('p') || b });
    else singles.push(...[...a.children]);
  });
  const [fromP, amountP, toP, resultP, dateP] = pairs;
  const [rateP, ...noteEls] = singles;

  // static shell: the authored values as read-only fields
  const field = (p) => (p ? el('div', { class: 'conv-field' }, el('div', { class: 'label' }, p.label), el('div', { class: 'conv-out num', 'aria-readonly': 'true' }, p.value)) : null);
  const shellRows = [[fromP, amountP], [toP, resultP]].map((pair) => el('div', { class: 'conv-row' }, pair.map(field)));
  const rateLine = el('div', { class: 'conv-rate num' }, rateP);
  const dateLine = dateP ? el('div', { class: 'conv-date small muted' }) : null;
  const notes = noteEls.map((p) => el('div', { class: 'conv-msg small muted' }, p));
  conv.append(...shellRows, rateLine, ...notes);
  block.replaceChildren(el('div', { class: 'container' }, conv));

  let rates;
  try { rates = await loadRates(); } catch { conv.setAttribute('aria-disabled', 'true'); return; }

  const code = (p, fallback) => (p?.value.textContent.trim().match(/^[A-Z]{3}/) || [fallback])[0];
  const find = (c) => rates.find((x) => x.currencyCode === c);
  let from = find(code(fromP, 'NOK')) || find('NOK'); let to = find(code(toP, 'EUR')) || find('EUR');
  const options = (selected) => rates.map((x) => el('option', { value: x.currencyCode, selected: x === selected }, `${x.currencyCode} - ${x.currencyName}`));
  const fromSel = el('select', { class: 'conv-select', id: 'conv-from' }, options(from));
  const toSel = el('select', { class: 'conv-select', id: 'conv-to' }, options(to));
  const amount = el('input', { class: 'input conv-amount', id: 'conv-amount', type: 'text', inputmode: 'decimal', maxlength: '12', value: amountP ? amountP.value.textContent.trim() : '100' });
  const result = el('output', { class: 'conv-out conv-result num', id: 'conv-result', for: 'conv-from conv-to conv-amount', 'aria-live': 'polite' });
  const swap = el('button', { class: 'conv-swap', type: 'button', 'aria-label': 'Bytt valuta' }, el('span', { 'aria-hidden': 'true' }, '⇅'));
  const labelled = (p, ctl) => { if (!p) return null; const id = `${ctl.id}-label`; ctl.setAttribute('aria-labelledby', id); return el('div', { class: 'label', id }, p.label); };
  // the amount and result carry the currency code as their accessible name (the authored row labels stay, visually hidden)
  const hiddenLabel = (p) => (p ? el('div', { class: 'visually-hidden' }, p.label) : null);

  const update = () => {
    const n = parseAmount(amount.value);
    result.textContent = Number.isFinite(n) ? convert(n, from, to).toFixed(2) : '';
    rateLine.replaceChildren(el('p', {}, `1 ${to.currencyCode} = ${unitRate(from, to).toFixed(2)} ${from.currencyCode}`));
    amount.setAttribute('aria-label', from.currencyCode); result.setAttribute('aria-label', to.currencyCode);
  };
  fromSel.addEventListener('change', () => { from = find(fromSel.value); update(); });
  toSel.addEventListener('change', () => { to = find(toSel.value); update(); });
  amount.addEventListener('input', update);
  swap.addEventListener('click', () => { [from, to] = [to, from]; fromSel.value = from.currencyCode; toSel.value = to.currencyCode; update(); });

  const updated = Math.max(...rates.map((x) => Number(x.lastUpdatedDateAndTime) || 0));
  conv.dataset.snapshot = siteConfig.currencyRates?.enabled ? 'live' : new Date(updated * 1000).toISOString();
  if (dateLine) {
    dateP.label.append(` ${new Date(updated * 1000).toLocaleDateString('no-NO', { day: 'numeric', month: 'long', year: 'numeric' })}`);
    dateLine.append(dateP.label);
  }
  conv.replaceChildren(
    el('div', { class: 'conv-row' },
      el('div', { class: 'conv-field' }, labelled(fromP, fromSel), fromSel),
      el('div', { class: 'conv-field' }, hiddenLabel(amountP), amount)),
    el('div', { class: 'conv-swap-row' }, swap),
    el('div', { class: 'conv-row' },
      el('div', { class: 'conv-field' }, labelled(toP, toSel), toSel),
      el('div', { class: 'conv-field' }, hiddenLabel(resultP), result)),
    rateLine, dateLine, ...notes,
  );
  update();
}
