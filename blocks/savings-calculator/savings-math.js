/**
 * savings-math — the source API's savingscalculator answers (dynamics #8), reproduced client-side over the observed model
 * (/data/savings-calculator/model.json, synced by stardust/scripts/dynamics/sync-savings-model.mjs).
 * Annual rate r per product package; monthly rate i = (1 + r)^(1/12) − 1; deposits at the START of each month
 * (annuity-due factor A = ((1 + i)^(12n) − 1) / i × (1 + i)); the start amount compounds annually: P(1 + r)^n.
 * Verified against 36 recorded API responses (max deviation 1.5e-10 kr) and 25 displayed widget values (exact) —
 * stardust/scripts/dynamics/test-calculators.mjs. Pure: no DOM, no network.
 */
export const RISKS = ['none', 'low', 'medium', 'high'];

/** The product package for (years, risk): horizon bucket by the model's upper bounds, then the risk's ladder. */
export function packageFor(model, years, risk) {
  const b = model.buckets.findIndex((max) => max === null || years <= max);
  const name = model.ladder[risk][b < 0 ? model.buckets.length - 1 : b];
  return { name, ...model.packages[name] };
}

function annuityDue(rate, years) {
  const r = rate / 100; const i = (1 + r) ** (1 / 12) - 1; const n = 12 * years;
  if (n === 0) return 0;
  return i === 0 ? n : (((1 + i) ** n - 1) / i) * (1 + i);
}

/** expected-performance: { nominell, rate } for a start amount, a monthly amount, years and risk. */
export function expectedPerformance(model, { initialValue, periodicInvestment, years, risk }) {
  const { rate } = packageFor(model, years, risk);
  const nominell = initialValue * (1 + rate / 100) ** years + periodicInvestment * annuityDue(rate, years);
  return { nominell, rate };
}

/** required-savings: the monthly amount that reaches the goal (≤ 0 when the start amount already does). */
export function requiredSavings(model, { savingsGoal, initialInvestment, years, risk }) {
  const { rate } = packageFor(model, years, risk);
  const futureValueOfInitialAmount = initialInvestment * (1 + rate / 100) ** years;
  const a = annuityDue(rate, years);
  const futureValueOfRequiredSavings = savingsGoal - futureValueOfInitialAmount;
  return { requiredSavingsSum: a ? futureValueOfRequiredSavings / a : 0, futureValueOfInitialAmount, futureValueOfRequiredSavings, rate };
}
