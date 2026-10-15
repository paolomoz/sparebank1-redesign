import { el, icon } from '../../scripts/sb1.js';
import siteConfig from '../../scripts/site-config.js';

/**
 * converter — the currency converter (dynamics #9). Rows, in order: [from label | from currency "NOK Norske kroner"] ·
 * [amount label | default amount] · [to label | to currency "EUR Euro"] · [result label | captured result] · [rate line] · [note] ×N.
 * Labels are MOVED into the fields; the captured result and rate line are recomputed (their authored text is the no-JS fallback).
 *
 * Rates: the page's own "Valutakursliste" table block (Valuta | Kunde selger | Kunden kjøper | Per) — the authored, dated copy of
 * the source's rate feed. The live feed (scripts/site-config.js `currencyRates`) is same-origin only on the source host and stays
 * disabled until the owner connects it. Formula = the source widget's (clientlib_base module 9366, transfer rates):
 * result = amount × (from.buy / from.unit) ÷ (to.sell / to.unit); rate line 1 TO = (to.buy / to.unit) ÷ (from.sell / from.unit) FROM.
 * @ew-exempt error message, swap button name — the source widget's data-* strings (fixed widget chrome, not page copy)
 */
const ERROR = 'Vi er lei for det, men valutakalkulatoren vår virker ikke for øyeblikket. Kom tilbake litt senere.';
const NOK = { code: 'NOK', name: 'Norske kroner', buy: 1, sell: 1, unit: 1 };
const text = (n) => (n ? n.textContent.replace(/\s+/g, ' ').trim() : '');
const num = (s) => Number(String(s).replace(/\s/g, '').replace(/,/g, '.'));
const splitCurrency = (s) => { const m = text({ textContent: s }).match(/^([A-Z]{3})\s*(.*)$/); return m ? { code: m[1], name: m[2] } : null; };

/** Rates from the page's rate table — raw block rows (not yet decorated) or the decorated <table>. */
function ratesFromDocument(main) {
  const rates = new Map([[NOK.code, NOK]]);
  main.querySelectorAll('.table').forEach((tb) => {
    const table = tb.querySelector('table');
    const rows = table ? [...table.rows].map((tr) => [...tr.cells].map(text)) : [...tb.children].map((r) => [...r.children].map(text));
    const head = rows.findIndex((cells) => cells.some((c) => /selger/i.test(c)) && cells.some((c) => /kjøper/i.test(c)));
    if (head < 0) return;
    rows.slice(head + 1).forEach(([cur, buy, sell, unit]) => {
      const c = splitCurrency(cur || '');
      if (c && num(buy) > 0 && num(sell) > 0) rates.set(c.code, { ...c, buy: num(buy), sell: num(sell), unit: num(unit) || 1 });
    });
  });
  return rates.size > 1 ? rates : null;
}

async function ratesFromFeed({ enabled, endpoint }) {
  if (!enabled || !endpoint) return null;
  try {
    const list = await (await fetch(endpoint)).json();
    const rates = new Map(list.map((r) => [r.currencyCode, { code: r.currencyCode, name: r.currencyName, buy: r.buyCurrencyChequeRate, sell: r.sellCurrencyChequeRate, unit: r.unitNumber }]));
    return rates.size > 1 ? rates : null;
  } catch { return null; }
}

export const convert = (amount, from, to) => amount * (from.buy / from.unit) / (to.sell / to.unit);
export const rateLine = (from, to) => (to.buy / to.unit) / (from.sell / from.unit);

