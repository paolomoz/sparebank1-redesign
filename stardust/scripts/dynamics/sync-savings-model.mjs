#!/usr/bin/env node
/**
 * sync-savings-model.mjs — dynamics #8 (savings calculator): refresh the model the savings-calculator block computes with.
 *
 * The source widget asks /openapi/personal/banking/savingscalculator/* for every result; those answers are a closed formula
 * (annual rate r per product package, monthly deposits at the start of each month — blocks/savings-calculator/savings-math.js)
 * over a configured table: (risk × horizon bucket) → package → r. This script OBSERVES that table from the public API — the rate
 * is a response field (`nominalExpectedAnnualReturn`), the package a response of `suggested-savings-product` — for every risk at
 * both sides of every bucket edge, checks the edges, and writes data/savings-calculator/model.json + _provenance.json.
 * ~45 sequential GETs, 1 s apart. Exit 1 when the observed structure no longer fits the bucket model (re-analyse the widget).
 *
 *   node stardust/scripts/dynamics/sync-savings-model.mjs [--out data/savings-calculator]
 */
import { writeFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';

const out = (() => { const i = process.argv.indexOf('--out'); return i > 0 ? process.argv[i + 1] : 'data/savings-calculator'; })();
const HOST = 'https://www.sparebank1.no';
const BASE = '/openapi/personal/banking/savingscalculator';
const UA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130 Safari/537.36';
const HEADERS = { 'user-agent': UA, accept: 'application/vnd.sparebank1.v1+json; charset=utf-8' };
// Package → ISIN, as hard-coded in the source bundle (map `Sa` in /bank/nettsider-privat/fond/static/sparekalkulator.js).
const ISIN = { 'Alt-i-ett 20': 'NO0010841000', 'Alt-i-ett 50': 'NO0010841042', 'Alt-i-ett 80': 'NO0010841075', 'Alt-i-ett 100': 'NO0012619024' };
const RISKS = ['none', 'low', 'medium', 'high'];
const BUCKETS = [{ maxYears: 1, probe: [0, 1] }, { maxYears: 4, probe: [2, 4] }, { maxYears: 9, probe: [5, 9] }, { maxYears: null, probe: [10, 50] }];

const sleep = (ms) => new Promise((r) => { setTimeout(r, ms); });
let calls = 0;
async function get(path, accept) {
  if (calls) await sleep(1000);
  calls += 1;
  const res = await fetch(HOST + path, { headers: accept ? { ...HEADERS, accept } : HEADERS });
  if (!res.ok) throw new Error(`${res.status} ${path}`);
  return res.json();
}

const ladder = {}; const packages = {}; const rateAt = {};
for (const risk of RISKS) {
  ladder[risk] = [];
  for (const { probe } of BUCKETS) {
    const rates = [];
    for (const years of probe) {
      const j = await get(`${BASE}/expected-performance?initialValue=10000&periodicInvestment=0&years=${years}&risk=${risk}`);
      rates.push(j.nominalExpectedAnnualReturn); rateAt[`${risk}@${years}`] = j.nominalExpectedAnnualReturn;
    }
    if (rates[0] !== rates[1]) { console.error(`bucket edge moved: ${risk} ${probe.join('/')} → ${rates.join('/')}`); process.exit(1); }
    const years = Math.max(1, probe[0]);
    const { recommendedProductPackages: [pkg] } = await get(`${BASE}/suggested-savings-product?years=${years}&risk=${risk}`);
    const prev = packages[pkg.name];
    if (prev && prev.rate !== rates[0]) { console.error(`package ${pkg.name} has two rates: ${prev.rate} / ${rates[0]}`); process.exit(1); }
    packages[pkg.name] = { id: pkg.id, rate: rates[0], description: pkg.description, isin: ISIN[pkg.name] || null };
    ladder[risk].push(pkg.name);
  }
}

// Display names of the funds ("SpareBank 1 Alt-i-ett 50 N"), as the widget shows them (products/available, generic bank).
try {
  const list = await get('/openapi/personal/banking/fund/products/available?fid=fid-ostlandet', 'application/vnd.sparebank1.v3+json; charset=utf-8');
  Object.values(packages).forEach((p) => { const f = p.isin && list.find((x) => x.isin === p.isin); if (f) p.fund = f.name; });
} catch (e) { console.error(`fund names: ${e.message} (kept without)`); }

mkdirSync(out, { recursive: true });
const model = { buckets: BUCKETS.map((b) => b.maxYears), ladder, packages };
writeFileSync(join(out, 'model.json'), `${JSON.stringify(model, null, 1)}\n`);
writeFileSync(join(out, '_provenance.json'), `${JSON.stringify({
  writtenBy: 'stardust:dynamics #8 savings calculator (stardust/scripts/dynamics/sync-savings-model.mjs)',
  writtenAt: new Date().toISOString(),
  source: `${HOST}${BASE}/{expected-performance,suggested-savings-product} + /openapi/personal/banking/fund/products/available`,
  observed: rateAt,
  calls,
  note: 'Rates are SpareBank 1\'s configured expected annual returns per product package (not live fund data). Re-run to refresh; the block shows the snapshot date.',
}, null, 1)}\n`);
console.log(`${Object.keys(packages).length} packages · ladder ${JSON.stringify(ladder)} · ${calls} calls → ${join(out, 'model.json')}`);
