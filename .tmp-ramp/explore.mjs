import { chromium } from 'playwright';
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 });
await page.goto('https://ramp.com/', { waitUntil: 'networkidle', timeout: 90000 }).catch(e => console.log('goto', e.message));
await page.waitForTimeout(3000);
// cookie banner
const cookieSel = ['#onetrust-accept-btn-handler','button:has-text("Accept all")','button:has-text("Accept All")','button:has-text("Accept")','[data-testid*="cookie"] button','button:has-text("Got it")','button:has-text("OK")'];
for (const s of cookieSel) { const b = page.locator(s).first(); if (await b.count() && await b.isVisible().catch(()=>false)) { console.log('cookie click', s); await b.click().catch(()=>{}); await page.waitForTimeout(800); break; } }
console.log('title', await page.title());
const out = await page.evaluate(() => {
  const r = [];
  const desc = el => { const cs = getComputedStyle(el); const b = el.getBoundingClientRect(); return `${el.tagName.toLowerCase()}.${[...el.classList].slice(0,4).join('.')} | ${cs.fontSize}/${cs.lineHeight} ${cs.fontWeight} ls=${cs.letterSpacing} tt=${cs.textTransform} ff=${cs.fontFamily.split(',')[0]} | x=${Math.round(b.x)} w=${Math.round(b.width)} y=${Math.round(b.y+scrollY)} h=${Math.round(b.height)} | "${(el.textContent||'').trim().slice(0,60).replace(/\s+/g,' ')}"`; };
  r.push('--- HEADINGS');
  document.querySelectorAll('h1,h2,h3,h4,h5,h6').forEach(el => { if (el.getBoundingClientRect().width>0) r.push(desc(el)); });
  r.push('--- BUTTONS / LINKS styled');
  document.querySelectorAll('a,button').forEach(el => { const cs=getComputedStyle(el); const b=el.getBoundingClientRect(); if (b.width>0 && b.height>0 && (cs.backgroundColor!=='rgba(0, 0, 0, 0)' || cs.borderTopWidth!=='0px' || parseFloat(cs.borderTopLeftRadius)>0 || parseFloat(cs.paddingLeft)>8)) r.push(desc(el)+` bg=${cs.backgroundColor} col=${cs.color} br=${cs.borderTopLeftRadius} bw=${cs.borderTopWidth} pad=${cs.padding}`); });
  r.push('--- NAV');
  document.querySelectorAll('header a, nav a').forEach(el => { if (el.getBoundingClientRect().width>0) r.push(desc(el)); });
  r.push('--- FOOTER links (first 10)');
  [...document.querySelectorAll('footer a')].slice(0,10).forEach(el => r.push(desc(el)));
  r.push('--- PARAGRAPHS (first 40)');
  [...document.querySelectorAll('p')].filter(el=>el.getBoundingClientRect().width>0).slice(0,40).forEach(el => r.push(desc(el)+` col=${getComputedStyle(el).color}`));
  r.push('--- SECTIONS');
  document.querySelectorAll('main > *, main section, body > div > section, section').forEach(el => { const b=el.getBoundingClientRect(); const cs=getComputedStyle(el); if (b.height>100) r.push(`${el.tagName.toLowerCase()}.${[...el.classList].slice(0,4).join('.')} x=${Math.round(b.x)} w=${Math.round(b.width)} y=${Math.round(b.y+scrollY)} h=${Math.round(b.height)} pad=${cs.paddingTop}/${cs.paddingBottom} bg=${cs.backgroundColor}`); });
  r.push('--- HERO candidates (top 900px, wide containers)');
  document.querySelectorAll('div,section,header').forEach(el => { const b=el.getBoundingClientRect(); const cs=getComputedStyle(el); if (b.y+scrollY<900 && b.width>600 && b.width<1440 && (cs.maxWidth!=='none' || cs.paddingLeft!=='0px')) r.push(`${el.tagName.toLowerCase()}.${[...el.classList].slice(0,5).join('.')} x=${Math.round(b.x)} w=${Math.round(b.width)} maxw=${cs.maxWidth} pl=${cs.paddingLeft} pr=${cs.paddingRight}`); });
  r.push('docH=' + document.documentElement.scrollHeight);
  return r.join('\n');
});
console.log(out);
await page.screenshot({ path: '.tmp-ramp/explore-1440.png' });
await browser.close();
