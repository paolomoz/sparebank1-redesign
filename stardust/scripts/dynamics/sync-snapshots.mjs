#!/usr/bin/env node
/**
 * sync-snapshots.mjs — stardust:dynamics Phase 4 (off-origin-data Tier 2): refresh the code-bus snapshots that feed
 * #1 bank-choice, #8 savings calculator and #9 currency converter on the migration host. The source services send no CORS
 * headers, so the browser on the new host cannot call them; these files are what the blocks read until the owner opens them
 * (scripts/site-config.js). Snapshots age — every file carries `snapshotAt`, the blocks expose it as `data-snapshot`.
 *
 *   node stardust/scripts/dynamics/sync-snapshots.mjs [bank|currency|savings|all] [--pace 150]
 *
 * Writes data/<feature>/*.json + data/<feature>/_provenance.json (committed, served from the code bus).
 *   bank      data/bank-choice/banks.json      the 12 banks' postal ranges (window.bankPickerlist on the source pages) + the
 *                                              per-page bank link targets for every roster page that carries the picker
 *   currency  data/currency/valutakurser.json  GET /openapi/nettsider/ressurser/bank/valutakurser
 *   savings   data/savings-calculator/assumptions.json  expected annual return + suggested product per (risk × 0–50 years),
 *                                              fund display names (GET …/savingscalculator/*, …/fund/products/available)
 */
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';

const SRC = 'https://www.sparebank1.no';
const H = { 'user-agent': 'Mozilla/5.0 (stardust dynamics sync)', accept: 'application/vnd.sparebank1.v1+json, text/html' };
const what = process.argv[2] && !process.argv[2].startsWith('--') ? process.argv[2] : 'all';
const pi = process.argv.indexOf('--pace');
const PACE = pi > -1 ? Number(process.argv[pi + 1]) : 150;
const sleep = (ms) => new Promise((r) => { setTimeout(r, ms); });
const now = new Date().toISOString();
const write = (dir, file, obj) => { mkdirSync(`data/${dir}`, { recursive: true }); writeFileSync(`data/${dir}/${file}`, `${JSON.stringify(obj, null, 1)}\n`); };
const get = async (path, type = 'json', accept = H.accept) => { const r = await fetch(`${SRC}${path}`, { headers: { ...H, accept } }); if (!r.ok) throw new Error(`${r.status} ${path}`); return type === 'json' ? r.json() : r.text(); };

/** window.bankPickerlist as the source page renders it (server-side <script> pushes). */
function bankPickerlist(html) {
  return [...html.matchAll(/bankPickerlist\.push\(\s*(\{[\s\S]*?\})\s*\);/g)]
    .map((m) => JSON.parse(m[1].replace(/JSON\.parse\('(.*?)'\)/g, '$1')));
}