export default async function decorate(block) {
  const rows = [...block.children];
  const cells = rows.map((r) => [...r.children]);
  const pairs = cells.filter((c) => c.length > 1);
  const singles = cells.filter((c) => c.length === 1).map(([c]) => c);
  const [[fromLabel, fromCell] = [], [amountLabel, amountCell] = [], [toLabel, toCell] = [], [resultLabel, resultCell] = []] = pairs;
  const [rateCell, ...noteCells] = singles;
  const conv = el('div', { class: 'conv', 'data-dynamics': '9' });
  const moved = (cell) => cell?.querySelector('p') || cell;

  const feed = await ratesFromFeed(siteConfig.currencyRates || {});
  const rates = feed || ratesFromDocument(block.closest('main') || document);
  const notes = noteCells.map((c) => el('div', { class: 'conv-msg small muted' }, ...[...c.childNodes]));
  if (!rates) { // static shell (the authored values) + the source's error state
    [[fromLabel, fromCell], [amountLabel, amountCell], [toLabel, toCell], [resultLabel, resultCell]].forEach(([a, b], i) => {
      if (!a) return;
      if (i % 2 === 0) conv.append(el('div', { class: 'conv-row' }));
      conv.lastChild.append(el('div', { class: 'conv-field' }, el('div', { class: 'label' }, moved(a)), el('div', { class: 'conv-out num', 'aria-readonly': 'true' }, moved(b))));
    });
    conv.append(el('p', { class: 'conv-error', role: 'alert' }, ERROR), ...notes);
    block.dataset.rates = 'none';
    block.replaceChildren(el('div', { class: 'container' }, conv));
    return;
  }

  const options = [...rates.values()];
  const select = (id, code) => {
    const s = el('select', { class: 'conv-select', id, name: id === 'conv-from' ? 'fra' : 'til' }, ...options.map((r) => el('option', { value: r.code }, `${r.code} - ${r.name}`)));
    s.value = rates.has(code) ? code : options[0].code;
    return s;
  };
  // linked state (?fra=USD&til=SEK&belop=100 — the controls' own names) overrides the authored defaults
  const linked = new URLSearchParams(window.location.search);
  const fromSel = select('conv-from', linked.get('fra')?.toUpperCase() || splitCurrency(text(fromCell))?.code || 'NOK');
  const toSel = select('conv-to', linked.get('til')?.toUpperCase() || splitCurrency(text(toCell))?.code || 'EUR');
  const amountLbl = el('label', { class: 'label', for: 'conv-amount' }, moved(amountLabel));
  const amount = el('input', { class: 'conv-in num', id: 'conv-amount', name: 'belop', type: 'text', inputmode: 'decimal', maxlength: '12', value: linked.get('belop') || text(amountCell) || '100', autocomplete: 'off' });
  const resultLbl = el('div', { class: 'label', id: 'conv-result-label' }, moved(resultLabel));
  const result = el('output', { class: 'conv-out num', for: 'conv-amount conv-from conv-to', 'aria-labelledby': 'conv-result-label', 'aria-live': 'polite' });
  const rate = el('div', { class: 'conv-rate num' }, moved(rateCell) || el('p'));
  const ratePara = rate.querySelector('p') || rate;
  const swap = el('button', { class: 'conv-swap', type: 'button', 'aria-label': 'Bytt valuta' }, icon('swap'));

  const render = () => {
    const from = rates.get(fromSel.value); const to = rates.get(toSel.value);
    let v = amount.value; if (Number.isNaN(Number(v))) v = num(v.replace(/[^\d.,-]/g, ''));
    const out = convert(Number(v), from, to);
    result.textContent = Number.isFinite(out) ? out.toFixed(2) : '';
    amountLbl.firstElementChild.textContent = from.code; resultLbl.firstElementChild.textContent = to.code;
    ratePara.textContent = `1 ${to.code} = ${rateLine(from, to).toFixed(2)} ${from.code}`;
  };
  [fromSel, toSel].forEach((s) => s.addEventListener('change', render));
  amount.addEventListener('input', render);
  swap.addEventListener('click', () => { [fromSel.value, toSel.value] = [toSel.value, fromSel.value]; render(); });

  conv.append(
    el('div', { class: 'conv-row' },
      el('div', { class: 'conv-field' }, el('label', { class: 'label', for: 'conv-from' }, moved(fromLabel)), fromSel),
      el('div', { class: 'conv-field' }, amountLbl, amount)),
    el('div', { class: 'conv-swap-row' }, swap),
    el('div', { class: 'conv-row' },
      el('div', { class: 'conv-field' }, el('label', { class: 'label', for: 'conv-to' }, moved(toLabel)), toSel),
      el('div', { class: 'conv-field' }, resultLbl, result)),
    rate, ...notes,
  );
  block.dataset.rates = feed ? 'feed' : 'document';
  block.dataset.currencies = String(rates.size);
  block.replaceChildren(el('div', { class: 'container' }, conv));
  render();
}
