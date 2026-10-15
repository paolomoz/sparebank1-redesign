import { el } from '../../scripts/sb1.js';
import { RISKS, packageFor, expectedPerformance, requiredSavings } from './savings-math.js';

/**
 * savings-calculator — Sparekalkulator (dynamics #8). Key-value rows; the first cell is the key (not shown), the others are
 * authored copy / settings:
 *   Faner        | <ul> Spar hver måned · Sett et sparemål
 *   Spørsmål     | monthly-tab heading | goal-tab heading
 *   Månedsbeløp  | label | default | min | max | step
 *   Sparemål     | label | default | min | max | step
 *   Startbeløp   | label | default (monthly tab) | min | max | step | default (goal tab)
 *   Antall år    | label | default | min | max | step
 *   Risiko       | label | <ul> Ingen · Lav · Moderat · Høy | default option
 *   Profil       | option | title | text                           (×4, one per risk option)
 *   Anbefaling   | sentence naming a fund in <strong> + link | the same for Sparekonto
 *   Resultat     | Forventet beløp: | Avkastning før skatt | Du har spart                     (monthly tab)
 *   Resultat mål | Hver måned må du spare: | Totalt beløp | Du har spart | Avkastning før skatt (goal tab)
 *   Knapper      | [start saving link] [contact link]
 *   Ulik risiko  | toggle label | Ingen risiko: | Lav risiko: | Medium risiko: | Høy risiko: | footnote
 *   Fotnote      | disclaimer
 * Results are computed client-side (savings-math.js) over /data/savings-calculator/model.json — SpareBank 1's (risk × horizon)
 * product ladder and expected rates, observed from the source API by stardust/scripts/dynamics/sync-savings-model.mjs; the source
 * widget gets the same numbers from host-bound /openapi/personal/banking/savingscalculator/*. Authored nodes are MOVED; computed
 * values replace only numbers and the fund name.
 * @ew-exempt error message, "kr"/"År" suffixes — the source widget's fixed strings
 */
const ERROR = 'Det har oppstått en teknisk feil. Prøv igjen senere.';
const nb = new Intl.NumberFormat('nb-NO', { maximumFractionDigits: 0 });
const kr = (v) => `${nb.format(Math.floor(v) + 0)} kr`;
const num = (s) => { const n = parseFloat(String(s || '').replace(/[^\d,.-]/g, '').replace(',', '.')); return Number.isFinite(n) ? n : 0; };
const textOf = (n) => (n ? n.textContent.replace(/\s+/g, ' ').trim() : '');
const para = (cell) => cell?.querySelector('p') || cell;
const SPAREKONTO_PATH = 'min-sparing/kontosparing/fast-sparing'; // the source bundle's CTA target when the package has no ISIN

let modelPromise;
function loadModel() {
  const base = `${window.hlx?.codeBasePath || ''}/data/savings-calculator`;
  modelPromise ||= Promise.all([
    fetch(`${base}/model.json`).then((r) => (r.ok ? r.json() : null)),
    fetch(`${base}/_provenance.json`).then((r) => (r.ok ? r.json() : {})).catch(() => ({})),
  ]).then(([model, prov]) => (model ? { model, snapshot: (prov.writtenAt || '').slice(0, 10) } : null)).catch(() => null);
  return modelPromise;
}

