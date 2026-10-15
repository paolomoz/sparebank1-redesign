import { el } from '../../scripts/sb1.js';
import { loadFeatureData } from '../../scripts/site-config.js';
import { expectedPerformance, requiredSavings, formatNumber, parseNumber } from '../../scripts/calc-math.js';

/**
 * savings-calculator — the sparekalkulator (dynamics #8): "Spar hver måned" (what monthly saving grows to) and "Sett et sparemål"
 * (what to save monthly to reach a goal), the risk profile, the product most customers chose, "Se avkastning med ulik risiko".
 * Authoring contract: one row per slot, the FIRST cell is the slot key (config, never displayed), the next cells are the text
 * (MOVED into the widget) and, for inputs, the default value:
 *   tabs | <ul> two tab labels                     heading-monthly | text        heading-goal | text
 *   monthly | label | default                      initial | label | default     goal | label | default
 *   goal-initial | label | default                 years | label | default       risk | label | placeholder | default option
 *   risk-none / risk-low / risk-medium / risk-high | option label | profile title | profile text
 *   result-expected / result-return / result-saved / result-must / result-total | label
 *   recommendation | intro | fund tail (with the fund-overview link) | savings-account tail (with link)
 *   cta-start | fund-saving link | account-saving link        cta-contact | link
 *   compare | button label | disclaimer (with link)   compare-labels | none | low | medium | high     disclaimer | footnote
 * Behaviour lifted from the source widget: future value with deposits at the start of each month at the effective monthly
 * rate; the required deposit inverts it (0 when the start amount reaches the goal). The expected annual return and the product
 * per (risk × years) are the source service's own table — snapshot /data/savings-calculator (scripts/site-config.js) since the
 * service cannot be called cross-origin; scripts/calc-math.js is verified against the service (verify-calc-math.mjs).
 * The fund factsheet the source opens from a product name (#8a, daily fund data) is not reproduced: the name renders as text.
 * @ew-exempt computed numbers, the product name and the start-saving URL parameters (derived from the inputs and the snapshot)
 */
const RISKS = ['none', 'low', 'medium', 'high'];
const LIMITS = {
  monthly: [0, 20000, 100], initial: [0, 1000000, 1000], 'goal-initial': [0, 1000000, 1000], goal: [1000, 5000000, 1000], years: [0, 50, 1],
};
const UPPER = { years: 50 }; // amounts may be typed above the slider (the source's upper limit is 2^31 − 2)
const DEFAULTS = {
  monthly: 500, initial: 6000, goal: 200000, 'goal-initial': 20000, years: 5, risk: 'medium',
};
const kr = (n) => `${formatNumber(Math.round(n))} kr`;
const krDown = (n) => `${formatNumber(Math.floor(n))} kr`; // the source truncates projected amounts
const pct = (n) => `${formatNumber(n, 2)} %`;

