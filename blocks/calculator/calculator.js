import { el } from '../../scripts/sb1.js';
import config from '../../scripts/site-config.js';
import {
  annuityLoan, economyRequest, formatNumber, parseNumber,
} from '../../scripts/calc-math.js';

/**
 * calculator — the boliglånskalkulator (dynamics #7), two tabs.
 * Rows, in order: [Faner | <ul> tab labels] · tab 1: [group legend | <ul> option labels] ×3 (låntakere, barn, biler) · [field label |
 * value] ×2 (inntekt, gjeld) · [result label | result value] (the segment's LAST two-cell row) · optional [Gebyrer | establishment |
 * monthly] · optional tab 2, opened by a one-cell row holding the second tab's label: [label | value] ×5 (kjøpesum, egenkapital, ønsket
 * lånebeløp, nominell rente, nedbetalingstid) · [result label | value] · optional [Gebyrer | establishment | monthly] · [CTAs] ·
 * [note] ×N (a note starting "Priseksempel" is recomputed per tab). Every authored paragraph and list is MOVED into the widget.
 * Behaviour lifted from the source widget (sb1-lanekalkulator.js + window.sparebank1Config):
 *   tab 2 "Hvor mye koster lånet?" — client-side annuity (scripts/calc-math.js, verified 90/90 against the source's annuity-loan
 *   service): monthly amount, effective rate, cost after tax deduction, equity share, payment plan by year → month, price example.
 *   tab 1 "Hvor mye kan jeg låne?" — the lending capacity is the source's SIFO/tax/stress-test model (economy service), which cannot
 *   be called cross-origin (#7a, scripts/site-config.js `loanEconomy`): the authored result is the service's answer for the authored
 *   inputs; other inputs POST to the service once the owner enables it, until then the result says it is not connected here.
 * Missing tab-2 rows fall back to the source's captured configuration (window.sparebank1Config.costOfLoan, 2026-10-15).
 * @ew-exempt computed results, effective-rate / equity / price-example strings and payment-plan table (source widget strings, values
 * computed); the not-connected note (interim copy, dynamics #7a)
 */
const T = {
  effektiv: 'Tilsvarer {rate} % effektiv rente',
  etterSkatt: 'Kostnad etter skattefradrag {amount} kr',
  egenkapital: 'Egenkapital',
  laanetAv: 'Lånet er {percent} % av boligens verdi',
  plan: 'Vis nedbetalingsplan',
  th: ['Dato', 'Å betale', 'Avdrag', 'Renter + Gebyrer', 'Restgjeld'],
  total: 'Total',
  priseksempel: 'Priseksempel: Nominell rente {nominalRate} %. Effektiv rente {effectiveRate} %. Låner du {loanAmount} over {years} år koster lånet {loanCost} og du betaler totalt {totalAmount} kroner.',
  info: 'Nominell rente er den løpende renten du får. Den effektive renten viser i tillegg alle gebyrer og andre utgifter i forbindelse med lånet.',
  notConnected: 'Beregningen av lånebeløp er ikke koblet til på denne siden ennå.',
  notConnectedLink: 'Prøv lånekalkulatoren på sparebank1.no',
};
// window.sparebank1Config on the source pages (lanekalkulator + boliglan, captured 2026-10-15)
const SOURCE_CONFIG = {
  howMuchLoan: {
    rate: 5.33, years: 25, establishment: 1500, monthly: 50,
  },
  costOfLoan: {
    price: 3000000, equity: 300000, rate: 5.33, years: 25, establishment: 2900, monthly: 50,
  },
};
const MIN_LOAN = 10000;
const fill = (tpl, vals) => Object.entries(vals).reduce((s, [k, v]) => s.replace(`{${k}}`, v), tpl);
const kr0 = (n) => formatNumber(Math.round(n));