export default async function decorate(block) {
  const rows = {}; const profiles = [];
  [...block.children].forEach((r) => {
    const [k, ...cells] = [...r.children];
    const key = textOf(k).toLowerCase();
    if (key === 'profil') profiles.push(cells); else rows[key] = cells;
  });
  const range = (key) => {
    const c = rows[key] || [];
    return { label: para(c[0]), value: num(textOf(c[1])), min: num(textOf(c[2])), max: num(textOf(c[3])) || 1e9, step: num(textOf(c[4])) || 1, alt: c[5] ? num(textOf(c[5])) : null };
  };
  const tabs = [...(rows.faner?.[0]?.querySelectorAll('li') || [])].map(textOf);
  const questions = (rows['spørsmål'] || []).map(para);
  const monthlyR = range('månedsbeløp'); const goalR = range('sparemål'); const startR = range('startbeløp'); const yearsR = range('antall år');
  const riskCells = rows.risiko || [];
  const riskLabels = [...(riskCells[1]?.querySelectorAll('li') || [])].map(textOf);
  const riskDefault = Math.max(0, riskLabels.indexOf(textOf(riskCells[2])));
  const [recFund, recAccount] = (rows.anbefaling || []).map(para);
  const resMonthly = (rows.resultat || []).map(para); const resGoal = (rows['resultat mål'] || []).map(para);
  const ctaLinks = [...(rows.knapper?.[0]?.querySelectorAll('a') || [])];
  const [cmpToggle, ...cmpRest] = (rows['ulik risiko'] || []).map(para);
  const cmpFoot = cmpRest.length > 4 ? cmpRest.pop() : null; const cmpLabels = cmpRest.map(textOf);
  const disclaimer = para(rows.fotnote?.[0]);

  // linked state — the controls' own names (also the source CTA's maanedsbelop / startbelop)
  const q = new URLSearchParams(window.location.search);
  const qn = (k, d) => (q.has(k) ? num(q.get(k)) : d);
  const state = {
    tab: q.get('fane') === '1' ? 1 : 0,
    monthly: qn('maanedsbelop', monthlyR.value), goal: qn('sparemal', goalR.value),
    start: [startR.value, startR.alt ?? startR.value],
    years: Math.min(qn('ar', yearsR.value), yearsR.max), risk: q.has('risiko') ? Math.max(0, RISKS.indexOf(q.get('risiko'))) : riskDefault,
  };
  state.start[state.tab] = qn('startbelop', state.start[state.tab]); // a linked start amount belongs to the linked tab

  // ---- controls
  let model = null; let render = () => {};
  const control = (r, id, getter, setter, suffix) => {
    const input = el('input', { class: 'input num', id, name: id, type: 'text', inputmode: 'numeric', autocomplete: 'off' });
    const slider = el('input', { class: 'sv-range', type: 'range', min: r.min, max: r.max, step: r.step, 'aria-hidden': 'true', tabindex: '-1' });
    const sync = () => { input.value = nb.format(getter()); slider.value = String(getter()); };
    input.addEventListener('input', () => { input.value = input.value.replace(/[^\d\s ]/g, ''); setter(Math.max(r.min, Math.min(num(input.value.replace(/\s/g, '')), id === 'ar' ? r.max : 2147483646))); slider.value = String(getter()); render(); });
    input.addEventListener('blur', () => { input.value = nb.format(getter()); });
    slider.addEventListener('input', () => { setter(Number(slider.value)); input.value = nb.format(getter()); render(); });
    const node = el('div', { class: 'sv-field' }, el('label', { class: 'label', for: id }, r.label), el('div', { class: 'sv-row' }, slider, el('div', { class: 'input-wrap' }, input, el('span', { class: 'suffix', 'aria-hidden': 'true' }, suffix))));
    return { node, sync };
  };
  const cMonthly = control(monthlyR, 'maanedsbelop', () => state.monthly, (v) => { state.monthly = v; }, 'Kr');
  const cGoal = control(goalR, 'sparemal', () => state.goal, (v) => { state.goal = v; }, 'Kr');
  const cStart = control(startR, 'startbelop', () => state.start[state.tab], (v) => { state.start[state.tab] = v; }, 'Kr');
  const cYears = control(yearsR, 'ar', () => state.years, (v) => { state.years = v; }, 'År');
  const riskSelect = el('select', { class: 'input sv-select', id: 'risiko', name: 'risiko' }, ...riskLabels.map((l, i) => el('option', { value: RISKS[i] }, l)));
  const riskSlider = el('input', { class: 'sv-range sv-range--risk', type: 'range', min: '0', max: '3', step: '1', 'aria-hidden': 'true', tabindex: '-1' });
  riskSelect.addEventListener('change', () => { state.risk = RISKS.indexOf(riskSelect.value); riskSlider.value = String(state.risk); render(); });
  riskSlider.addEventListener('input', () => { state.risk = Number(riskSlider.value); riskSelect.value = RISKS[state.risk]; render(); });
  const riskNode = el('div', { class: 'sv-field' }, el('label', { class: 'label', for: 'risiko' }, para(riskCells[0])), el('div', { class: 'sv-row' }, riskSlider, riskSelect));
  const profileBox = el('div', { class: 'sv-profile', role: 'note' });
  const profileNodes = profiles.map(([, title, text]) => el('div', { class: 'sv-profile-item', hidden: true }, el('h3', {}, ...para(title).childNodes), para(text)));
  profileBox.append(...profileNodes);

  // ---- result card
  const rec = el('div', { class: 'sv-rec' }, recFund, recAccount);
  const resultRows = (labels) => labels.map((l, i) => el('div', { class: `sv-res${i ? '' : ' sv-res--main'}` }, el('dt', {}, l), el('dd', { class: 'num' })));
  const listMonthly = el('dl', { class: 'sv-results' }, ...resultRows(resMonthly));
  const listGoal = el('dl', { class: 'sv-results' }, ...resultRows(resGoal));
  const ctas = el('div', { class: 'sv-ctas', role: 'group' }, ...ctaLinks.map((a, i) => { a.classList.add('button'); if (i) a.classList.add('secondary'); return a; }));
  const startHref = ctaLinks[0]?.href;
  const cmpBtn = cmpToggle ? el('button', { type: 'button', class: 'sv-cmp-toggle', 'aria-expanded': 'false', 'aria-controls': 'sv-cmp' }, ...cmpToggle.childNodes) : null;
  const cmp = el('div', { class: 'sv-cmp', id: 'sv-cmp', hidden: true });
  const error = el('p', { class: 'sv-error', role: 'alert', hidden: true }, ERROR);
  const card = el('div', { class: 'sv-card', 'aria-live': 'polite' }, error, rec, listMonthly, listGoal, ctas, cmpBtn, cmp);
  cmpBtn?.addEventListener('click', () => { cmp.hidden = !cmp.hidden; cmpBtn.setAttribute('aria-expanded', String(!cmp.hidden)); render(); });

  // ---- tabs + layout
  const heading = el('h2', { class: 'sv-heading' });
  const tabBtns = tabs.map((label, i) => el('button', { type: 'button', role: 'tab', class: 'sv-tab', id: `sv-tab-${i}`, 'aria-controls': 'sv-panel' }, label));
  tabBtns.forEach((b, i) => b.addEventListener('click', () => { state.tab = i; render(); }));
  const inputs = el('div', { class: 'sv-inputs' }, cMonthly.node, cGoal.node, cStart.node, cYears.node, riskNode, profileBox);
  const panel = el('div', { class: 'sv-panel', id: 'sv-panel', role: 'tabpanel' }, heading, el('div', { class: 'sv-grid' }, inputs, card), disclaimer && el('div', { class: 'sv-disclaimer small' }, disclaimer));
  block.replaceChildren(el('div', { class: 'container sv' }, el('div', { class: 'sv-tabs', role: 'tablist' }, ...tabBtns), panel));

  render = () => {
    const goalTab = state.tab === 1;
    tabBtns.forEach((b, i) => { b.setAttribute('aria-selected', String(i === state.tab)); b.classList.toggle('is-on', i === state.tab); b.tabIndex = i === state.tab ? 0 : -1; });
    panel.setAttribute('aria-labelledby', `sv-tab-${state.tab}`);
    const qn2 = questions[state.tab] || questions[0]; heading.textContent = textOf(qn2);
    cMonthly.node.hidden = goalTab; cGoal.node.hidden = !goalTab; listMonthly.hidden = goalTab; listGoal.hidden = !goalTab;
    [cMonthly, cGoal, cStart, cYears].forEach((c) => c.sync());
    riskSelect.value = RISKS[state.risk]; riskSlider.value = String(state.risk);
    profileNodes.forEach((n, i) => { n.hidden = i !== state.risk; });
    if (!model) return;
    const risk = RISKS[state.risk]; const start = state.start[state.tab]; const { years } = state;
    const pkg = packageFor(model, years, risk);
    const fundName = pkg.fund || pkg.name;
    rec.replaceChildren(pkg.isin ? recFund : (recAccount || recFund));
    const strong = rec.querySelector('strong'); if (strong) strong.textContent = fundName;
    const dd = (list) => [...list.querySelectorAll('dd')];
    let monthlyForCta = state.monthly;
    if (!goalTab) {
      const fv = expectedPerformance(model, { initialValue: start, periodicInvestment: state.monthly, years, risk }).nominell;
      const saved = 12 * state.monthly * years + start;
      const [main, ret, sav] = dd(listMonthly);
      if (main) main.textContent = `${kr(fv)} *`; if (ret) ret.textContent = kr(fv - saved); if (sav) sav.textContent = kr(saved);
      block.dataset.result = String(Math.floor(fv));
    } else {
      const req = Math.max(Math.round(requiredSavings(model, { savingsGoal: state.goal, initialInvestment: start, years, risk }).requiredSavingsSum), 0);
      const saved = 12 * years * req + start;
      const [main, total, sav, ret] = dd(listGoal);
      if (main) main.textContent = `${kr(req)} *`; if (total) total.textContent = kr(state.goal); if (sav) sav.textContent = kr(saved); if (ret) ret.textContent = saved ? kr(state.goal - saved) : '';
      block.dataset.result = String(req); monthlyForCta = req;
    }
    if (startHref && ctaLinks[0]) {
      const u = new URL(startHref);
      if (pkg.isin) { u.search = new URLSearchParams({ isin: pkg.isin, maanedsbelop: monthlyForCta, startbelop: start }).toString(); } else { u.pathname = u.pathname.replace(/fond\/sparemetoder\/?$/, SPAREKONTO_PATH); u.search = ''; }
      ctaLinks[0].href = u.href;
    }
    if (!cmp.hidden) {
      const rowsCmp = RISKS.map((r, i) => {
        const p = packageFor(model, years, r);
        const value = goalTab
          ? `${textOf(resGoal[0])} ${kr(Math.max(Math.round(requiredSavings(model, { savingsGoal: state.goal, initialInvestment: start, years, risk: r }).requiredSavingsSum), 0))}`
          : `${textOf(resMonthly[0])} ${kr(expectedPerformance(model, { initialValue: start, periodicInvestment: state.monthly, years, risk: r }).nominell)}`;
        return { label: cmpLabels[i] || r, name: p.fund || p.name, rate: p.rate, value };
      });
      const maxRate = Math.max(...rowsCmp.map((r) => r.rate));
      cmp.replaceChildren(...rowsCmp.map((r) => el('div', { class: 'sv-cmp-row' },
        el('div', { class: 'sv-cmp-label' }, `${r.label} `, el('strong', {}, r.name)),
        el('div', { class: 'sv-bar', role: 'img', 'aria-label': `${r.rate.toFixed(2).replace('.', ',')} %` }, el('span', { style: `width:${(r.rate / maxRate) * 100}%` }, `${r.rate.toFixed(2).replace('.', ',')} %`)),
        el('div', { class: 'small' }, r.value))), cmpFoot && el('div', { class: 'sv-cmp-foot small' }, cmpFoot));
    }
  };
  render();
  const loaded = await loadModel();
  if (!loaded) { error.hidden = false; [rec, listMonthly, listGoal].forEach((n) => { n.hidden = true; }); return; }
  model = loaded.model; block.dataset.snapshot = loaded.snapshot;
  render();
}
