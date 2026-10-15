import { el, icon } from '../../scripts/sb1.js';
import siteConfig from '../../scripts/site-config.js';
import { annuityLoan } from './loan-math.js';

/**
 * calculator — the loan calculator (dynamics #7). Rows, in order:
 * [Faner | <ul> tab labels] · then per tab its rows; a single-cell row whose text is a tab label starts that tab (rows before the
 * first separator belong to the first tab).
 * Tab "Hvor mye kan jeg låne?" (economy): [group legend | <ul> options] ×N · [field label | value] ×N · [result label | value] (the LAST
 * two-cell row) · optional [Gebyrer | establishment | monthly] · [CTAs] · [note] ×N (the last note with ≥ 5 numbers = price example).
 * Its result is SpareBank 1's lending model behind the host-bound /economy API: until the owner enables `loanCalculator` in
 * scripts/site-config.js (same-origin on the production host) the tab is the captured example, controls inert.
 * Tab "Hvor mye koster lånet?" (cost): [Kjøpesum | kr] · [Egenkapital | kr] · [Ønsket lånebeløp | kr] · [Nominell rente | % | hint
 * "Tilsvarer … % effektiv rente"] · [Nedbetalingstid | år] · [Gebyrer | establishment | monthly] · [result label | value | sub-line]
 * ×2 (monthly amount; equity share) · [CTAs] · [note] ×N · optional [plan toggle | column headers… | total label] · price example.
 * Computed live client-side (loan-math.js — the API's annuity-loan, verified against recorded responses).
 * Every authored paragraph is MOVED into the widget; computed sentences keep their authored wording, only their numbers are replaced.
 * No exemptions.
 */
const NUM = /\d{1,3}(?:[ \u00a0\u202f.]\d{3})+(?:,\d+)?|\d+(?:,\d+)?/g;
const nb = new Intl.NumberFormat('nb-NO', { maximumFractionDigits: 0 });
const kr = (v) => nb.format(Math.round(v) + 0); // + 0: no "−0" from float residue
const pct = (v) => v.toFixed(2).replace('.', ',');
const parseNum = (s) => {
  const t = String(s || '').replace(/[^\d,.-]/g, '').replace(/\.(?=\d{3}(?!\d))/g, '').replace(',', '.');
  const n = parseFloat(t); return Number.isFinite(n) ? n : 0;
};
const textOf = (n) => (n ? n.textContent.replace(/\s+/g, ' ').trim() : '');
const para = (cell) => cell?.querySelector('p') || cell;
/** Replace the numbers of an authored sentence, in order. */
const fill = (node, values) => { if (!node) return; let i = 0; node.dataset.template ||= node.textContent; node.textContent = node.dataset.template.replace(NUM, (m) => (i < values.length ? values[i++] : m)); };
const isPriceExample = (n) => (textOf(n).match(NUM) || []).length >= 5;

/** Split the block rows into tabs. */
function readTabs(rows) {
  const tabsRow = rows.find((r) => /faner/i.test(textOf(r.children[0])) && r.children[1]?.querySelector('ul'));
  const labels = tabsRow ? [...tabsRow.children[1].querySelectorAll('li')].map(textOf) : [];
  const tabs = labels.map((label) => ({ label, rows: [] }));
  if (!tabs.length) tabs.push({ label: '', rows: [] });
  let cur = tabs[0];
  rows.forEach((r) => {
    if (r === tabsRow) return;
    const sep = r.children.length === 1 && tabs.find((t) => t.label && t.label === textOf(r));
    if (sep) { cur = sep; return; }
    cur.rows.push(r);
  });
  return { tabsRow, tabs };
}

