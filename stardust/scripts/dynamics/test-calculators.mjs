#!/usr/bin/env node
/**
 * test-calculators.mjs — dynamics #7 / #8: replay the source API responses recorded on 2026-10-15 against the client-side math.
 *
 *   node stardust/scripts/dynamics/test-calculators.mjs
 *
 * #7 annuity-loan pairs (stardust/dynamics/evidence/loan-vectors.json) → blocks/calculator/loan-math.js
 * #8 expected-performance / required-savings / suggested-savings-product pairs and displayed widget values
 *    (stardust/dynamics/evidence/savings-vectors.json) → blocks/savings-calculator/savings-math.js over data/savings-calculator/model.json
 * Exit 0 when every pair is within tolerance, 1 otherwise.
 */
import { readFileSync } from 'node:fs';
import { annuityLoan } from '../../../blocks/calculator/loan-math.js';
import { expectedPerformance, requiredSavings, packageFor } from '../../../blocks/savings-calculator/savings-math.js';

const read = (p) => JSON.parse(readFileSync(new URL(`../../../${p}`, import.meta.url)));
const loan = read('stardust/dynamics/evidence/loan-vectors.json');
const sav = read('stardust/dynamics/evidence/savings-vectors.json');
const model = read('data/savings-calculator/model.json');
let fail = 0; const max = {};
const track = (k, d, tol) => { max[k] = Math.max(max[k] || 0, d); if (d > tol) { fail += 1; console.error(`FAIL ${k} Δ ${d}`); } };

// #7 — every annuity-loan pair
const ann = loan.pairs.filter((p) => p.endpoint === 'annuity-loan' && p.response);
ann.forEach(({ request: q, response: r }) => {
  const m = annuityLoan({ ...q, start: { year: q.loanRaisingYear, month: q.loanRaisingMonth } });
  ['monthlyPayment', 'monthlyNetPayment', 'totalInterest', 'totalFees', 'totalAmountPaid', 'totalTaxDeduction'].forEach((k) => track(`loan.${k}`, Math.abs(m[k] - r[k]), 1e-3));
  track('loan.effectiveAnnualRate(pp)', Math.abs(m.effectiveAnnualRate - r.effectiveAnnualRate), 1e-6);
  (r.amortizationSchedule || []).forEach((row) => {
    const mr = m.amortizationSchedule[row.index - 1];
    ['interest', 'principal', 'fee', 'payment', 'balance'].forEach((k) => track('loan.schedule', Math.abs(mr[k] - row[k]), 1e-3));
    if (mr.year !== row.year || mr.month !== row.month) track('loan.schedule.date', 1, 0);
  });
});

// #8 — API pairs
const num = (o) => Object.fromEntries(Object.entries(o).map(([k, v]) => [k, Number.isNaN(Number(v)) ? v : Number(v)]));
let savPairs = 0;
sav.apiPairs.filter((p) => p.status === 200 && p.response).forEach((p) => {
  const q = num(p.query || {});
  if (p.endpoint === 'expected-performance') {
    const m = expectedPerformance(model, q);
    track('savings.expected.nominell', Math.abs(m.nominell - p.response.expectedPerformanceBeforeTax.nominell), 1e-6);
    track('savings.expected.rate', Math.abs(m.rate - p.response.nominalExpectedAnnualReturn), 0);
  } else if (p.endpoint === 'required-savings') {
    const m = requiredSavings(model, q);
    track('savings.required', Math.abs(m.requiredSavingsSum - p.response.requiredSavingsSum), 1e-6);
  } else if (p.endpoint === 'suggested-savings-product') {
    const got = packageFor(model, q.years, q.risk).name; const want = p.response.recommendedProductPackages[0].name;
    track('savings.product', got === want ? 0 : 1, 0);
  } else return;
  savPairs += 1;
});
// #8 — displayed values (floor for amounts; the goal tab rounds the monthly amount and floors at 0)
let shown = 0;
sav.widgetVectors.filter((v) => v.inputs?.risk && v.inputs.risk !== 'all').forEach((v) => {
  const { monthly, start, years, risk, goal } = v.inputs;
  Object.entries(v.displayed).forEach(([label, value]) => {
    let got = null;
    if (/^Forventet/.test(label)) got = Math.floor(expectedPerformance(model, { initialValue: start, periodicInvestment: monthly, years, risk }).nominell);
    else if (/^Hver måned/.test(label)) got = Math.max(Math.round(requiredSavings(model, { savingsGoal: goal, initialInvestment: start, years, risk }).requiredSavingsSum), 0);
    if (got === null) return;
    shown += 1; track('savings.displayed', Math.abs(got - value), 0);
  });
});

console.log(`#7 annuity-loan: ${ann.length} recorded responses · #8 savings: ${savPairs} recorded responses + ${shown} displayed values`);
Object.entries(max).forEach(([k, v]) => console.log(`  max Δ ${k}: ${v}`));
console.log(fail ? `FAIL ${fail}` : 'PASS');
process.exit(fail ? 1 : 0);
