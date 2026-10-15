/**
 * loan-math — "Hvor mye koster lånet?" (dynamics #7), the source API's annuity-loan computation reproduced client-side.
 * Monthly annuity at rate/1200; the establishment fee rides instalment 1; the monthly fee is part of every payment; the tax deduction
 * is 22 % of interest ("Kostnad etter skattefradrag" uses instalment 2's interest); the effective rate is the IRR of the payment stream
 * annualised as (1 + IRR)^12 − 1. Verified against 20 recorded API responses (stardust/dynamics/evidence/loan-vectors.json,
 * stardust/scripts/dynamics/test-calculators.mjs): every field within 1.3e-5 kr, effective rate within 3.2e-10 pp.
 * Pure: no DOM, no network.
 */
export const TAX_DEDUCTION_RATE = 0.22;

/** Monthly IRR of: +principal at t0, −payments[i] at t = i + 1 (bisection; payments are positive). */
function monthlyIrr(principal, payments) {
  const npv = (r) => payments.reduce((s, p, i) => s - p / (1 + r) ** (i + 1), principal);
  let lo = 0; let hi = 1;
  if (npv(lo) >= 0) return 0;
  for (let k = 0; k < 200; k += 1) {
    const mid = (lo + hi) / 2;
    if (npv(mid) > 0) hi = mid; else lo = mid;
  }
  return (lo + hi) / 2;
}

/**
 * @param {{ purchasePrice: number, equity: number, interestRate: number, loanTermYears: number,
 *   feeEstablishment?: number, feeMonthly?: number, start?: { year: number, month: number } }} input
 */
export function annuityLoan({ purchasePrice, equity, interestRate, loanTermYears, feeEstablishment = 0, feeMonthly = 0, start }) {
  const loanAmount = purchasePrice - equity;
  const n = Math.round(loanTermYears * 12);
  const r = interestRate / 1200;
  const annuity = r === 0 ? loanAmount / n : (loanAmount * r) / (1 - (1 + r) ** -n);
  const now = start || { year: new Date().getFullYear(), month: new Date().getMonth() + 1 };
  const schedule = []; let balance = loanAmount;
  for (let i = 1; i <= n; i += 1) {
    const interest = balance * r; const principal = annuity - interest;
    const fee = feeMonthly + (i === 1 ? feeEstablishment : 0);
    const payment = annuity + fee; const taxDeduction = TAX_DEDUCTION_RATE * interest;
    balance -= principal;
    const m0 = now.month - 1 + (i - 1);
    schedule.push({ index: i, year: now.year + Math.floor(m0 / 12), month: (m0 % 12) + 1, interest, principal, fee, taxDeduction, payment, netPayment: payment - taxDeduction, balance });
  }
  const totalInterest = n * annuity - loanAmount;
  const totalFees = feeEstablishment + n * feeMonthly;
  const irr = monthlyIrr(loanAmount, schedule.map((s) => s.payment));
  return {
    purchasePrice, equity, loanAmount, debtRatio: (loanAmount / purchasePrice) * 100,
    monthlyPayment: annuity + feeMonthly,
    monthlyNetPayment: annuity + feeMonthly - TAX_DEDUCTION_RATE * (schedule[1] || schedule[0]).interest,
    totalInterest, totalPrincipal: loanAmount, totalFees,
    totalTaxDeduction: TAX_DEDUCTION_RATE * totalInterest,
    totalAmountPaid: loanAmount + totalInterest + totalFees,
    effectiveAnnualRate: ((1 + irr) ** 12 - 1) * 100,
    amortizationSchedule: schedule,
  };
}