/** Common tail of a tab: CTAs, notes, price example. */
function tail(rows) {
  let ctas = null; const notes = []; let example = null;
  rows.forEach((r) => {
    const [a] = r.children;
    if (r.children.length === 1 && a.querySelector('a')) { ctas = el('div', { class: 'calc-ctas' }, ...[...a.children]); return; }
    if (r.children.length === 1) [...(a.children.length ? a.children : [a])].forEach((p) => notes.push(p));
  });
  if (notes.length && isPriceExample(notes[notes.length - 1])) example = notes.pop();
  return { ctas, notes: notes.map((p) => el('div', { class: 'calc-note' }, p)), example: example ? el('div', { class: 'calc-note calc-example' }, example) : null };
}
const feesOf = (rows) => {
  const r = rows.find((x) => /gebyr/i.test(textOf(x.children[0])) && x.children.length >= 2);
  return r ? { row: r, establishment: parseNum(textOf(r.children[1])), monthly: parseNum(textOf(r.children[2])) } : null;
};

/** Economy tab — the captured shell (and, when the owner enables the API, the live flow). */
function economyPanel(rows, { costDefaults }) {
  const fees = feesOf(rows);
  const body = rows.filter((r) => r !== fees?.row);
  const twoCell = body.filter((r) => r.children.length === 2 && !r.querySelector('ul') && !r.querySelector('a'));
  const resultRow = twoCell[twoCell.length - 1];
  const groups = el('div', { class: 'calc-groups' }); const fields = el('div', { class: 'calc-fields' });
  const pills = []; const inputs = []; let result = null; let resultValue = null;
  body.forEach((r) => {
    const [a, b] = r.children;
    if (b && b.querySelector('ul')) {
      const ul = b.querySelector('ul'); const label = para(a);
      ul.classList.add('pill-row');
      const items = [...ul.children]; items.forEach((li, i) => { li.classList.add('pill'); if (!i) li.classList.add('is-on'); });
      pills.push({ label: textOf(label), items });
      groups.append(el('div', { class: 'calc-pills', role: 'group' }, el('div', { class: 'label' }, label), ul)); return;
    }
    if (r.children.length === 2 && !r.querySelector('a')) {
      const label = para(a); const value = para(b); value.classList.add('num');
      if (r === resultRow) { resultValue = value; result = el('div', { class: 'calc-result' }, el('div', { class: 'calc-result-label' }, label), el('div', { class: 'calc-result-value' }, value)); return; }
      inputs.push({ label: textOf(label), value });
      fields.append(el('div', { class: 'field' }, el('div', { class: 'label' }, label), el('div', { class: 'input' }, value)));
    }
  });
  const { ctas, notes, example } = tail(body.filter((r) => r.children.length === 1));
  const panel = el('div', { class: 'calc-panel calc-panel--economy' });
  [groups.children.length && groups, fields.children.length && fields, result, ctas, ...notes, example].forEach((n) => n && panel.append(n));

  const cfg = siteConfig.loanCalculator || {};
  if (!cfg.enabled || !cfg.endpoint || pills.length < 3 || inputs.length < 2 || !resultValue) {
    panel.setAttribute('aria-disabled', 'true'); panel.dataset.state = 'captured-example';
    return panel;
  }
  // Owner-enabled: the source's /economy request (bundle `sn()`), then the price example from the client annuity.
  panel.dataset.state = 'api';
  const state = { borrowers: 1, children: 0, cars: 0, income: parseNum(textOf(inputs[0].value)), debt: parseNum(textOf(inputs[1].value)) };
  const keys = ['borrowers', 'children', 'cars'];
  pills.forEach(({ items }, g) => items.forEach((li) => {
    const btn = el('button', { type: 'button', class: 'pill', 'aria-pressed': String(li.classList.contains('is-on')) }, ...li.childNodes);
    li.replaceWith(btn);
    btn.addEventListener('click', () => {
      btn.parentElement.querySelectorAll('.pill').forEach((p) => { p.classList.toggle('is-on', p === btn); p.setAttribute('aria-pressed', String(p === btn)); });
      state[keys[g]] = parseNum(btn.textContent); run();
    });
  }));
  inputs.forEach(({ value }, i) => {
    const inp = el('input', { type: 'text', inputmode: 'numeric', class: 'input is-live', value: nb.format(parseNum(textOf(value))), 'aria-label': textOf(value.closest('.field')?.querySelector('.label')) });
    value.closest('.input').replaceWith(inp);
    inp.addEventListener('input', () => { state[i ? 'debt' : 'income'] = parseNum(inp.value); run(); });
  });
  let seq = 0; let timer;
  function run() {
    clearTimeout(timer);
    timer = setTimeout(async () => {
      const my = ++seq; // eslint-disable-line no-plusplus
      if (state.income <= 0) return;
      const adults = [{ age: 35, gender: 'Male', grossSalary: state.income / state.borrowers, employmentStatus: 'Employed' }];
      if (state.borrowers === 2) adults.push({ age: 35, gender: 'Female', grossSalary: state.income / 2, employmentStatus: 'Employed' });
      const children = Array.from({ length: Math.min(state.children, 5) }, (_, i) => ({ age: 9, gender: i % 2 === 0 ? 'Female' : 'Male', kindergarden: false, afterSchoolCareFullTime: false, afterSchoolCarePartTime: true }));
      const body = { calculationDataset: 'Loke', adults, children: children.length ? children : undefined, numberOfPetrolCars: state.cars, numberOfElectricCars: 0, existingMortgage: state.debt, interestRate: costDefaults.rate, feeMonthly: fees?.monthly ?? 0, loanTermYears: costDefaults.years, feeEstablishment: fees?.establishment ?? 0 };
      try {
        const res = await fetch(`${cfg.endpoint}economy`, { method: 'POST', credentials: 'same-origin', headers: { 'Content-Type': 'application/json', Accept: 'application/vnd.sparebank1.v1+json' }, body: JSON.stringify(body) });
        if (!res.ok || my !== seq) return;
        const { displayedAdjustedMaxLoanAmount: max = 0 } = await res.json();
        resultValue.textContent = `${kr(max)} kr`;
        if (example) {
          example.hidden = !(max > 0);
          if (max > 0) {
            const a = annuityLoan({ purchasePrice: max, equity: 0, interestRate: costDefaults.rate, loanTermYears: costDefaults.years, feeEstablishment: fees?.establishment ?? 0, feeMonthly: fees?.monthly ?? 0 });
            fill(example.firstElementChild || example, [pct(costDefaults.rate), pct(a.effectiveAnnualRate), kr(max), String(costDefaults.years), kr(a.totalInterest + a.totalFees), kr(a.totalAmountPaid)]);
          }
        }
        const q = new URLSearchParams({ numberOfBorrowers: state.borrowers, numberOfChildren: state.children, numberOfCars: state.cars, grossAnnualIncome: state.income, existingLoan: state.debt, source: 'kalkulator' });
        ctas?.querySelectorAll('a').forEach((x) => { const u = new URL(x.href); u.search = q.toString(); x.href = u.href; });
      } catch { /* keep the last shown value */ }
    }, 500);
  }
  return panel;
}

