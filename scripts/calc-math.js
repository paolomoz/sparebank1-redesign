/**
 * scripts/calc-math.js — the client compute behind the calculator blocks (dynamics #7, #8, #9). Pure functions, no DOM, so
 * `stardust/scripts/dynamics/verify-calc-math.mjs` replays them against the source APIs they replace. Every formula is lifted
 * from the source service's answers, never invented: annuity-loan (boliglan-kalkulator), expected-performance / required-savings
 * (savingscalculator) and the valutakalkulator conversion.
 */

/* ------------------------------------------------------------------ loan */

/** Annuity loan with the source's fee + tax rules (POST /api/personal/banking/boliglan-kalkulator/annuity-loan). */
export function annuityLoan({
  purchasePrice, equity = 0, interestRate, feeEstablishment = 0, feeMonthly = 0,
  taxDeductionRate = 0.22, loanTermYears, loanRaisingYear, loanRaisingMonth,
}) {
  const loanAmount = purchasePrice - equity;
  const n = Math.round(loanTermYears * 12);
  const r = interestRate / 100 / 12;
  const annuity = r ? (loanAmount * r) / (1 - (1 + r) ** -n) : loanAmount / n;
  const schedule = [];
  let balance = loanAmount;
  let year = loanRaisingYear;
  let month = loanRaisingMonth;
  for (let i = 1; i <= n; i += 1) {
    const interest = balance * r;
    const principal = annuity - interest;
    const fee = feeMonthly + (i === 1 ? feeEstablishment : 0);
    const taxDeduction = interest * taxDeductionRate;
    const payment = annuity + fee;
    balance -= principal;
    schedule.push({
      index: i, year, month, interest, principal, fee, taxDeduction, payment, netPayment: payment - taxDeduction, balance,
    });
    month += 1;
    if (month > 12) { month = 1; year += 1; }
  }
  const sum = (k) => schedule.reduce((s, m) => s + m[k], 0);
  const totalInterest = sum('interest');
  const totalFees = feeEstablishment + feeMonthly * n;
  // effective rate: monthly IRR of +loan against every month's annuity + fees, compounded to a year
  const flows = schedule.map((m) => m.payment);
  const npv = (i) => flows.reduce((s, f, k) => s + f / (1 + i) ** (k + 1), 0) - loanAmount;
  let lo = 0; let hi = 1;
  for (let k = 0; k < 200; k += 1) { const mid = (lo + hi) / 2; if (npv(mid) > 0) lo = mid; else hi = mid; }
  const effectiveAnnualRate = ((1 + (lo + hi) / 2) ** 12 - 1) * 100;
  return {
    purchasePrice,
    equity,
    debtRatio: purchasePrice ? (loanAmount / purchasePrice) * 100 : 0,
    loanAmount,
    monthlyPayment: annuity + feeMonthly,
    monthlyNetPayment: (schedule[1] || schedule[0]).netPayment,
    totalInterest,
    totalPrincipal: sum('principal'),
    totalFees,
    totalTaxDeduction: sum('taxDeduction'),
    totalAmountPaid: loanAmount + totalInterest + totalFees,
    effectiveAnnualRate,
    amortizationSchedule: schedule,
  };
}

/** The lending-capacity request body (POST …/boliglan-kalkulator/economy) — built exactly as the source widget builds it. */
export function economyRequest({
  borrowers, children, cars, income, debt, interestRate, feeMonthly, loanTermYears, feeEstablishment,
}) {
  const salary = income / borrowers;
  const adults = [{
    age: 35, gender: 'Male', grossSalary: salary, employmentStatus: 'Employed',
  }];
  if (borrowers === 2) {
    adults.push({
      age: 35, gender: 'Female', grossSalary: salary, employmentStatus: 'Employed',
    });
  }
  const kids = [];
  for (let i = 0; i < children && i < 5; i += 1) {
    kids.push({
      age: 9, gender: i % 2 === 0 ? 'Female' : 'Male', kindergarden: false, afterSchoolCareFullTime: false, afterSchoolCarePartTime: true,
    });
  }
  const body = {
    calculationDataset: 'Loke', adults, numberOfPetrolCars: cars, numberOfElectricCars: 0, existingMortgage: debt,
  };
  if (kids.length) body.children = kids;
  return {
    ...body, interestRate, feeMonthly, loanTermYears, feeEstablishment,
  };
}

/* --------------------------------------------------------------- savings */

const monthlyRate = (annualPct) => (1 + annualPct / 100) ** (1 / 12) - 1;

/** Future value: start amount + monthly deposits at the start of each month, effective monthly rate (GET …/expected-performance). */
export function expectedPerformance({
  initialValue, periodicInvestment, years, annualReturn,
}) {
  const i = monthlyRate(annualReturn);
  const n = years * 12;
  const g = (1 + i) ** n;
  const deposits = i ? periodicInvestment * ((g - 1) / i) * (1 + i) : periodicInvestment * n;
  return initialValue * g + deposits;
}

/** Monthly deposit that reaches a goal (GET …/required-savings). */
export function requiredSavings({
  savingsGoal, initialInvestment, years, annualReturn,
}) {
  const i = monthlyRate(annualReturn);
  const n = years * 12;
  const g = (1 + i) ** n;
  const futureValueOfInitialAmount = initialInvestment * g;
  const annuity = i ? ((g - 1) / i) * (1 + i) : n;
  const futureValueOfRequiredSavings = savingsGoal - futureValueOfInitialAmount;
  return {
    // the service answers 0 (never a negative deposit) when the start amount alone reaches the goal
    requiredSavingsSum: annuity && futureValueOfRequiredSavings > 0 ? futureValueOfRequiredSavings / annuity : 0,
    futureValueOfInitialAmount,
    futureValueOfRequiredSavings,
  };
}

/* -------------------------------------------------------------- currency */

/**
 * valutakalkulator: the from-currency goes to NOK at the bank's buy rate, NOK goes to the to-currency at its sell rate;
 * the rate line reads "1 <to> = <buy(to) / buy(from)> <from>". Rates are per `unitNumber` (1 or 100) NOK.
 */
export function convertCurrency(amount, from, to, rates) {
  const r = (code, k) => (code === 'NOK' ? 1 : rates[code][k] / rates[code].unitNumber);
  const nok = amount * r(from, 'buyCashRate');
  return { result: nok / r(to, 'sellCashRate'), rate: r(to, 'buyCashRate') / r(from, 'buyCashRate') };
}

/* ------------------------------------------------------------ formatting */

/** nb-NO number: thin-space thousands, comma decimals (the source widgets' rendering). */
export function formatNumber(value, decimals = 0) {
  const fixed = Math.abs(value).toFixed(decimals);
  const [int, dec] = fixed.split('.');
  const grouped = int.replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  return `${value < 0 ? '−' : ''}${grouped}${dec ? `,${dec}` : ''}`;
}

/** Read an authored or typed amount ("3 000 000 kr", "5,33 %", "25 år") as a number. */
export function parseNumber(str) {
  const n = parseFloat(String(str ?? '').replace(/[\s\u00a0]/g, '').replace(',', '.').replace(/[^\d.-]/g, ''));
  return Number.isFinite(n) ? n : NaN;
}
