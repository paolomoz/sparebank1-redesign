// stardust:dynamics Phase 5 flow harness (spike-a run): drives the SOURCE widget and the migrated block with the same inputs and diffs what a user sees. Usage: [W=360] node stardust/scripts/dynamics/parity/<file> <origin> [path] [out.json]
import { chromium } from 'playwright';
import { writeFileSync } from 'node:fs';
const [,, target, out = 'probe-out/save-parity.json'] = process.argv;
const P = '/nb/bank/privat/kundeservice/verktoy/sparekalkulator';
const monthly = [[500, 6000, 5, 'medium'], [2000, 0, 20, 'high'], [100, 1000000, 1, 'low'], [20000, 50000, 50, 'none'], [3500, 250000, 12, 'high'], [0, 10000, 0, 'medium'], [1500, 30000, 7, 'low']];
const goal = [[200000, 20000, 20, 'high'], [1000000, 0, 10, 'medium'], [50000, 60000, 3, 'low'], [5000000, 1000000, 50, 'none'], [300000, 25000, 4, 'medium']];
const norm = (s) => s.replace(/[\s  ]+/g, ' ').trim();
const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: +(process.env.W || 1440), height: 1000 } });
const pick = (t, tab) => ({
  big: (t.match(tab ? /Hver måned må du spare: ([\d ]+ kr) \*/ : /Forventet beløp: ([\d ]+ kr) \*/) || [])[1],
  ret: (t.match(/Avkastning før skatt ([−-]?[\d ]+ kr)/) || [])[1],
  saved: (t.match(/Du har spart ([\d ]+ kr)/) || [])[1],
  total: tab ? (t.match(/Totalt beløp ([\d ]+ kr)/) || [])[1] : undefined,
  product: (t.match(/risikotoleransen har valgt (.+?)\. Oversikt/) || [])[1],
  profile: (t.match(/(Ingen|Forsiktig profil|Moderat profil|Offensiv profil) (Du ønsker|Passer)/) || [])[1],
  compare: [...t.matchAll(/(Ingen|Lav|Medium|Høy) risiko: (.+?) ([\d,]+ %) (?:Forventet beløp|Hver måned må du spare): ([\d ]+ kr)/g)].map((m) => `${m[1]}|${m[2]}|${m[3]}|${m[4]}`),
});
async function source() {
  const page = await ctx.newPage();
  await page.goto(`https://www.sparebank1.no${P}.html`, { waitUntil: 'networkidle' });
  await page.evaluate(() => document.querySelector('#opt-in')?.remove()); await page.waitForTimeout(2500);
  const root = page.locator('#sparekalkulator');
  const txt = async () => norm(await page.evaluate(() => [...document.querySelector('#sparekalkulator').shadowRoot.children].filter((c) => c.tagName !== 'STYLE').map((c) => c.innerText).join('\n')));
  await root.getByRole('button', { name: 'Se avkastning med ulik risiko' }).click(); await page.waitForTimeout(1500);
  const run = async (cases, tab) => {
    const res = [];
    for (const [a, b, y, risk] of cases) {
      const ins = root.locator('input[type=text]');
      const set = async (i, v) => {
        await page.evaluate(([k, val]) => {
          const inp = document.querySelector('#sparekalkulator').shadowRoot.querySelectorAll('input[type=text]')[k];
          inp.focus();
          Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set.call(inp, String(val));
          inp.dispatchEvent(new Event('input', { bubbles: true }));
          inp.dispatchEvent(new Event('change', { bubbles: true }));
          inp.blur();
        }, [i, v]);
        await page.waitForTimeout(400);
      };
      await set(0, a); await set(1, b); await set(2, y);
      await root.locator('select').selectOption(risk); await page.waitForTimeout(2500);
      const vals = await page.evaluate(() => [...document.querySelector('#sparekalkulator').shadowRoot.querySelectorAll('input[type=text]')].map((x) => x.value.replace(/\D/g, '')));
      const r = pick(await txt(), tab); r.inputsReadBack = vals.join('/'); res.push(r);
    }
    return res;
  };
  const m = await run(monthly, 0);
  await root.getByRole('tab', { name: 'Sett et sparemål' }).click(); await page.waitForTimeout(1500);
  if (!(await txt()).includes('Hver måned må du spare: ')) { /* compare may have collapsed */ }
  const btn = root.getByRole('button', { name: 'Se avkastning med ulik risiko' });
  if (!/Ingen risiko:/.test(await txt())) { await btn.click(); await page.waitForTimeout(1500); }
  const g = await run(goal, 1);
  return { m, g };
}
async function tgt() {
  const page = await ctx.newPage();
  await page.goto(`${target}/spike-a${P}`, { waitUntil: 'networkidle' });
  await page.waitForFunction(() => document.querySelector('.savings-calculator')?.dataset.snapshot);
  const root = page.locator('.savings-calculator');
  const txt = async () => norm(await root.innerText());
  await root.getByRole('button', { name: 'Se avkastning med ulik risiko' }).click();
  const run = async (cases, tab) => {
    const res = [];
    for (const [a, b, y, risk] of cases) {
      const ins = root.locator('input.sc-input');
      const set = async (i, v) => { await ins.nth(i).fill(String(v)); await ins.nth(i).press('Tab'); };
      await set(0, a); await set(1, b); await set(2, y);
      await root.locator('select').selectOption(risk); await page.waitForTimeout(100);
      const r = pick(await txt(), tab); r.inputsReadBack = [a, b, y].join('/'); res.push(r);
    }
    return res;
  };
  const m = await run(monthly, 0);
  await root.getByRole('tab', { name: 'Sett et sparemål' }).click();
  const g = await run(goal, 1);
  return { m, g };
}
const s = await source(); const t = await tgt();
const rows = [...monthly.map((c, i) => ({ tab: 'monthly', input: c, source: s.m[i], target: t.m[i] })), ...goal.map((c, i) => ({ tab: 'goal', input: c, source: s.g[i], target: t.g[i] }))];
const diffs = rows.filter((r) => JSON.stringify(r.source) !== JSON.stringify(r.target));
writeFileSync(out, JSON.stringify({ rows, diffs }, null, 1));
console.log(`savings: ${rows.length - diffs.length}/${rows.length} input sets identical (result, return, saved, product, profile, 4 compare rows)`);
diffs.forEach((d) => console.log('DIFF', JSON.stringify(d)));
await browser.close();
process.exit(diffs.length ? 1 : 0);
