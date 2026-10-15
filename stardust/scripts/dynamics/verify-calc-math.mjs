#!/usr/bin/env node
/**
 * verify-calc-math.mjs — stardust:dynamics Phase 4 evidence for #7 / #8 / #9: replay scripts/calc-math.js against the SOURCE
 * services it replaces, on a fixed grid of inputs, and record every deviation. Server-side requests (the services send no CORS
 * headers, so a browser on the migration host cannot reach them — that is why the math is lifted).
 *
 *   node stardust/scripts/dynamics/verify-calc-math.mjs [--out stardust/dynamics/spike-a/calc-math-verify.json] [--pace 250]
 *
 * Tolerances: money ±0.01 kr on unrounded values (the displayed values are whole kroner), rates ±0.0001 percentage points.
 * Currency: the converter's conversion is checked against the source widget's own rendered results recorded during detect.
 * Exit 0 when every case is within tolerance.
 */
import { writeFileSync, mkdirSync } from 'node:fs';
import { dirname } from 'node:path';
import {
  annuityLoan, expectedPerformance, requiredSavings, convertCurrency,
} from '../../../scripts/calc-math.js';

const arg = (k, d) => { const i = process.argv.indexOf(k); return i > -1 ? process.argv[i + 1] : d; };
const OUT = arg('--out', 'stardust/dynamics/spike-a/calc-math-verify.json');
const PACE = Number(arg('--pace', '250'));
const SRC = 'https://www.sparebank1.no';
const H = { 'user-agent': 'Mozilla/5.0 (stardust dynamics verify)', accept: 'application/vnd.sparebank1.v1+json' };
const sleep = (ms) => new Promise((r) => { setTimeout(r, ms); });
const close = (a, b, tol) => Math.abs(a - b) <= tol;

const results = { annuity: [], savings: [], required: [], currency: [] };

/* --- #7 annuity-loan: prices, equity, rates across the slider (0.01–10 %), terms 1–30, both fee sets, fee 0 */
const now = new Date();
const loanCases = [];
[[3000000, 300000], [1096100, 0], [2484500, 0], [4500000, 1200000], [800000, 790000], [10000000, 2500000]].forEach(([p, e]) => {
  [[5.33, 25], [0.01, 30], [10, 1], [3.9, 10], [7.25, 20]].forEach(([rate, years]) => {
    [[2900, 50], [1500, 50], [0, 0]].forEach(([fe, fm]) => loanCases.push({
      purchasePrice: p, equity: e, interestRate: rate, feeEstablishment: fe, feeMonthly: fm, taxDeductionRate: 0.22, loanTermYears: years, interestOnlyYears: 0, loanRaisingYear: now.getFullYear(), loanRaisingMonth: now.getMonth() + 1,
    }));
  });
});
for (const c of loanCases) {
  const res = await fetch(`${SRC}/api/personal/banking/boliglan-kalkulator/annuity-loan`, { method: 'POST', headers: { ...H, 'content-type': 'application/json' }, body: JSON.stringify(c) });
  const api = await res.json();
  const ours = annuityLoan(c);
  const keys = ['loanAmount', 'monthlyPayment', 'monthlyNetPayment', 'totalInterest', 'totalFees', 'totalTaxDeduction', 'totalAmountPaid'];
  const diffs = keys.filter((k) => !close(ours[k], api[k], 0.01)).map((k) => `${k}: ours ${ours[k]} api ${api[k]}`);
  if (!close(ours.effectiveAnnualRate, api.effectiveAnnualRate, 0.0001)) diffs.push(`effectiveAnnualRate: ours ${ours.effectiveAnnualRate} api ${api.effectiveAnnualRate}`);
  const sched = api.amortizationSchedule || [];
  if (sched.length !== ours.amortizationSchedule.length) diffs.push(`schedule length ours ${ours.amortizationSchedule.length} api ${sched.length}`);
  sched.forEach((m, i) => {
    const o = ours.amortizationSchedule[i];
    ['interest', 'principal', 'fee', 'payment', 'netPayment', 'balance'].forEach((k) => { if (!close(o[k], m[k], 0.01)) diffs.push(`schedule[${i}].${k}: ours ${o[k]} api ${m[k]}`); });
    if (o.year !== m.year || o.month !== m.month) diffs.push(`schedule[${i}] date ${o.year}-${o.month} api ${m.year}-${m.month}`);
  });
  results.annuity.push({ input: c, pass: !diffs.length, diffs: diffs.slice(0, 5), api: { monthlyPayment: api.monthlyPayment, effectiveAnnualRate: api.effectiveAnnualRate } });
  process.stderr.write(diffs.length ? 'x' : '.');
  await sleep(PACE);
}