async function bank() {
  const home = bankPickerlist(await get('/nb/bank/privat.html', 'text'));
  const banks = home.map((b) => ({
    shortName: b.bankShortName, name: b.bankName, prefix: b.url.replace(/privat\.html$/, ''), logo: b.logo ? `${SRC}${b.logo}` : null, postalRange: b.postalRange,
  }));
  // per page: does every bank link follow "same path under the bank"? record the exceptions verbatim
  const state = JSON.parse(readFileSync('stardust/state.json', 'utf8'));
  const urls = (Array.isArray(state.pages) ? state.pages : Object.values(state.pages)).map((p) => p.url || p.source).filter(Boolean);
  const pages = {};
  let withPicker = 0;
  for (const u of urls) {
    const path = new URL(u, SRC).pathname;
    const list = bankPickerlist(await get(path, 'text'));
    await sleep(PACE);
    if (!list.length) continue;
    withPicker += 1;
    const eds = path.replace(/\.html$/, '');
    const rest = path.replace(/^\/nb\/bank\//, '');
    const off = list.filter((b) => b.url !== `${banks.find((x) => x.shortName === b.bankShortName)?.prefix}${rest}`);
    pages[eds] = off.length ? Object.fromEntries(list.map((b) => [b.bankShortName, b.url])) : 'same-path';
  }
  const doc = {
    snapshotAt: now, source: `${SRC}/nb/bank/privat.html (window.bankPickerlist)`, rule: 'link = <bank prefix> + <page path after /nb/bank/>.html', banks, pages,
  };
  write('bank-choice', 'banks.json', doc);
  write('bank-choice', '_provenance.json', {
    writtenBy: 'stardust:dynamics sync-snapshots.mjs bank', fetchedAt: now, sources: [`${SRC}/nb/bank/privat.html`, `${urls.length} roster pages (stardust/state.json)`], banks: banks.length, pagesWithPicker: withPicker, exceptionPages: Object.values(pages).filter((v) => v !== 'same-path').length,
  });
  console.log(`bank: ${banks.length} banks, ${withPicker} picker pages, ${Object.values(pages).filter((v) => v !== 'same-path').length} with per-bank exceptions`);
}

async function currency() {
  const rates = await get('/openapi/nettsider/ressurser/bank/valutakurser');
  const updated = Math.max(...rates.map((r) => r.lastUpdatedDateAndTime || 0));
  write('currency', 'valutakurser.json', {
    snapshotAt: now, ratesUpdatedAt: updated ? new Date(updated * 1000).toISOString() : null, source: `${SRC}/openapi/nettsider/ressurser/bank/valutakurser`, rates,
  });
  write('currency', '_provenance.json', {
    writtenBy: 'stardust:dynamics sync-snapshots.mjs currency', fetchedAt: now, sources: [`${SRC}/openapi/nettsider/ressurser/bank/valutakurser`], currencies: rates.length,
  });
  console.log(`currency: ${rates.length} currencies, rates updated ${updated ? new Date(updated * 1000).toISOString() : '?'}`);
}

async function savings() {
  const risks = ['none', 'low', 'medium', 'high'];
  const expectedReturn = {}; const product = {};
  for (const risk of risks) {
    expectedReturn[risk] = []; product[risk] = [];
    for (let years = 0; years <= 50; years += 1) {
      const e = await get(`/openapi/personal/banking/savingscalculator/expected-performance?initialValue=0&periodicInvestment=0&years=${years}&risk=${risk}`);
      const p = await get(`/openapi/personal/banking/savingscalculator/suggested-savings-product?years=${years}&risk=${risk}`);
      expectedReturn[risk].push(e.nominalExpectedAnnualReturn);
      product[risk].push(p.recommendedProductPackages?.[0]?.name || null);
      await sleep(PACE);
    }
  }
  // the widget maps package → ISIN (its own table) and shows the fund's display name from the fund catalogue
  const isin = {
    Sparekonto: null, 'Alt-i-ett 20': 'NO0010841000', 'Alt-i-ett 50': 'NO0010841042', 'Alt-i-ett 80': 'NO0010841075', 'Alt-i-ett 100': 'NO0012619024',
  };
  const funds = await get('/openapi/personal/banking/fund/products/available?fid=fid-ostlandet', 'json', 'application/vnd.sparebank1.v3+json');
  const products = Object.fromEntries(Object.entries(isin).map(([name, id]) => [name, { isin: id, displayName: id ? funds.find((f) => f.isin === id)?.name || name : name }]));
  write('savings-calculator', 'assumptions.json', {
    snapshotAt: now, source: `${SRC}/openapi/personal/banking/savingscalculator/*`, years: '0..50 (index = years)', expectedReturn, product, products,
  });
  write('savings-calculator', '_provenance.json', {
    writtenBy: 'stardust:dynamics sync-snapshots.mjs savings', fetchedAt: now, sources: [`${SRC}/openapi/personal/banking/savingscalculator/expected-performance`, `${SRC}/openapi/personal/banking/savingscalculator/suggested-savings-product`, `${SRC}/openapi/personal/banking/fund/products/available?fid=fid-ostlandet`], grid: '4 risks × 51 years',
  });
  console.log(`savings: ${risks.length}×51 grid, products ${Object.keys(products).length}`);
}

if (what === 'bank' || what === 'all') await bank();
if (what === 'currency' || what === 'all') await currency();
if (what === 'savings' || what === 'all') await savings();
