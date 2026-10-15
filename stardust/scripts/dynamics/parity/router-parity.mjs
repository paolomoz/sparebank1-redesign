// stardust:dynamics Phase 5 flow harness (spike-a run): drives the SOURCE widget and the migrated block with the same inputs and diffs what a user sees. Usage: [W=360] node stardust/scripts/dynamics/parity/<file> <origin> [path] [out.json]
// router parity: same inputs on the source bank-choice and the migrated bank-router; compare visible banks (order), toggle label, links
import { chromium } from 'playwright';
import { writeFileSync } from 'node:fs';
const [,, target, pagePath = '/nb/bank/privat/lan/boliglan', out = 'probe-out/router-parity.json'] = process.argv;
const codes = ['0150', '5003', '7010', '9008', '4010', '0000', '2610', '8000', '6900', '3530', '1450', '9990', '0050', '1295', '2985', '6719', '8986', '7980', '3000', '5500', '1920', '2000', '9170', '6413', '4626', '1530', '3710', '8622', '7500', '5265'];
const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: +(process.env.W || 1440), height: 900 }, locale: 'nb-NO' });
async function run(side) {
  const page = await ctx.newPage();
  const isSrc = side === 'source';
  await page.goto(isSrc ? `https://www.sparebank1.no${pagePath.replace(/^\/spike-a/, "")}.html` : `${target}${pagePath}`, { waitUntil: 'networkidle' });
  await page.evaluate(() => document.querySelector('#opt-in')?.remove());
  if (!isSrc) await page.waitForFunction(() => document.querySelector('.bank-router')?.dataset.snapshot, null, { timeout: 15000 });
  const root = isSrc ? '.bank-choice' : '.bank-router';
  const read = () => page.evaluate((r) => {
    const e = document.querySelector(r); const vis = (n) => !!(n.offsetWidth || n.offsetHeight || n.getClientRects().length);
    const names = [...e.querySelectorAll('a')].filter(vis).map((a) => a.innerText.split('\n')[0].replace(/\s+/g, ' ').trim().replace(/^Fortsett til /, '→ ')).filter((t) => /^(→ )?SpareBank 1/.test(t));
    const btn = [...e.querySelectorAll('button')].filter(vis).map((b) => b.innerText.trim()).find((t) => /banker|bankene/.test(t)) || '';
    const links = Object.fromEntries([...e.querySelectorAll('a')].filter(vis).map((a) => [a.innerText.split('\n')[0].replace(/\s+/g, ' ').trim(), new URL(a.getAttribute('href'), 'https://www.sparebank1.no').pathname]).filter(([k]) => /SpareBank 1/.test(k)));
    return { names, btn, links };
  }, root);
  const res = {};
  const input = page.locator(`${root} #postnummer-input`).first();
  const expand = async () => { await page.locator(root).getByRole('button', { name: /Se alle banker/ }).first().click(); await page.waitForTimeout(300); };
  await expand(); res.links = (await read()).links; await page.locator(root).getByRole('button', { name: /Skjul bankene/ }).first().click(); await page.waitForTimeout(300);
  res.initial = await read();
  for (const c of codes) { await input.fill(''); await input.fill(c); await page.waitForTimeout(250); res[c] = await read(); }
  await input.fill('9008'); await page.waitForTimeout(250); await page.locator(root).getByRole('button', { name: /Se resten av bankene/ }).first().click(); await page.waitForTimeout(300); res['9008+rest'] = await read();
  await input.fill('ab'); await page.waitForTimeout(250); res.invalid = await page.evaluate((r) => document.querySelector(r).innerText.includes('Skriv inn et gyldig postnummer (4 siffer).'), root);
  await page.close();
  return res;
}
const src = await run('source'); const tgt = await run('target');
const diffs = [];
for (const k of Object.keys(src)) {
  const a = JSON.stringify(src[k]); const b = JSON.stringify(tgt[k]);
  if (a !== b) diffs.push({ step: k, source: src[k], target: tgt[k] });
}
writeFileSync(out, JSON.stringify({ target, pagePath, steps: Object.keys(src).length, diffs, src, tgt }, null, 1));
console.log(`${pagePath}: ${Object.keys(src).length - diffs.length}/${Object.keys(src).length} steps identical`);
for (const d of diffs.slice(0, 6)) console.log('DIFF', d.step, JSON.stringify(d.source).slice(0, 300), '\n  vs', JSON.stringify(d.target).slice(0, 300));
await browser.close();
process.exit(diffs.length ? 1 : 0);
