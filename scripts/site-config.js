/**
 * scripts/site-config.js — owner-facing integrations for the dynamic features (stardust/dynamic-features.md). Every live
 * service on www.sparebank1.no is listed with the exact endpoint the source calls; all are DISABLED on the migration host
 * because the services send no CORS headers (a browser on another origin cannot call them). Until an owner enables one —
 * by opening CORS for the EDS host or routing the path same-origin — the feature runs on its committed snapshot or shows
 * its interim state. Flipping `enabled` is the whole switch; the request/response contract is already wired.
 */
const SOURCE = 'https://www.sparebank1.no';

const CONFIG = {
  /** #1a "Bruk min posisjon": coordinates → postcode. Interim: the button is not rendered. */
  bankChoiceGeolocation: {
    enabled: false,
    url: `${SOURCE}/openapi/nettsider/ressurser/bank/postnummer/geolocation/{lat}/{lon}`,
    owner: 'SB1: expose the geolocation → postnummer service cross-origin (or same-origin) for the EDS host',
  },
  /** #1 postcode → bank: the banks' postal ranges (snapshot of window.bankPickerlist; no service involved). */
  bankChoiceData: { snapshot: '/data/bank-choice/banks.json' },
  /** #7a "Hvor mye kan jeg låne?": the SIFO/tax/stress-test model. Interim: default example only, recalculation not connected. */
  loanEconomy: {
    enabled: false,
    url: `${SOURCE}/api/personal/banking/boliglan-kalkulator/economy`,
    owner: 'SB1: expose the boliglån-kalkulator economy API cross-origin (CORS) or same-origin for the EDS host',
    sourceCalculator: `${SOURCE}/nb/bank/privat/lan/lanekalkulator.html`,
  },
  /** #8 savings calculator: expected return + suggested product per (risk × years) (snapshot; the maths is client-side). */
  savingsAssumptions: {
    snapshot: '/data/savings-calculator/assumptions.json',
    source: `${SOURCE}/openapi/personal/banking/savingscalculator/{expected-performance,suggested-savings-product}`,
    owner: 'SB1: own the assumption table (sync-snapshots.mjs savings) — the fund factsheet (#8a) needs the fund data feed',
  },
  /** #9 currency converter + rate list: the bank's daily rates (snapshot, dated). */
  currencyRates: {
    enabled: false,
    url: `${SOURCE}/openapi/nettsider/ressurser/bank/valutakurser`,
    snapshot: '/data/currency/valutakurser.json',
    owner: 'SB1: rate feed — expose valutakurser cross-origin, or schedule sync-snapshots.mjs currency',
  },
};
export default CONFIG;

/** Fetch a feature's live endpoint when enabled, else (or on failure) its committed snapshot. */
export async function loadFeatureData(key) {
  const cfg = CONFIG[key];
  if (cfg.enabled && cfg.url) {
    try {
      const res = await fetch(cfg.url, { headers: { accept: 'application/vnd.sparebank1.v1+json' } });
      if (res.ok) return { live: true, data: await res.json() };
    } catch { /* fall back to the snapshot */ }
  }
  if (!cfg.snapshot) return null;
  const res = await fetch(`${window.hlx?.codeBasePath || ''}${cfg.snapshot}`);
  return res.ok ? { live: false, data: await res.json() } : null;
}
