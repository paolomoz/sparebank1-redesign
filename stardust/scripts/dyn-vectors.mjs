#!/usr/bin/env node
/**
 * dyn-vectors.mjs — records an input → output table for a dynamic feature on any origin (the SOURCE widget or the rebuilt
 * block on the target), in the same table format as the dynamics skill's `client-logic.mjs vectors`, so
 * `client-logic.mjs diff` compares them. Exists because the source's consent dialog (#opt-in) intercepts the
 * triple-click that `vectors` uses to clear a field, and because outputs here are often lists (bank names), not one node.
 *
 *   node stardust/scripts/dyn-vectors.mjs --url <page> --spec <spec.json> --out <table.json> [--label source|target] [--width 1440]
 *
 * spec: {
 *   "inputs":  { key: css },                       text → fill, <select> → selectOption(value), "click:" prefix in the
 *                                                  row value clicks the nth match ("click:1")
 *   "outputs": { key: css | { css, all: true } },  text of the first match, or every match joined with " · "
 *   "press"?:  key pressed in the last input after filling ("Enter"),
 *   "settleMs"?: n, "reload"?: true (fresh page per row; default reuses the page and clears inputs)
 *   "rows": [{ key: value, … }]
 * }
 * Selectors pierce open shadow roots (Playwright CSS). Overlays that intercept pointer events on the source
 * (`#opt-in` consent dialog) are removed before each row; the target has none.
 */
/* eslint-disable no-await-in-loop, no-restricted-syntax */
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname } from 'node:path';
import { chromium } from 'playwright';

const arg = (k, d) => { const i = process.argv.indexOf(`--${k}`); return i > -1 ? process.argv[i + 1] : d; };
const url = arg('url'); const spec = JSON.parse(readFileSync(arg('spec'), 'utf8')); const out = arg('out');
const label = arg('label', 'source'); const width = Number(arg('width', 1440));
if (!url || !out) { console.error('usage: dyn-vectors.mjs --url <page> --spec <spec.json> --out <table.json>'); process.exit(2); }

const browser = await chromium.launch({ headless: true, args: ['--disable-blink-features=AutomationControlled'] });
const page = await browser.newPage({ viewport: { width, height: 1000 }, screen: { width, height: 1000 } });
const norm = (t) => (t == null ? null : t.replace(/\s+/g, ' ').trim());
const open = async () => {
  await page.goto(url, { waitUntil: 'networkidle', timeout: 60000 }).catch(() => {});
  await page.locator(Object.values(spec.inputs)[0]).first().waitFor({ timeout: 30000 });
  await page.waitForTimeout(800);
  await page.evaluate(() => document.querySelector('#opt-in')?.remove());
};
const rows = [];
await open();
for (const [i, row] of spec.rows.entries()) {
  const r = { i, input: row, output: {} };
  try {
    if (spec.reload && i) await open();
    const keys = Object.keys(spec.inputs).filter((k) => k in row);
    for (const key of keys) {
      const loc = page.locator(spec.inputs[key]); const v = String(row[key]);
      if (v.startsWith('click:')) { await loc.nth(Number(v.slice(6))).click(); continue; }
      const tag = await loc.first().evaluate((el) => el.tagName.toLowerCase());
      if (tag === 'select') await loc.first().selectOption(v);
      else { await loc.first().fill(''); await page.waitForTimeout(150); await loc.first().fill(v); }
    }
    if (spec.press && keys.length) await page.locator(spec.inputs[keys[keys.length - 1]]).first().press(spec.press);
    await page.waitForTimeout(spec.settleMs ?? 700);
    for (const [key, o] of Object.entries(spec.outputs)) {
      const css = typeof o === 'string' ? o : o.css;
      if (typeof o === 'object' && o.all) {
        const texts = await page.locator(css).evaluateAll((els) => els.filter((e) => e.offsetParent !== null || e.getClientRects().length).map((e) => e.textContent));
        r.output[key] = texts.map(norm).filter(Boolean).join(' · ');
      } else {
        const loc = page.locator(css).first();
        r.output[key] = (await loc.count()) && (await loc.isVisible().catch(() => false)) ? norm(await loc.textContent()) : '';
      }
    }
  } catch (e) { r.error = String(e.message || e).slice(0, 200); }
  rows.push(r); console.error(`[dyn-vectors] ${i + 1}/${spec.rows.length} ${JSON.stringify(r.input)} → ${JSON.stringify(r.output).slice(0, 160)}`);
}
await browser.close();
mkdirSync(dirname(out), { recursive: true });
writeFileSync(out, `${JSON.stringify({ writtenBy: 'stardust/scripts/dyn-vectors.mjs', writtenAt: new Date().toISOString(), url, label, width, rows }, null, 1)}\n`);
console.error(`[dyn-vectors] ${rows.length} rows → ${out}`);
