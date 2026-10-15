// stardust:dynamics Phase 5 flow harness (spike-a run): drives the SOURCE widget and the migrated block with the same inputs and diffs what a user sees. Usage: [W=360] node stardust/scripts/dynamics/parity/<file> <origin> [path] [out.json]
import { chromium } from 'playwright';
import { readFileSync, writeFileSync } from 'node:fs';
const [,, target, repo] = process.argv;
const path = process.env.P || '/nb/bank/privat/lan/lanekalkulator';
const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: +(process.env.W || 1440), height: 1000 } });
const norm = (s) => s.replace(/[\s  ]+/g, ' ').trim();
const out = {};
// 1) payment plan, default inputs: source vs target, year rows + total
{
  const page = await ctx.newPage();
  await page.goto(`https://www.sparebank1.no${path.replace(/^\/spike-a/, '')}.html`, { waitUntil: 'networkidle' });
  await page.evaluate(() => document.querySelector('#opt-in')?.remove()); await page.waitForTimeout(2000);
  const root = page.locator('#boliglan-kalkulator');
  await root.getByRole('tab', { name: 'Hvor mye koster lånet?' }).click(); await page.waitForTimeout(1500);
  await root.getByRole('button', { name: 'Vis nedbetalingsplan' }).click(); await page.waitForTimeout(800);
  const src = await page.evaluate(() => [...document.querySelector('#boliglan-kalkulator').shadowRoot.querySelectorAll('table tr')].map((tr) => [...tr.children].map((c) => c.innerText.replace(/[›\s  ]+/g, ' ').trim()).join(' | ')));
  const p2 = await ctx.newPage();
  await p2.goto(`${target}${path}`, { waitUntil: 'networkidle' });
  const r2 = p2.locator('.calculator');
  await r2.getByRole('tab', { name: 'Hvor mye koster lånet?' }).click();
  await r2.getByRole('button', { name: 'Vis nedbetalingsplan' }).click(); await p2.waitForTimeout(300);
  const tgt = await p2.evaluate(() => [...document.querySelectorAll('.calculator .calc-plan tr')].filter((tr) => !tr.hidden).map((tr) => [...tr.children].map((c) => c.innerText.replace(/[›\s  ]+/g, ' ').trim()).join(' | ')));
  const diff = src.map((r, i) => (r === tgt[i] ? null : { i, src: r, tgt: tgt[i] })).filter(Boolean);
  out.plan = { rows: src.length, identical: src.length - diff.length, diff: diff.slice(0, 5) };
  console.log(`payment plan: ${src.length - diff.length}/${src.length} rows identical`, diff.slice(0, 3));
  // 2) tab 1 non-default → not connected
  await r2.getByRole('tab', { name: 'Hvor mye kan jeg låne?' }).click();
  await r2.locator('.calc-pills').nth(0).getByRole('button', { name: '2', exact: true }).click(); await p2.waitForTimeout(200);
  out.notConnected = { noteVisible: await r2.locator('.calc-not-connected').isVisible(), text: norm(await r2.locator('.calc-not-connected').innerText()), resultEmpty: (await r2.locator('.calc-result-value').first().innerText()).trim() === '' };
  console.log('not connected state:', JSON.stringify(out.notConnected));
}
// 3) owner-enabled economy endpoint: same inputs on the source widget and on the target with enabled:true (proxied)
{
  const inputs = { borrowers: '2', kids: '2', cars: '1', income: '900000' };
  const page = await ctx.newPage();
  await page.goto(`https://www.sparebank1.no${path.replace(/^\/spike-a/, '')}.html`, { waitUntil: 'networkidle' });
  await page.evaluate(() => document.querySelector('#opt-in')?.remove()); await page.waitForTimeout(2000);
  const root = page.locator('#boliglan-kalkulator');
  let srcBody;
  page.on('request', (r) => { if (r.url().endsWith('/economy')) srcBody = r.postData(); });
  await root.getByRole('button', { name: inputs.borrowers, exact: true }).first().click(); await page.waitForTimeout(1200);
  await root.locator('button', { hasText: /^2$/ }).nth(1).click(); await page.waitForTimeout(1200);
  await root.locator('button', { hasText: /^1$/ }).nth(2).click(); await page.waitForTimeout(1200);
  await root.locator('#samlet-inntekt-før-skatt').fill(inputs.income); await root.locator('#samlet-inntekt-før-skatt').blur(); await page.waitForTimeout(2500);
  const srcText = norm(await page.evaluate(() => [...document.querySelector('#boliglan-kalkulator').shadowRoot.children].map((c) => c.innerText).join('\n')));
  const p2 = await ctx.newPage();
  const cfg = readFileSync(`${repo}/scripts/site-config.js`, 'utf8').replace(/(loanEconomy: \{\n\s+enabled: )false/, '$1true');
  await p2.route('**/scripts/site-config.js', (r) => r.fulfill({ contentType: 'text/javascript', body: cfg }));
  let tgtBody;
  await p2.route('https://www.sparebank1.no/api/personal/banking/boliglan-kalkulator/economy', async (r) => {
    tgtBody = r.request().postData();
    const res = await fetch(r.request().url(), { method: 'POST', headers: { 'content-type': 'application/json', accept: 'application/vnd.sparebank1.v1+json' }, body: tgtBody });
    r.fulfill({ status: res.status, contentType: 'application/json', headers: { 'access-control-allow-origin': '*' }, body: await res.text() });
  });
  await p2.goto(`${target}${path}`, { waitUntil: 'networkidle' });
  const r2 = p2.locator('.calculator');
  await r2.locator('.calc-pills').nth(0).getByRole('button', { name: '2', exact: true }).click();
  await r2.locator('.calc-pills').nth(1).getByRole('button', { name: '2', exact: true }).click();
  await r2.locator('.calc-pills').nth(2).getByRole('button', { name: '1', exact: true }).click();
  await r2.locator('#calc-1-inntekt').fill(inputs.income); await r2.locator('#calc-1-inntekt').press('Tab'); await p2.waitForTimeout(2500);
  const tgtText = norm(await r2.innerText());
  const pick = (t) => ({ result: (t.match(/Vi tror du kan låne ([\d ]+ kr)/) || [])[1], pris: (t.match(/Priseksempel: .*? kroner\./) || [])[0] });
  out.economyWired = { source: pick(srcText), target: pick(tgtText), sameRequestBody: JSON.stringify(JSON.parse(srcBody)) === JSON.stringify(JSON.parse(tgtBody)), srcBody, tgtBody };
  console.log('economy wired (owner-enabled, proxied):', JSON.stringify({ source: out.economyWired.source, target: out.economyWired.target, sameRequestBody: out.economyWired.sameRequestBody }));
}
writeFileSync(process.env.OUTF || 'probe-out/loan-extra.json', JSON.stringify(out, null, 1));
await browser.close();
