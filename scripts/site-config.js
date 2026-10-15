/**
 * scripts/site-config.js — owner-facing integrations (stardust:dynamics D2-c). Every entry is DISABLED: the endpoints are the
 * source host's first-party APIs, which send no CORS headers and so only answer same-origin (on www.sparebank1.no behind its CDN).
 * Flipping `enabled` is the owner's decision (stardust/dynamic-features.md § Decision batch); until then each block ships its interim
 * tier and never calls the network for these features.
 */
export default {
  // #1 bank-choice — "Bruk min posisjon": browser coordinates → postcode (GET <endpoint><lat>/<long> → { postnummer }).
  // Disabled: the button is not rendered (asking for the position with nothing to resolve it would be a dead permission prompt).
  bankChoiceGeolocation: { enabled: false, endpoint: '/openapi/nettsider/ressurser/bank/postnummer/geolocation/' },
  // #7 loan calculator — POST <endpoint>economy | annuity-loan. Disabled: the block computes "Hvor mye koster lånet?" client-side
  // only when the owner approves the formula (`clientFormula`); "Hvor mye kan jeg låne?" needs the bank's model.
  loanCalculator: { enabled: false, endpoint: '/api/personal/banking/boliglan-kalkulator/' },
  // #8 savings calculator — expected-performance / required-savings. Disabled: see blocks/savings-calculator.
  savingsCalculator: { enabled: false, endpoint: '/openapi/personal/banking/savingscalculator/' },
  // #9 currency converter — live rates (GET → [{ currencyCode, currencyName, buyCurrencyChequeRate, sellCurrencyChequeRate, unitNumber }]).
  // Disabled: the converter computes from the page's authored "Valutakursliste" table (frozen rates, dated in the document).
  currencyRates: { enabled: false, endpoint: '/openapi/nettsider/ressurser/bank/valutakurser' },
};
