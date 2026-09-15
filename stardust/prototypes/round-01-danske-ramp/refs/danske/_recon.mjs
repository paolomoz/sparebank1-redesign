import { chromium } from 'playwright';
const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, locale: 'da-DK' });
const page = await ctx.newPage();
const resp = await page.goto('https://danskebank.dk/privat', { waitUntil: 'domcontentloaded', timeout: 60000 });
console.log('status', resp.status(), 'url', page.url());
await page.waitForTimeout(4000);
console.log('final url', page.url(), 'title', await page.title());
// cookie banner candidates
const cands = await page.evaluate(() => {
  const out = [];
  document.querySelectorAll('button, a').forEach(b => {
    const t = (b.innerText||'').trim();
    if (/accept|tillad|acceptér|godkend|ok|alle/i.test(t) && t.length < 60) out.push({ tag: b.tagName, id: b.id, cls: b.className, text: t });
  });
  return out.slice(0, 30);
});
console.log(JSON.stringify(cands, null, 1));
const body = await page.evaluate(() => {
  const walk = (el, depth) => {
    if (depth > 3) return '';
    let s = '';
    for (const c of el.children) {
      const r = c.getBoundingClientRect();
      if (r.height < 5) continue;
      s += '  '.repeat(depth) + `<${c.tagName.toLowerCase()}${c.id ? '#' + c.id : ''}${c.className && typeof c.className === 'string' ? '.' + c.className.trim().split(/\s+/).slice(0,4).join('.') : ''}> ${Math.round(r.top+scrollY)}..h${Math.round(r.height)}\n`;
      s += walk(c, depth + 1);
    }
    return s;
  };
  return walk(document.body, 0);
});
console.log(body.slice(0, 15000));
await page.screenshot({ path: '/tmp/danske-recon.png' });
await browser.close();
