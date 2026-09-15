import { chromium } from 'playwright';
const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, locale: 'da-DK' });
const page = await ctx.newPage();
await page.goto('https://danskebank.dk/privat', { waitUntil: 'domcontentloaded', timeout: 60000 });
await page.waitForTimeout(4000);
console.log('COOKIE BUTTONS:', JSON.stringify(await page.evaluate(() => [...document.querySelectorAll('#cookie-buttons button, #cookie-buttons a, .cookie-consent-banner button')].map(b => ({tag:b.tagName,id:b.id,cls:b.className,text:b.innerText.trim()})))));
const dump = (sel, maxDepth) => page.evaluate(([sel, maxDepth]) => {
  const root = document.querySelector(sel); if (!root) return 'NOT FOUND ' + sel;
  const walk = (el, depth) => {
    if (depth > maxDepth) return '';
    let s = '';
    for (const c of el.children) {
      const r = c.getBoundingClientRect();
      const cls = typeof c.className === 'string' ? c.className.trim().split(/\s+/).filter(Boolean).slice(0,5).join('.') : '';
      const txt = c.children.length === 0 ? ' "' + (c.innerText||c.getAttribute('aria-label')||'').trim().replace(/\s+/g,' ').slice(0,60) + '"' : '';
      s += '  '.repeat(depth) + `<${c.tagName.toLowerCase()}${c.id ? '#' + c.id : ''}${cls ? '.' + cls : ''}> x${Math.round(r.left)} y${Math.round(r.top+scrollY)} w${Math.round(r.width)} h${Math.round(r.height)}${txt}\n`;
      s += walk(c, depth + 1);
    }
    return s;
  };
  return walk(root, 0);
}, [sel, maxDepth]);
console.log('=== HEADER ===\n' + await dump('header.nav', 6));
console.log('=== CARDS SECTION 2 (512) ===\n' + await dump('main > section.cards:nth-of-type(2)', 6));
console.log('=== CARDS SECTION (1270) ===\n' + await dump('main > section.cards:nth-of-type(6)', 5));
console.log('=== CARDS SECTION (3800) ===\n' + await dump('main > section.cards:nth-of-type(8)', 5));
console.log('=== FOOTER CTA ===\n' + await dump('.footer-cta', 4));
console.log('=== FOOTER ===\n' + await dump('footer.footer', 6));
await browser.close();
