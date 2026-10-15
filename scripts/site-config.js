/**
 * scripts/site-config.js — owner-facing integrations (stardust dynamics, D2-c). Every entry is an endpoint the source
 * site calls on www.sparebank1.no that the EDS origins cannot call today (CORS-closed, probed from
 * spike-c--sparebank1-redesign--paolomoz.aem.page on 2026-10-15). Each ships `enabled: false`; the block that reads it
 * runs its interim tier until SB1 takes the decision named in `owner` and flips the key. Register:
 * stardust/dynamic-features.md (rows #1, #7, #8, #9).
 */
export const siteConfig = {
  // #1 bank-choice — "Bruk min posisjon": browser coordinates → postcode (the postcode → bank filter itself is client-side
  // and ships live). Block: bank-router renders the position button only when enabled.
  bankChoiceGeolocation: {
    enabled: false,
    endpoint: 'https://www.sparebank1.no/openapi/nettsider/ressurser/bank/postnummer/geolocation/{lat}/{long}',
    owner: 'SB1: allow CORS for the EDS hosts on /openapi/nettsider/ressurser/bank/postnummer/geolocation/*, or name a reverse-geocoding service',
  },
  // #9 currency converter — live rates. Block: converter reads data/currency-converter/valutakurser.json (dated snapshot)
  // until enabled, then this endpoint (same response shape).
  currencyRates: {
    enabled: false,
    endpoint: 'https://www.sparebank1.no/openapi/nettsider/ressurser/bank/valutakurser',
    owner: 'SB1: allow CORS for the EDS hosts on /openapi/nettsider/ressurser/bank/valutakurser (or proxy it same-origin)',
  },
  // #7 loan calculator — the numbers are computed server-side (SIFO budget, tax, stress test, annuity). Not read by any
  // block yet: the interim calculator shell is static; wiring follows the decision.
  loanCalculator: {
    enabled: false,
    endpoints: {
      economy: 'https://www.sparebank1.no/api/personal/banking/boliglan-kalkulator/economy',
      annuityLoan: 'https://www.sparebank1.no/api/personal/banking/boliglan-kalkulator/annuity-loan',
    },
    owner: 'SB1: allow CORS for the EDS hosts on /api/personal/banking/boliglan-kalkulator/* (or proxy it same-origin)',
  },
  // #8 savings calculator — expected return, recommended fund and fund list come from the savings API. Not read by any
  // block yet: the interim calculator shell is static; wiring follows the decision.
  savingsCalculator: {
    enabled: false,
    endpoints: {
      expectedPerformance: 'https://www.sparebank1.no/openapi/personal/banking/savingscalculator/expected-performance',
      suggestedProduct: 'https://www.sparebank1.no/openapi/personal/banking/savingscalculator/suggested-savings-product',
    },
    owner: 'SB1: allow CORS for the EDS hosts on /openapi/personal/banking/savingscalculator/* (or proxy it same-origin)',
  },
};

export default siteConfig;