let uid = 0;
export default function decorate(block) {
  uid += 1;
  const rows = [...block.children];
  const p = (cell) => cell?.querySelector('p') || cell;
  const tabRow = rows.find((r) => r.children.length === 2 && r.children[1].querySelector('ul') && /faner/i.test(r.children[0].textContent));
  const tabLis = tabRow ? [...tabRow.children[1].querySelectorAll('li')] : [];
  const tab2Label = tabLis[1]?.textContent.trim();
  const segs = [{ pills: [], fields: [], fees: null }, { pills: [], fields: [], fees: null }];
  const ctas = []; const notes = []; let priseksempel = null;
  let seg = 0;
  rows.forEach((r) => {
    if (r === tabRow) return;
    const cells = [...r.children];
    if (cells.length === 1 && tab2Label && cells[0].textContent.trim() === tab2Label) { seg = 1; return; }
    if (cells.length >= 3) { segs[seg].fees = [parseNumber(cells[1].textContent), parseNumber(cells[2].textContent)]; return; }
    if (cells.length === 2 && cells[1].querySelector('ul')) { segs[seg].pills.push({ legend: p(cells[0]), ul: cells[1].querySelector('ul') }); return; }
    if (cells.length === 2) { segs[seg].fields.push({ label: p(cells[0]), value: p(cells[1]) }); return; }
    if (cells[0].querySelector('a')) { ctas.push(...cells[0].children); return; }
    [...cells[0].children].forEach((n) => { if (/^Priseksempel/i.test(n.textContent.trim())) priseksempel = n; else notes.push(n); });
  });
  const result1 = segs[0].fields.pop(); const result2 = segs[1].fields.length > 5 ? segs[1].fields.pop() : null;

  /* ---------------------------------------------------------------- tab 1: how much can I borrow */
  const s1 = {
    ...SOURCE_CONFIG.howMuchLoan, ...(segs[0].fees ? { establishment: segs[0].fees[0], monthly: segs[0].fees[1] } : {}),
  };
  const pillValues = segs[0].pills.map(({ ul }) => [...ul.children].map((li) => parseInt(li.textContent, 10) || 0));
  const choice = segs[0].pills.map(() => 0);
  const pillGroups = segs[0].pills.map(({ legend, ul }, g) => {
    const id = `calc-${uid}-g${g}`;
    legend.id = id;
    const btns = [...ul.children].map((li, i) => {
      const b = el('button', { type: 'button', class: 'pill', 'aria-pressed': String(i === 0) }, ...li.childNodes);
      // eslint-disable-next-line no-use-before-define
      b.addEventListener('click', () => { choice[g] = i; btns.forEach((x, j) => x.setAttribute('aria-pressed', String(i === j))); updateEconomy(); });
      return b;
    });
    return el('div', { class: 'calc-pills', role: 'group', 'aria-labelledby': id }, el('div', { class: 'label' }, legend), el('div', { class: 'pill-row' }, ...btns));
  });
  const moneyInput = (f, k) => {
    const id = `calc-${uid}-${k}`;
    const input = el('input', {
      id, type: 'text', inputmode: 'numeric', class: 'calc-input num', value: kr0(parseNumber(f.value.textContent)) || '',
    });
    const node = el('div', { class: 'field' }, el('label', { class: 'label', for: id }, f.label), el('div', { class: 'input-wrap' }, input, el('span', { class: 'unit', 'aria-hidden': 'true' }, 'kr')));
    return { input, node, authored: parseNumber(f.value.textContent) };
  };
  const t1Fields = segs[0].fields.map((f, i) => moneyInput(f, ['inntekt', 'gjeld'][i] || `f${i}`));
  const result1Value = el('div', { class: 'calc-result-value', 'aria-live': 'polite' });
  const authoredResult1 = result1 ? parseNumber(result1.value.textContent) : NaN;
  const t1Note = el('p', { class: 'calc-not-connected', hidden: true }, `${T.notConnected} `, el('a', { href: config.loanEconomy.sourceCalculator }, T.notConnectedLink));
  const panel1 = el('div', { class: 'calc-panel', role: 'tabpanel' },
    el('div', { class: 'calc-groups' }, ...pillGroups),
    el('div', { class: 'calc-fields' }, ...t1Fields.map((f) => f.node)),
    el('div', { class: 'calc-result' }, el('div', { class: 'calc-result-label' }, result1?.label), result1Value, t1Note));

  /* ---------------------------------------------------------------- tab 2: what does the loan cost */
  const c = SOURCE_CONFIG.costOfLoan;
  const f2 = segs[1].fields;
  const authored2 = (i, d) => { const v = f2[i] ? parseNumber(f2[i].value.textContent) : NaN; return Number.isFinite(v) ? v : d; };
  const s2 = {
    price: authored2(0, c.price), equity: authored2(1, c.equity), rate: authored2(3, c.rate), years: authored2(4, c.years), establishment: segs[1].fees?.[0] ?? c.establishment, monthly: segs[1].fees?.[1] ?? c.monthly,
  };
  const lbl = (i, d) => f2[i]?.label || el('p', {}, d);
  const mk = (k, label, value, unit, extra = {}) => {
    const id = `calc-${uid}-${k}`;
    const input = el('input', {
      id, type: 'text', inputmode: extra.decimal ? 'decimal' : 'numeric', class: 'calc-input num', value,
    });
    return { input, node: el('div', { class: `field field--${k}` }, el('label', { class: 'label', for: id }, label), el('div', { class: 'input-wrap' }, input, el('span', { class: 'unit', 'aria-hidden': 'true' }, unit))) };
  };
  const price = mk('kjopesum', lbl(0, 'Kjøpesum'), kr0(s2.price), 'kr');
  const equity = mk('egenkapital', lbl(1, 'Egenkapital'), kr0(s2.equity), 'kr');
  const loan = mk('lanebelop', lbl(2, 'Ønsket lånebeløp'), kr0(s2.price - s2.equity), 'kr');
  const rate = mk('rente', lbl(3, 'Nominell rente'), formatNumber(s2.rate, 2), '%', { decimal: true });
  const years = mk('nedbetalingstid', lbl(4, 'Nedbetalingstid'), String(s2.years), 'år');
  const rateRange = el('input', {
    type: 'range', min: '0.01', max: '10', step: '0.01', value: String(s2.rate), class: 'calc-range', 'aria-label': rate.node.querySelector('label').textContent,
  });
  const yearsRange = el('input', {
    type: 'range', min: '1', max: '30', step: '1', value: String(s2.years), class: 'calc-range', 'aria-label': years.node.querySelector('label').textContent,
  });
  rate.node.insertBefore(el('div', { class: 'range-row' }, el('span', { class: 'range-end' }, '0,01 %'), rateRange, el('span', { class: 'range-end' }, '10,00 %')), rate.node.lastChild);
  years.node.insertBefore(el('div', { class: 'range-row' }, el('span', { class: 'range-end' }, '1 år'), yearsRange, el('span', { class: 'range-end' }, '30 år')), years.node.lastChild);
  const info = el('p', { class: 'calc-info small' }, T.info);
  const effRate = el('p', { class: 'calc-eff small', 'aria-live': 'polite' });
  rate.node.append(effRate);
  const result2Label = result2?.label || el('p', {}, 'Månedlig beløp');
  const result2Value = el('div', { class: 'calc-result-value', 'aria-live': 'polite' });
  const afterTax = el('p', { class: 'calc-sub' });
  const equityShare = el('div', { class: 'calc-equity' });
  const planId = `calc-${uid}-plan`;
  const planBtn = el('button', {
    type: 'button', class: 'calc-plan-toggle arrow', 'aria-expanded': 'false', 'aria-controls': planId,
  }, T.plan);
  const planBox = el('div', { class: 'calc-plan', id: planId, hidden: true });
  let schedule = null;
  // eslint-disable-next-line no-use-before-define
  planBtn.addEventListener('click', () => { const open = planBtn.getAttribute('aria-expanded') === 'true'; planBtn.setAttribute('aria-expanded', String(!open)); planBox.hidden = open; if (!open && schedule) renderPlan(schedule); });
  const panel2 = el('div', { class: 'calc-panel', role: 'tabpanel', hidden: true },
    el('div', { class: 'calc-fields calc-fields--cost' }, price.node, equity.node, loan.node, rate.node, info, years.node),
    el('div', { class: 'calc-result' }, el('div', { class: 'calc-result-label' }, result2Label), result2Value, afterTax, equityShare));

  /* ---------------------------------------------------------------- shared: tabs, CTAs, notes, price example */
  const tabs = el('div', { class: 'calc-tabs', role: 'tablist', 'aria-label': 'Velg kalkulator' });
  const panels = [panel1, panel2];
  const tabBtns = tabLis.map((li, i) => {
    const b = el('button', {
      type: 'button', role: 'tab', class: 'calc-tab', id: `calc-${uid}-tab${i}`, 'aria-selected': String(i === 0), tabindex: i ? '-1' : '0',
    }, ...li.childNodes);
    panels[i]?.setAttribute('aria-labelledby', b.id);
    return b;
  });
  tabs.append(...tabBtns);
  const priceExample = el('div', { class: 'calc-note calc-priseksempel', 'aria-live': 'polite' }, priseksempel || el('p'));
  const peP = priceExample.firstElementChild;
  const calc = el('div', { class: 'calc', 'data-dynamics': '7' },
    tabBtns.length ? tabs : null, panel1, panel2,
    ctas.length ? el('div', { class: 'calc-ctas' }, ...ctas) : null,
    ...notes.map((n) => el('div', { class: 'calc-note' }, n)),
    el('div', { class: 'calc-plan-wrap', hidden: true }, planBtn, planBox),
    priceExample);
  const planWrap = calc.querySelector('.calc-plan-wrap');
  block.replaceChildren(el('div', { class: 'container calc-wrap' }, calc));

  const showPriceExample = (r, term) => {
    peP.textContent = fill(T.priseksempel, {
      nominalRate: formatNumber(r.rate, 2), effectiveRate: formatNumber(r.effectiveAnnualRate, 2), loanAmount: kr0(r.loanAmount), years: term, loanCost: kr0(r.totalInterest + r.totalFees), totalAmount: kr0(r.totalAmountPaid),
    });
  };
  const now = new Date();
  const annuity = (purchasePrice, eq, r, y, est, mon) => ({
    ...annuityLoan({
      purchasePrice, equity: eq, interestRate: r, feeEstablishment: est, feeMonthly: mon, taxDeductionRate: 0.22, loanTermYears: y, loanRaisingYear: now.getFullYear(), loanRaisingMonth: now.getMonth() + 1,
    }),
    rate: r,
  });

  /* tab 1 compute */
  let econSeq = 0;
  const authoredResultNode = result1?.value;
  const showResult1 = (amount, authored = false) => {
    t1Note.hidden = amount !== null;
    if (authored && authoredResultNode) { authoredResultNode.classList.add('num'); result1Value.replaceChildren(authoredResultNode); } else result1Value.replaceChildren(amount === null ? '' : el('p', { class: 'num' }, `${kr0(amount)} kr`));
    if (amount && amount > 0) showPriceExample(annuity(amount, 0, s1.rate, s1.years, s1.establishment, s1.monthly), s1.years);
    priceExample.hidden = !(amount > 0);
  };
  function updateEconomy() {
    const values = choice.map((i, g) => pillValues[g][i]);
    const nums = t1Fields.map((f) => parseNumber(f.input.value));
    const isDefault = choice.every((i) => i === 0) && nums.every((n, i) => n === t1Fields[i].authored);
    if (isDefault && Number.isFinite(authoredResult1)) { showResult1(authoredResult1, true); return; }
    if (!config.loanEconomy.enabled) { showResult1(null); return; }
    const seq = ++econSeq; // eslint-disable-line no-plusplus
    const body = economyRequest({
      borrowers: values[0] || 1, children: values[1] || 0, cars: values[2] || 0, income: nums[0] || 0, debt: nums[1] || 0, interestRate: s1.rate, feeMonthly: s1.monthly, loanTermYears: s1.years, feeEstablishment: s1.establishment,
    });
    fetch(config.loanEconomy.url, { method: 'POST', headers: { 'content-type': 'application/json', accept: 'application/vnd.sparebank1.v1+json' }, body: JSON.stringify(body) })
      .then((r) => (r.ok ? r.json() : Promise.reject(r.status)))
      .then((j) => { if (seq === econSeq) showResult1(j.displayedAdjustedMaxLoanAmount); })
      .catch(() => { if (seq === econSeq) showResult1(null); });
  }
  t1Fields.forEach((f) => {
    f.input.addEventListener('input', () => updateEconomy());
    f.input.addEventListener('change', () => { const v = parseNumber(f.input.value); f.input.value = Number.isFinite(v) ? kr0(v) : ''; updateEconomy(); });
  });

  /* tab 2 compute */
  const st = {
    price: s2.price, equity: s2.equity, rate: s2.rate, years: s2.years,
  };
  function renderPlan(sched) {
    const byYear = [];
    sched.forEach((m) => {
      let y = byYear[byYear.length - 1];
      if (!y || y.year !== m.year) { y = { year: m.year, months: [] }; byYear.push(y); }
      y.months.push(m);
    });
    const sum = (list, f) => list.reduce((s, m) => s + f(m), 0);
    const row = (cells, cls) => el('tr', { class: cls }, ...cells.map((v, i) => el(i ? 'td' : 'th', { scope: i ? null : 'row' }, v)));
    const body = el('tbody');
    byYear.forEach((y) => {
      const btn = el('button', { type: 'button', class: 'calc-year', 'aria-expanded': 'false' }, String(y.year));
      const months = y.months.map((m) => row([`${m.year}-${m.month}`, kr0(m.payment), kr0(m.principal), kr0(m.interest + m.fee), kr0(m.balance)], 'calc-month'));
      months.forEach((m) => { m.hidden = true; });
      btn.addEventListener('click', () => { const open = btn.getAttribute('aria-expanded') === 'true'; btn.setAttribute('aria-expanded', String(!open)); months.forEach((m) => { m.hidden = open; }); });
      const yr = row(['', kr0(sum(y.months, (m) => m.payment)), kr0(sum(y.months, (m) => m.principal)), kr0(sum(y.months, (m) => m.interest + m.fee)), kr0(y.months[y.months.length - 1].balance)], 'calc-yearrow');
      yr.firstElementChild.append(btn);
      body.append(yr, ...months);
    });
    body.append(row([el('strong', {}, T.total), el('strong', {}, kr0(sum(sched, (m) => m.payment))), el('strong', {}, kr0(sum(sched, (m) => m.principal))), el('strong', {}, kr0(sum(sched, (m) => m.interest + m.fee))), el('strong', {}, '0')], 'calc-totalrow'));
    planBox.replaceChildren(el('div', { class: 'calc-plan-scroll' }, el('table', {}, el('thead', {}, el('tr', {}, ...T.th.map((h) => el('th', { scope: 'col' }, h)))), body)));
  }
  const updateCost = () => {
    const loanAmount = st.price - st.equity;
    const ok = loanAmount >= MIN_LOAN && st.price > 0;
    [result2Value, afterTax, equityShare, effRate].forEach((n) => { n.hidden = !ok; });
    planWrap.hidden = !ok || panel2.hidden;
    if (!ok) { priceExample.hidden = true; return; }
    const r = annuity(st.price, st.equity, st.rate, st.years, s2.establishment, s2.monthly);
    result2Value.replaceChildren(el('p', { class: 'num' }, `${kr0(r.monthlyPayment)} kr`));
    effRate.textContent = fill(T.effektiv, { rate: formatNumber(r.effectiveAnnualRate, 2) });
    afterTax.textContent = fill(T.etterSkatt, { amount: kr0(r.monthlyNetPayment) });
    equityShare.replaceChildren(el('p', { class: 'calc-equity-label' }, T.egenkapital), el('p', { class: 'num calc-equity-value' }, `${formatNumber((st.equity / st.price) * 100, 2)} %`), el('p', { class: 'small' }, fill(T.laanetAv, { percent: formatNumber(r.debtRatio, 2) })));
    showPriceExample(r, st.years);
    priceExample.hidden = false;
    schedule = r.amortizationSchedule;
    if (!planBox.hidden) renderPlan(schedule); // the plan renders only while open
  };
  const setNum = (input, v, d = 0) => { input.value = Number.isFinite(v) ? formatNumber(v, d) : ''; };
  price.input.addEventListener('change', () => { st.price = Math.max(0, parseNumber(price.input.value) || 0); st.equity = Math.min(st.equity, st.price); setNum(price.input, st.price); setNum(equity.input, st.equity); setNum(loan.input, st.price - st.equity); updateCost(); });
  equity.input.addEventListener('change', () => { st.equity = Math.min(Math.max(0, parseNumber(equity.input.value) || 0), st.price); setNum(equity.input, st.equity); setNum(loan.input, st.price - st.equity); updateCost(); });
  loan.input.addEventListener('change', () => { const l = Math.min(Math.max(0, parseNumber(loan.input.value) || 0), st.price); st.equity = st.price - l; setNum(loan.input, l); setNum(equity.input, st.equity); updateCost(); });
  const setRate = (v) => { st.rate = Math.min(10, Math.max(0.01, Number.isFinite(v) ? v : st.rate)); rateRange.value = String(st.rate); setNum(rate.input, st.rate, 2); updateCost(); };
  rateRange.addEventListener('input', () => setRate(Number(rateRange.value)));
  rate.input.addEventListener('change', () => setRate(parseNumber(rate.input.value)));
  const setYears = (v) => { st.years = Math.min(30, Math.max(1, Math.round(Number.isFinite(v) ? v : st.years))); yearsRange.value = String(st.years); years.input.value = String(st.years); updateCost(); };
  yearsRange.addEventListener('input', () => setYears(Number(yearsRange.value)));
  years.input.addEventListener('change', () => setYears(parseNumber(years.input.value)));

  /* tabs */
  const showTab = (i) => {
    tabBtns.forEach((b, j) => { b.setAttribute('aria-selected', String(i === j)); b.tabIndex = i === j ? 0 : -1; });
    panels.forEach((pn, j) => { pn.hidden = i !== j; });
    planWrap.hidden = i !== 1;
    if (i === 1) updateCost(); else updateEconomy();
  };
  tabBtns.forEach((b, i) => {
    b.addEventListener('click', () => showTab(i));
    b.addEventListener('keydown', (e) => {
      if (!['ArrowLeft', 'ArrowRight'].includes(e.key)) return;
      const j = (i + (e.key === 'ArrowRight' ? 1 : tabBtns.length - 1)) % tabBtns.length;
      tabBtns[j].focus(); showTab(j);
    });
  });
  block.dataset.economy = config.loanEconomy.enabled ? 'connected' : 'not-connected';
  showTab(0);
}
