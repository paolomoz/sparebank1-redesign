// stardust:dynamics Phase 5 flow harness (spike-a run): drives the SOURCE widget and the migrated block with the same inputs and diffs what a user sees. Usage: [W=360] node stardust/scripts/dynamics/parity/<file> <origin> [path] [out.json]
import { chromium } from 'playwright';
import { writeFileSync } from 'node:fs';
const [,, target, path = '/nb/bank/privat/kundeservice/verktoy/valutakalkulator', out = 'probe-out/fx-parity.json'] = process.argv;
const cases = [[100, 'NOK', 'EUR'], [100, 'NOK', 'DKK'], [100, 'EUR', 'DKK'], [250, 'EUR', 'NOK'], [1234.5, 'USD', 'SEK'], [10000, 'JPY', 'NOK'], [500, 'NOK', 'ISK'], [75, 'GBP', 'CHF'], [1, 'HUF', 'NOK'], [99999, 'NOK', 'VND']];
const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: +(process.env.W || 1440), height: 900 } });
// the source widget is driven at desktop width (its maths does not depend on the viewport); the target at W
const srcCtx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
let srcRates;
async function source() {
  const page = await srcCtx.newPage();
  page.on('response', async (r) => { if (r.url().endsWith('/valutakurser')) srcRates = await r.json(); });
  await page.goto(`https://www.sparebank1.no${path.replace(/^\/spike-a/, "")}.html`, { waitUntil: 'networkidle' });
  await page.evaluate(() => document.querySelector('#opt-in')?.remove());
  const w = page.locator('.currency-converter').first();
  const pick = async (side, c) => {
    const cur = (await w.locator('.toggle-currency-list').nth(side).innerText()).trim();
    if (cur === c) return;
    await w.locator('.toggle-currency-list').nth(side).click(); await page.waitForTimeout(400);
    if (c === 'NOK') await w.locator(`.currency-rates-list.${side ? 'to' : 'from'}-currency button#NOK, .currency-rates-list.${side ? 'to' : 'from'}-currency button:has-text("NOK")`).first().click({ force: true });
    else await w.locator(`.currency-rates-list.${side ? 'to' : 'from'}-currency button#${c}`).first().click({ force: true });
    await page.waitForTimeout(500);
  };
  const res = [];
  for (const [amt, from, to] of cases) {
    // set "to" first when from must become NOK (the widget keeps one side NOK-capable)
    await pick(0, from); await pick(1, to);
    await w.locator('input.input-exchange-amount').fill(String(amt)); await page.waitForTimeout(500);
    const text = (await w.locator('.currency-converter-wrapper').innerText()).replace(/\s+/g, ' ');
    const m = text.match(/Til .*?([\d.]+) 1 ([A-Z]{3}) = ([\d.]+) ?([A-Z]{3})?/);
    res.push({ amt, from, to, result: m?.[1], rate: m ? `1 ${m[2]} = ${m[3]}` : text.slice(0, 160) });
  }
  return res;
}
async function tgt() {
  const page = await ctx.newPage();
  await page.goto(`${target}${path}`, { waitUntil: 'networkidle' });
  await page.waitForFunction(() => document.querySelector('.converter')?.dataset.snapshot);
  const b = page.locator('.converter');
  const res = [];
  for (const [amt, from, to] of cases) {
    await b.locator('#conv-from').selectOption(from); await b.locator('#conv-to').selectOption(to);
    await b.locator('#conv-amount').fill(String(amt)); await page.waitForTimeout(150);
    const result = (await b.locator('.conv-out').innerText()).trim();
    const rate = (await b.locator('.conv-rate').innerText()).trim().replace(/ [A-Z]{3}$/, '');
    res.push({ amt, from, to, result, rate });
  }
  const stamp = await b.locator('.conv-stamp').innerText();
  const snap = await page.evaluate(async () => (await (await fetch('/data/currency/valutakurser.json')).json()).rates);
  return { res, stamp, snap };
}
const s = await source(); const t = await tgt();
const sameRates = JSON.stringify(srcRates.map((r) => [r.currencyCode, r.buyCashRate, r.sellCashRate])) === JSON.stringify(t.snap.map((r) => [r.currencyCode, r.buyCashRate, r.sellCashRate]));
const diffs = s.map((x, i) => ({ src: x, tgt: t.res[i] })).filter(({ src, tgt: y }) => src.result !== y.result || src.rate !== y.rate);
writeFileSync(out, JSON.stringify({ sameRates, stamp: t.stamp, cases: cases.length, diffs, src: s, tgt: t.res }, null, 1));
console.log(`rates identical to source now: ${sameRates} · ${cases.length - diffs.length}/${cases.length} conversions identical · ${t.stamp}`);
diffs.forEach((d) => console.log('DIFF', JSON.stringify(d)));
await browser.close();
process.exit(diffs.length ? 1 : 0);
