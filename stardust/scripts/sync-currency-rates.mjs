#!/usr/bin/env node
/**
 * sync-currency-rates.mjs — dynamics #9 sync step. Records the source's currency-rate feed
 * (`/openapi/nettsider/ressurser/bank/valutakurser`, the call the valutakalkulator widget makes on load)
 * from a same-origin browser context on www.sparebank1.no into `data/currency-converter/valutakurser.json`
 * + `_provenance.json`. The feed answers 406 to `Accept: application/json` (why snapshot-api.mjs cannot
 * record it) and is CORS-closed from the EDS origins, so the converter block reads this code-bus snapshot
 * until SB1 exposes a rate feed (owner decision, stardust/dynamic-features.md #9).
 *
 *   node stardust/scripts/sync-currency-rates.mjs [--out data/currency-converter]
 * Then commit + push; the block shows "Kurs per <lastUpdatedDateAndTime>" from the snapshot.
 */
import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { chromium } from 'playwright';

const ORIGIN = 'https://www.sparebank1.no';
const ENTRY = '/nb/bank/privat/kundeservice/verktoy/valutakalkulator.html';
const PATH = '/openapi/nettsider/ressurser/bank/valutakurser';
const outIdx = process.argv.indexOf('--out');
const OUT = outIdx > -1 ? process.argv[outIdx + 1] : 'data/currency-converter';

const browser = await chromium.launch({ headless: true, args: ['--disable-blink-features=AutomationControlled'] });
const page = await browser.newPage();
await page.goto(ORIGIN + ENTRY, { waitUntil: 'domcontentloaded', timeout: 60000 });
const r = await page.evaluate(async (p) => { const res = await fetch(p); return { status: res.status, type: res.headers.get('content-type'), text: await res.text() }; }, PATH);
await browser.close();
if (r.status !== 200) { console.error(`[sync-currency-rates] ${PATH} → ${r.status}`); process.exit(1); }
const rates = JSON.parse(r.text);
if (!Array.isArray(rates) || rates.length < 2) { console.error('[sync-currency-rates] unexpected shape'); process.exit(1); }
const updated = Math.max(...rates.map((x) => x.lastUpdatedDateAndTime || 0));
mkdirSync(OUT, { recursive: true });
writeFileSync(join(OUT, 'valutakurser.json'), `${JSON.stringify(rates, null, 1)}\n`);
writeFileSync(join(OUT, '_provenance.json'), `${JSON.stringify({
  writtenBy: 'stardust/scripts/sync-currency-rates.mjs (dynamics #9 sync step)',
  writtenAt: new Date().toISOString(),
  origin: ORIGIN,
  entry: ENTRY,
  call: { method: 'GET', path: PATH, status: r.status, contentType: r.type, bytes: r.text.length, rows: rates.length },
  ratesUpdatedAt: new Date(updated * 1000).toISOString(),
  unfreeze: 'SB1 exposes the rate feed cross-origin (or a same-origin proxy on the EDS host) → set siteConfig.currencyRates.endpoint and enabled: true in scripts/site-config.js',
}, null, 1)}\n`);
console.error(`[sync-currency-rates] ${rates.length} currencies, rates updated ${new Date(updated * 1000).toISOString()} → ${OUT}`);