/** Cost tab — live. */
function costPanel(rows) {
  const fees = feesOf(rows) || { establishment: 0, monthly: 0 };
  const body = rows.filter((r) => r !== fees.row);
  const data = body.filter((r) => r.children.length >= 2 && r.children.length <= 3 && !r.querySelector('a'));
  const planRow = body.find((r) => r.children.length >= 6);
  const [priceR, equityR, loanR, rateR, yearsR, ...resultRows] = data;
  if (!yearsR) return null;
  const { ctas, notes, example } = tail(body.filter((r) => r.children.length === 1));

  const money = (row, id) => {
    const label = para(row.children[0]);
    const input = el('input', { class: 'input is-live num', id, name: id, type: 'text', inputmode: 'numeric', autocomplete: 'off', value: nb.format(parseNum(textOf(row.children[1]))) });
    return { input, node: el('div', { class: 'field' }, el('label', { class: 'label', for: id }, label), el('div', { class: 'input-wrap' }, input, el('span', { class: 'suffix', 'aria-hidden': 'true' }, 'kr'))) };
  };
  const slider = (row, id, { min, max, step, unit, minLabel, maxLabel }) => {
    const label = para(row.children[0]); const v = parseNum(textOf(row.children[1]));
    const range = el('input', { type: 'range', class: 'calc-range', min, max, step, value: v, 'aria-label': textOf(label) });
    const input = el('input', { class: 'input is-live num', id, name: id, type: 'text', inputmode: 'decimal', autocomplete: 'off', value: unit === '%' ? pct(v) : String(v) });
    const hint = row.children[2] ? para(row.children[2]) : null; if (hint) hint.classList.add('calc-hint');
    const node = el('div', { class: 'field field--slider' }, el('label', { class: 'label', for: id }, label),
      el('div', { class: 'slider-row' }, el('div', { class: 'slider' }, range, el('div', { class: 'range-labels small', 'aria-hidden': 'true' }, el('span', {}, minLabel), el('span', {}, maxLabel))),
        el('div', { class: 'input-wrap' }, input, el('span', { class: 'suffix', 'aria-hidden': 'true' }, unit))), hint);
    return { range, input, hint, node };
  };
  const price = money(priceR, 'kjopesum'); const equity = money(equityR, 'egenkapital'); const loan = money(loanR, 'lanebelop');
  const rate = slider(rateR, 'nominell-rente', { min: '0.01', max: '10', step: '0.01', unit: '%', minLabel: '0,01 %', maxLabel: '10,00 %' });
  const years = slider(yearsR, 'nedbetalingstid', { min: '1', max: '30', step: '1', unit: 'år', minLabel: '1 år', maxLabel: '30 år' });
  const results = resultRows.slice(0, 2).map((r) => {
    const [a, b, c] = r.children; const value = para(b); value.classList.add('num'); const sub = c ? para(c) : null;
    return { value, sub, node: el('div', { class: 'calc-result' }, el('div', { class: 'calc-result-label' }, para(a)), el('div', { class: 'calc-result-value' }, value), sub && el('div', { class: 'calc-result-sub' }, sub)) };
  });

  // repayment plan (lazy): [toggle | Dato | Å betale | Avdrag | Renter + Gebyrer | Restgjeld | Total]
  let plan = null; let planWrap = null; let planBtn = null;
  if (planRow) {
    const [toggle, ...heads] = [...planRow.children].map(textOf);
    const totalLabel = heads.length > 5 ? heads.pop() : 'Total';
    planBtn = el('button', { type: 'button', class: 'button secondary calc-plan-toggle', 'aria-expanded': 'false', 'aria-controls': 'calc-plan' }, toggle, icon('down'));
    planWrap = el('div', { class: 'calc-plan', id: 'calc-plan', hidden: true });
    plan = { heads, totalLabel };
  }
  const state = { price: 0, equity: 0, rate: 0, years: 0 };
  const read = () => { state.price = parseNum(price.input.value); state.equity = parseNum(equity.input.value); state.rate = parseNum(rate.input.value); state.years = Math.round(parseNum(years.input.value)); };
  let last = null;
  const renderPlan = () => {
    if (!planWrap || planWrap.hidden || !last) return;
    const [d, pay, prin, intr, bal] = plan.heads;
    const table = el('table', { class: 'num' }, el('thead', {}, el('tr', {}, ...[d, pay, prin, intr, bal].map((h) => el('th', { scope: 'col' }, h)))));
    const byYear = new Map(); last.amortizationSchedule.forEach((s) => { if (!byYear.has(s.year)) byYear.set(s.year, []); byYear.get(s.year).push(s); });
    byYear.forEach((months, year) => {
      const sum = (k) => months.reduce((t, m) => t + m[k], 0);
      const tbody = el('tbody', { class: 'plan-year' });
      const btn = el('button', { type: 'button', class: 'plan-year-toggle', 'aria-expanded': 'false' }, icon('chevron'), String(year));
      tbody.append(el('tr', { class: 'plan-year-row' }, el('th', { scope: 'row' }, btn), el('td', {}, kr(sum('payment'))), el('td', {}, kr(sum('principal'))), el('td', {}, kr(sum('interest') + sum('fee'))), el('td', {}, kr(months[months.length - 1].balance))));
      months.forEach((m) => tbody.append(el('tr', { class: 'plan-month', hidden: true }, el('td', {}, `${m.year}-${String(m.month).padStart(2, '0')}`), el('td', {}, kr(m.payment)), el('td', {}, kr(m.principal)), el('td', {}, kr(m.interest + m.fee)), el('td', {}, kr(Math.max(m.balance, 0))))));
      btn.addEventListener('click', () => { const open = btn.getAttribute('aria-expanded') !== 'true'; btn.setAttribute('aria-expanded', String(open)); tbody.querySelectorAll('.plan-month').forEach((r) => { r.hidden = !open; }); });
      table.append(tbody);
    });
    table.append(el('tfoot', {}, el('tr', {}, el('th', { scope: 'row' }, plan.totalLabel), el('td', {}, kr(last.totalAmountPaid)), el('td', {}, kr(last.loanAmount)), el('td', {}, kr(last.totalInterest + last.totalFees)), el('td', {}, '0'))));
    planWrap.replaceChildren(el('div', { class: 'table-wrap' }, table));
  };
  const render = () => {
    const ok = state.price > 0 && state.price - state.equity >= 10000 && state.rate > 0 && state.years >= 1;
    last = ok ? annuityLoan({ purchasePrice: state.price, equity: state.equity, interestRate: state.rate, loanTermYears: state.years, feeEstablishment: fees.establishment, feeMonthly: fees.monthly }) : null;
    const [monthly, share] = results;
    if (monthly) { monthly.value.textContent = `${last ? kr(last.monthlyPayment) : 0} kr`; fill(monthly.sub, [last ? kr(last.monthlyNetPayment) : '0']); }
    if (share) { share.value.textContent = last ? `${pct((state.equity / state.price) * 100)} %` : '0'; fill(share.sub, [last ? pct(last.debtRatio) : '0']); }
    if (rate.hint) { rate.hint.hidden = !last; if (last) fill(rate.hint, [pct(last.effectiveAnnualRate)]); }
    if (example) { example.hidden = !last; if (last) fill(example.firstElementChild || example, [pct(state.rate), pct(last.effectiveAnnualRate), kr(last.loanAmount), String(state.years), kr(last.totalInterest + last.totalFees), kr(last.totalAmountPaid)]); }
    if (planBtn) planBtn.hidden = !last;
    if (last) {
      const q = new URLSearchParams({ borrowingAmount: last.loanAmount, purchasePrice: state.price, repaymentTerm: state.years, effectiveInterestRate: last.effectiveAnnualRate, monthlyPrice: last.monthlyPayment, source: 'kalkulator' });
      ctas?.querySelectorAll('a').forEach((x) => { const u = new URL(x.href); u.search = q.toString(); x.href = u.href; });
    }
    renderPlan();
  };
  const clampSet = (inp, v) => { inp.value = nb.format(Math.max(0, Math.min(v, state.price))); };
  price.input.addEventListener('input', () => { read(); clampSet(equity.input, state.equity); read(); loan.input.value = nb.format(Math.max(state.price - state.equity, 0)); render(); });
  equity.input.addEventListener('input', () => { read(); loan.input.value = nb.format(Math.max(state.price - Math.min(state.equity, state.price), 0)); render(); });
  loan.input.addEventListener('input', () => { read(); clampSet(equity.input, state.price - Math.min(parseNum(loan.input.value), state.price)); read(); render(); });
  [price, equity, loan].forEach(({ input }) => input.addEventListener('blur', () => { input.value = nb.format(parseNum(input.value)); }));
  rate.range.addEventListener('input', () => { rate.input.value = pct(Number(rate.range.value)); read(); render(); });
  rate.input.addEventListener('input', () => { read(); if (state.rate > 10) { state.rate = 10; rate.input.value = '10,00'; } rate.range.value = String(state.rate); render(); });
  years.range.addEventListener('input', () => { years.input.value = years.range.value; read(); render(); });
  years.input.addEventListener('input', () => { read(); if (state.years > 30) { state.years = 30; years.input.value = '30'; } years.range.value = String(state.years); render(); });
  planBtn?.addEventListener('click', () => { const open = planWrap.hidden; planWrap.hidden = !open; planBtn.setAttribute('aria-expanded', String(open)); renderPlan(); });

  const panel = el('div', { class: 'calc-panel calc-panel--cost', 'data-state': 'live' },
    el('div', { class: 'calc-fields calc-fields--3' }, price.node, equity.node, loan.node), rate.node, years.node,
    el('div', { class: 'calc-results' }, ...results.map((r) => r.node)));
  [ctas, ...notes, planBtn, planWrap, example].forEach((n) => n && panel.append(n));
  // linked state (?kjopesum=&egenkapital=&nominell-rente=&nedbetalingstid= — the controls' own names)
  const linked = new URLSearchParams(window.location.search);
  if (linked.get('kjopesum')) price.input.value = nb.format(parseNum(linked.get('kjopesum')));
  if (linked.get('egenkapital')) equity.input.value = nb.format(parseNum(linked.get('egenkapital')));
  if (linked.get('nominell-rente')) { rate.input.value = pct(parseNum(linked.get('nominell-rente'))); }
  if (linked.get('nedbetalingstid')) years.input.value = String(Math.round(parseNum(linked.get('nedbetalingstid'))));
  read(); loan.input.value = nb.format(Math.max(state.price - state.equity, 0)); rate.range.value = String(state.rate); years.range.value = String(state.years);
  render();
  return { panel, defaults: { rate: parseNum(textOf(rateR.children[1])), years: Math.round(parseNum(textOf(yearsR.children[1]))) } };
}