/* --- #8 expected-performance + required-savings: the rate comes from the source's own answer (snapshot grid holds it) */
const saveCases = [[6000, 500, 5, 'medium'], [0, 20000, 50, 'high'], [1000000, 0, 1, 'low'], [0, 100, 0, 'none'], [250000, 3500, 17, 'high'], [12345, 1234, 33, 'medium'], [0, 0, 10, 'low'], [500000, 20000, 30, 'none']];
for (const [initialValue, periodicInvestment, years, risk] of saveCases) {
  const api = await (await fetch(`${SRC}/openapi/personal/banking/savingscalculator/expected-performance?initialValue=${initialValue}&periodicInvestment=${periodicInvestment}&years=${years}&risk=${risk}`, { headers: H })).json();
  const ours = expectedPerformance({
    initialValue, periodicInvestment, years, annualReturn: api.nominalExpectedAnnualReturn,
  });
  const pass = close(ours, api.expectedPerformanceBeforeTax.nominell, 0.01);
  results.savings.push({
    input: {
      initialValue, periodicInvestment, years, risk,
    },
    annualReturn: api.nominalExpectedAnnualReturn,
    ours,
    api: api.expectedPerformanceBeforeTax.nominell,
    pass,
  });
  process.stderr.write(pass ? '.' : 'x');
  await sleep(PACE);
}
const goalCases = [[200000, 20000, 20, 'high'], [1000, 0, 1, 'none'], [5000000, 1000000, 50, 'medium'], [300000, 290000, 3, 'low'], [100000, 200000, 10, 'high'], [750000, 0, 12, 'medium']];
for (const [savingsGoal, initialInvestment, years, risk] of goalCases) {
  const r = await (await fetch(`${SRC}/openapi/personal/banking/savingscalculator/expected-performance?initialValue=0&periodicInvestment=0&years=${years}&risk=${risk}`, { headers: H })).json();
  const api = await (await fetch(`${SRC}/openapi/personal/banking/savingscalculator/required-savings?savingsGoal=${savingsGoal}&initialInvestment=${initialInvestment}&years=${years}&risk=${risk}`, { headers: H })).json();
  const ours = requiredSavings({
    savingsGoal, initialInvestment, years, annualReturn: r.nominalExpectedAnnualReturn,
  });
  const diffs = ['requiredSavingsSum', 'futureValueOfInitialAmount', 'futureValueOfRequiredSavings'].filter((k) => !close(ours[k], api[k], 0.01)).map((k) => `${k}: ours ${ours[k]} api ${api[k]}`);
  results.required.push({
    input: {
      savingsGoal, initialInvestment, years, risk,
    },
    api,
    ours,
    pass: !diffs.length,
    diffs,
  });
  process.stderr.write(diffs.length ? 'x' : '.');
  await sleep(PACE);
}

/* --- #9 conversion against the source widget's rendered answers (fx probe, same rates fetched in the same minute) */
const rates = Object.fromEntries((await (await fetch(`${SRC}/openapi/nettsider/ressurser/bank/valutakurser`, { headers: H })).json()).map((r) => [r.currencyCode, r]));
const fx = JSON.parse(arg('--fx-cases', '[]'));
fx.forEach(({
  amount, from, to, shownResult, shownRate,
}) => {
  const o = convertCurrency(amount, from, to, rates);
  const pass = o.result.toFixed(2) === shownResult && (!shownRate || o.rate.toFixed(2) === shownRate);
  results.currency.push({
    input: { amount, from, to }, ours: { result: o.result.toFixed(2), rate: o.rate.toFixed(2) }, shown: { shownResult, shownRate }, pass,
  });
});

const all = Object.values(results).flat();
const failed = all.filter((r) => !r.pass);
const summary = Object.fromEntries(Object.entries(results).map(([k, v]) => [k, `${v.filter((r) => r.pass).length}/${v.length}`]));
mkdirSync(dirname(OUT), { recursive: true });
writeFileSync(OUT, `${JSON.stringify({
  _provenance: { writtenBy: 'stardust:dynamics Phase 4 verify-calc-math.mjs', writtenAt: new Date().toISOString(), source: SRC },
  summary,
  results,
}, null, 1)}\n`);
process.stderr.write(`\n${JSON.stringify(summary)} → ${OUT}\n`);
if (failed.length) failed.slice(0, 8).forEach((f) => process.stderr.write(`FAIL ${JSON.stringify(f.input)} ${JSON.stringify(f.diffs || f)}\n`));
process.exit(failed.length ? 1 : 0);
