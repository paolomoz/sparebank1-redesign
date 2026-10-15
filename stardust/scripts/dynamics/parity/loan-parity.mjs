// stardust:dynamics Phase 5 flow harness (spike-a run): drives the SOURCE widget and the migrated block with the same inputs and diffs what a user sees. Usage: [W=360] node stardust/scripts/dynamics/parity/<file> <origin> [path] [out.json]
// #7 parity: tab 2 ("Hvor mye koster lånet?") on the source widget vs the migrated calculator, same inputs; tab 1 at defaults
import { chromium } from 'playwright';
import { writeFileSync } from 'node:fs';
const [,, target, path = '/nb/bank/privat/lan/lanekalkulator', out = 'probe-out/loan-parity.json'] = process.argv;
const cases = [[3000000, 300000, 5.33, 25], [4500000, 1200000, 4.1, 30], [1500000, 0, 9.99, 5], [2200000, 2190000, 5.33, 12], [800000, 50000, 0.01, 1], [6000000, 900000, 7.5, 20]];
const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: +(process.env.W || 1440), height: 1000 } });
const norm = (s) => s.replace(/[\s  ]+/g, ' ').trim();
async function source() {
  const page = await ctx.newPage();
  await page.goto(`https://www.sparebank1.no${path.replace(/^\/spike-a/, "")}.html`, { waitUntil: 'networkidle' });
  await page.evaluate(() => document.querySelector('#opt-in')?.remove()); await page.waitForTimeout(2000);
  const root = page.locator('#boliglan-kalkulator');
  const txt = async () => norm(await page.evaluate(() => [...document.querySelector('#boliglan-kalkulator').shadowRoot.children].map((c) => c.innerText).join('\n')));
  const t1 = await txt();
  await root.getByRole('tab', { name: 'Hvor mye koster lånet?' }).click(); await page.waitForTimeout(1500);
  const res = [];
  for (const [price, eq, rate, years] of cases) {
    const set = async (loc, v) => { await loc.fill(String(v)); await loc.press('Tab'); await page.waitForTimeout(400); };
    await set(root.locator('#kjøpesum'), price); await set(root.locator('#egenkapital'), eq);
    await set(root.getByLabel('Nominell rente verdi'), String(rate).replace('.', ',')); await set(root.getByLabel('Nedbetalingstid verdi'), years);
    await page.waitForTimeout(1500);
    res.push(await txt());
  }
  return { t1, res };
}
async function tgt() {
  const page = await ctx.newPage();
  await page.goto(`${target}${path}`, { waitUntil: 'networkidle' });
  const root = page.locator('.calculator');
  const txt = async () => norm(await root.innerText());
  const t1 = await txt();
  await root.getByRole('tab', { name: 'Hvor mye koster lånet?' }).click(); await page.waitForTimeout(300);
  const res = [];
  for (const [price, eq, rate, years] of cases) {
    const set = async (loc, v) => { await loc.fill(String(v)); await loc.press('Tab'); await page.waitForTimeout(100); };
    await set(root.locator('#calc-1-kjopesum'), price); await set(root.locator('#calc-1-egenkapital'), eq);
    await set(root.locator('#calc-1-rente'), String(rate).replace('.', ',')); await set(root.locator('#calc-1-nedbetalingstid'), years);
    res.push(await txt());
  }
  return { t1, res };
}
const pick = (t) => ({
  monthly: (t.match(/Månedlig beløp ([\d ]+ kr)/) || [])[1],
  eff: (t.match(/Tilsvarer ([\d,]+) % effektiv rente/) || [])[1],
  afterTax: (t.match(/Kostnad etter skattefradrag ([\d ]+) kr/) || [])[1],
  equity: (t.match(/Egenkapital ([\d,]+ %)/) || [])[1],
  share: (t.match(/Lånet er ([\d,]+) % av boligens verdi/) || [])[1],
  pris: (t.match(/Priseksempel: .*? kroner\./) || [])[0],
});
const s = await source(); const t = await tgt();
const rows = cases.map((c, i) => ({ input: c, source: pick(s.res[i]), target: pick(t.res[i]) }));
const diffs = rows.filter((r) => JSON.stringify(r.source) !== JSON.stringify(r.target));
const t1 = { source: { result: (s.t1.match(/Vi tror du kan låne ([\d ]+ kr)/) || [])[1], pris: pick(s.t1).pris }, target: { result: (t.t1.match(/Vi tror du kan låne ([\d ]+ kr)/) || [])[1], pris: pick(t.t1).pris } };
writeFileSync(out, JSON.stringify({ path, t1, rows, diffs }, null, 1));
console.log(`tab 1 default: ${JSON.stringify(t1.source) === JSON.stringify(t1.target) ? 'identical' : 'DIFF'} · tab 2: ${rows.length - diffs.length}/${rows.length} identical`);
if (JSON.stringify(t1.source) !== JSON.stringify(t1.target)) console.log('T1', JSON.stringify(t1));
diffs.forEach((d) => console.log('DIFF', JSON.stringify(d)));
await browser.close();
process.exit(diffs.length ? 1 : 0);