export default function decorate(block) {
  const rows = [...block.children];
  const { tabsRow, tabs } = readTabs(rows);
  const calc = el('div', { class: 'calc', 'data-dynamics': '7' });
  const isCost = (t) => t.rows.some((r) => /kjøpesum/i.test(textOf(r.children[0])));
  const costTab = tabs.find(isCost);
  const cost = costTab ? costPanel(costTab.rows) : null;
  const costDefaults = cost?.defaults || { rate: 0, years: 25 };
  const panels = tabs.map((t) => (t === costTab ? cost?.panel : (t.rows.length ? economyPanel(t.rows, { costDefaults }) : null)));

  if (tabsRow) {
    const label = para(tabsRow.children[0]); label.classList.add('visually-hidden');
    const list = el('div', { class: 'calc-tabs', role: 'tablist', 'aria-label': textOf(label) || 'Velg kalkulator' });
    const btns = tabs.map((t, i) => {
      const id = `calc-tab-${i}`;
      const btn = el('button', { type: 'button', role: 'tab', id, class: `calc-tab${i ? '' : ' is-on'}`, 'aria-selected': String(!i), 'aria-controls': `calc-panel-${i}`, disabled: !panels[i] }, t.label);
      list.append(btn); return btn;
    });
    panels.forEach((p, i) => { if (!p) return; p.id = `calc-panel-${i}`; p.setAttribute('role', 'tabpanel'); p.setAttribute('aria-labelledby', `calc-tab-${i}`); p.hidden = i > 0; });
    const select = (i) => btns.forEach((b, j) => { const on = i === j; b.classList.toggle('is-on', on); b.setAttribute('aria-selected', String(on)); b.tabIndex = on ? 0 : -1; if (panels[j]) panels[j].hidden = !on; });
    btns.forEach((b, i) => b.addEventListener('click', () => select(i)));
    list.addEventListener('keydown', (e) => {
      const i = btns.indexOf(document.activeElement); if (i < 0 || !['ArrowLeft', 'ArrowRight'].includes(e.key)) return;
      const enabled = btns.filter((b) => !b.disabled); const k = enabled.indexOf(btns[i]);
      const next = enabled[(k + (e.key === 'ArrowRight' ? 1 : enabled.length - 1)) % enabled.length]; next.focus(); select(btns.indexOf(next));
    });
    calc.append(el('div', { class: 'calc-tabs-wrap' }, label, list));
    const linkedTab = new URLSearchParams(window.location.search).get('fane');
    if (linkedTab && panels[Number(linkedTab)]) select(Number(linkedTab));
  }
  panels.forEach((p) => p && calc.append(p));
  block.replaceChildren(el('div', { class: 'container calc-wrap' }, calc));
}