let uid = 0;
export default async function decorate(block) {
  uid += 1;
  const slots = {}; const texts = {};
  [...block.children].forEach((row) => {
    const [key, ...cells] = [...row.children];
    const k = key?.textContent.trim().toLowerCase();
    if (k) { slots[k] = cells; texts[k] = cells.map((c) => c.textContent.trim()); }
  });
  const node = (k, i = 0) => {
    const c = slots[k]?.[i];
    if (!c) return null;
    return c.children.length === 1 ? c.firstElementChild : el('p', {}, ...c.childNodes);
  };
  const str = (k, i = 0) => texts[k]?.[i] || ''; // read before any node is moved

  const state = { tab: 0, risk: DEFAULTS.risk };
  Object.keys(LIMITS).forEach((k) => { state[k] = slots[k] ? parseNumber(str(k, 1)) : DEFAULTS[k]; if (!Number.isFinite(state[k])) state[k] = DEFAULTS[k]; });
  const riskDefault = str('risk', 2).toLowerCase();
  const riskIdx = RISKS.findIndex((r) => str(`risk-${r}`).toLowerCase() === riskDefault);
  if (riskIdx > -1) state.risk = RISKS[riskIdx];

  /* ----- controls */
  const units = { amount: 'Kr', time: 'År' };
  const field = (k) => {
    const [min, max, step] = LIMITS[k];
    const id = `sc-${uid}-${k}`;
    const range = el('input', {
      type: 'range', min, max, step, value: Math.min(state[k], max), 'aria-hidden': 'true', tabindex: '-1', class: 'sc-range',
    });
    const input = el('input', {
      id, type: 'text', inputmode: 'numeric', class: 'sc-input num', value: formatNumber(state[k]),
    });
    const set = (v, from) => {
      const upper = UPPER[k] ?? 2147483646;
      state[k] = Math.max(min, Math.min(upper, Number.isFinite(v) ? v : min));
      if (from !== range) range.value = String(Math.min(state[k], max));
      if (from !== input) input.value = formatNumber(state[k]);
      // eslint-disable-next-line no-use-before-define
      update();
    };
    range.addEventListener('input', () => set(Number(range.value), range));
    input.addEventListener('change', () => set(parseNumber(input.value), null));
    input.addEventListener('input', () => { const v = parseNumber(input.value); if (Number.isFinite(v)) set(v, input); });
    return el('div', { class: `sc-field sc-field--${k}` },
      el('label', { class: 'label', for: id }, node(k)),
      el('div', { class: 'sc-control' }, range, el('div', { class: 'sc-input-wrap' }, input, el('span', { class: 'sc-unit', 'aria-hidden': 'true' }, k === 'years' ? units.time : units.amount))));
  };

  const riskId = `sc-${uid}-risk`;
  const riskSelect = el('select', { id: riskId, class: 'sc-select' },
    el('option', { value: '', disabled: true }, str('risk', 1) || 'Velg risiko'),
    ...RISKS.map((r) => el('option', { value: r }, str(`risk-${r}`) || r)));
  const riskRange = el('input', {
    type: 'range', min: 0, max: 3, step: 1, class: 'sc-range', 'aria-hidden': 'true', tabindex: '-1',
  });
  riskSelect.value = state.risk; riskRange.value = String(RISKS.indexOf(state.risk));
  const profileTitle = el('p', { class: 'sc-profile-title' });
  const profileText = el('p', { class: 'sc-profile-text' });
  // eslint-disable-next-line no-use-before-define
  const setRisk = (r) => { state.risk = r; riskSelect.value = r; riskRange.value = String(RISKS.indexOf(r)); update(); };
  riskSelect.addEventListener('change', () => setRisk(riskSelect.value));
  riskRange.addEventListener('input', () => setRisk(RISKS[Number(riskRange.value)]));
  const riskField = el('div', { class: 'sc-field sc-field--risk' },
    el('label', { class: 'label', for: riskId }, node('risk')),
    el('div', { class: 'sc-control' }, riskRange, riskSelect));

  const fields = {
    monthly: field('monthly'), initial: field('initial'), goal: field('goal'), 'goal-initial': field('goal-initial'), years: field('years'),
  };

  /* ----- results */
  const out = (cls) => el('dd', { class: `sc-value ${cls}` });
  const vals = {
    expected: out('sc-big'), ret: out(''), saved: out(''), must: out('sc-big'), total: out(''), goalSaved: out(''), goalRet: out(''),
  };
  const used = new Set();
  const label = (k) => { if (used.has(k)) return str(k); used.add(k); return node(k) || str(k); };
  const dl = (rows) => el('dl', { class: 'sc-results' }, ...rows.map(([k, v]) => el('div', { class: 'sc-result' }, el('dt', {}, label(k)), v)));
  const resultsMonthly = dl([['result-expected', vals.expected], ['result-return', vals.ret], ['result-saved', vals.saved]]);
  const resultsGoal = dl([['result-must', vals.must], ['result-total', vals.total], ['result-saved', vals.goalSaved], ['result-return', vals.goalRet]]);
  // labels shared by both tabs (saved, return): the monthly tab moves the authored node, the goal tab renders its text

  const product = el('strong', { class: 'sc-product', translate: 'no' });
  const tailFund = node('recommendation', 1); const tailAccount = node('recommendation', 2);
  const intro = str('recommendation');
  const recommendation = el('p', { class: 'sc-reco' });
  const ctaFund = node('cta-start', 0); const ctaAccount = node('cta-start', 1);
  const startLink = (ctaFund?.querySelector('a') || ctaFund);
  const accountHref = ctaAccount?.querySelector('a')?.href || ctaAccount?.href;
  const fundHref = startLink?.href;
  const ctaContact = node('cta-contact');
  const ctas = el('div', { class: 'sc-ctas' }, ctaFund, ctaContact);
  startLink?.classList.add('button');
  (ctaContact?.querySelector('a') || ctaContact)?.classList.add('button', 'secondary');

  /* ----- compare ("Se avkastning med ulik risiko") */
  const cmpId = `sc-${uid}-cmp`;
  const cmpBtn = el('button', {
    type: 'button', class: 'sc-compare-toggle arrow', 'aria-expanded': 'false', 'aria-controls': cmpId,
  }, str('compare') || 'Se avkastning med ulik risiko');
  const cmpList = el('dl', { class: 'sc-compare-list' });
  const cmpPanel = el('div', { class: 'sc-compare-panel', id: cmpId, hidden: true }, cmpList, node('compare', 1));
  cmpBtn.addEventListener('click', () => { const open = cmpBtn.getAttribute('aria-expanded') === 'true'; cmpBtn.setAttribute('aria-expanded', String(!open)); cmpPanel.hidden = open; });

  /* ----- tabs */
  const tabLabels = [...(slots.tabs?.[0]?.querySelectorAll('li') || [])].map((li) => li.textContent.trim());
  const tabs = el('div', { class: 'sc-tabs', role: 'tablist' });
  const panelId = `sc-${uid}-panel`;
  const tabBtns = tabLabels.map((tabLabel, i) => el('button', {
    type: 'button', role: 'tab', class: 'sc-tab', id: `sc-${uid}-tab-${i}`, 'aria-controls': panelId, 'aria-selected': String(i === 0),
  }, tabLabel));
  tabs.append(...tabBtns);
  const heading = el('div', { class: 'sc-heading' });
  const headings = [node('heading-monthly'), node('heading-goal')];
  const inputs = el('div', { class: 'sc-inputs' });
  const results = el('div', { class: 'sc-result-wrap' });
  const panel = el('div', {
    class: 'sc-panel', id: panelId, role: 'tabpanel', 'aria-labelledby': `sc-${uid}-tab-0`,
  }, heading,
  el('div', { class: 'sc-grid' },
    el('div', { class: 'sc-col sc-col--inputs' }, inputs, el('div', { class: 'sc-profile' }, profileTitle, profileText), recommendation),
    el('div', { class: 'sc-col sc-col--results' }, results, ctas, cmpBtn, cmpPanel)));
  const footnote = node('disclaimer');
  const calc = el('div', { class: 'sc', 'data-dynamics': '8' }, tabs, panel, footnote ? el('div', { class: 'sc-footnote' }, footnote) : null);
  block.replaceChildren(el('div', { class: 'container' }, calc));

  const showTab = (i) => {
    state.tab = i;
    tabBtns.forEach((b, j) => { b.setAttribute('aria-selected', String(i === j)); b.tabIndex = i === j ? 0 : -1; });
    panel.setAttribute('aria-labelledby', `sc-${uid}-tab-${i}`);
    heading.replaceChildren(headings[i] || '');
    inputs.replaceChildren(...(i ? [fields.goal, fields['goal-initial'], fields.years, riskField] : [fields.monthly, fields.initial, fields.years, riskField]));
    results.replaceChildren(i ? resultsGoal : resultsMonthly);
    // eslint-disable-next-line no-use-before-define
    update();
  };
  tabBtns.forEach((b, i) => {
    b.addEventListener('click', () => showTab(i));
    b.addEventListener('keydown', (e) => {
      if (!['ArrowLeft', 'ArrowRight'].includes(e.key)) return;
      const j = (i + (e.key === 'ArrowRight' ? 1 : tabBtns.length - 1)) % tabBtns.length;
      tabBtns[j].focus(); showTab(j);
    });
  });

  /* ----- compute */
  let data = null;
  function update() {
    profileTitle.textContent = str(`risk-${state.risk}`, 1);
    profileText.textContent = str(`risk-${state.risk}`, 2);
    if (!data) return;
    const y = Math.max(0, Math.min(50, Math.round(state.years)));
    const rate = (r) => data.expectedReturn[r][y];
    const pkg = data.product[state.risk][y];
    const info = data.products[pkg] || { displayName: pkg, isin: null };
    product.textContent = info.displayName;
    recommendation.replaceChildren(`${intro} `, product, '. ', ...(info.isin ? [tailFund] : [tailAccount]).filter(Boolean).map((n) => n.cloneNode(true).childNodes).flatMap((c) => [...c]));
    const monthlyTab = state.tab === 0;
    if (monthlyTab) {
      const v = expectedPerformance({
        initialValue: state.initial, periodicInvestment: state.monthly, years: y, annualReturn: rate(state.risk),
      });
      const saved = state.initial + state.monthly * 12 * y;
      vals.expected.textContent = `${krDown(v)} *`; vals.ret.textContent = krDown(v - saved); vals.saved.textContent = kr(saved);
    } else {
      const req = requiredSavings({
        savingsGoal: state.goal, initialInvestment: state['goal-initial'], years: y, annualReturn: rate(state.risk),
      }).requiredSavingsSum;
      const saved = state['goal-initial'] + Math.round(req) * 12 * y;
      vals.must.textContent = `${kr(req)} *`; vals.total.textContent = kr(state.goal); vals.goalSaved.textContent = kr(saved); vals.goalRet.textContent = kr(state.goal - saved);
    }
    // start-saving link carries the fund and the amounts, like the source (account saving has its own flow)
    const a = startLink?.matches?.('a') ? startLink : startLink?.querySelector?.('a');
    if (a && fundHref) {
      if (info.isin) {
        const u = new URL(fundHref);
        u.search = new URLSearchParams({ isin: info.isin, maanedsbelop: String(Math.round(monthlyTab ? state.monthly : requiredSavings({ savingsGoal: state.goal, initialInvestment: state['goal-initial'], years: y, annualReturn: rate(state.risk) }).requiredSavingsSum)), startbelop: String(monthlyTab ? state.initial : state['goal-initial']) }).toString();
        a.href = u.href;
      } else if (accountHref) a.href = accountHref;
    }
    const maxRate = Math.max(...RISKS.map(rate));
    cmpList.replaceChildren(...RISKS.map((r, i) => {
      const p = data.products[data.product[r][y]] || { displayName: data.product[r][y] };
      const amount = monthlyTab
        ? expectedPerformance({
          initialValue: state.initial, periodicInvestment: state.monthly, years: y, annualReturn: rate(r),
        })
        : requiredSavings({
          savingsGoal: state.goal, initialInvestment: state['goal-initial'], years: y, annualReturn: rate(r),
        }).requiredSavingsSum;
      return el('div', { class: 'sc-compare-row' },
        el('dt', {}, `${str('compare-labels', i)} `, el('span', { translate: 'no' }, p.displayName)),
        el('dd', {}, el('span', { class: 'sc-bar' }, el('span', { class: 'sc-bar-fill', style: `width:${(rate(r) / maxRate) * 100}%` })), el('span', { class: 'sc-rate num' }, pct(rate(r))),
          el('span', { class: 'sc-compare-amount' }, `${monthlyTab ? str('result-expected') : str('result-must')} ${monthlyTab ? krDown(amount) : kr(amount)}`)));
    }));
  }

  showTab(0);
  const res = await loadFeatureData('savingsAssumptions');
  if (res) { data = res.data; block.dataset.snapshot = data.snapshotAt; update(); }
}
