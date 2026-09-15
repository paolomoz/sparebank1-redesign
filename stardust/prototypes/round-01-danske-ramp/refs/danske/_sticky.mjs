import { chromium } from 'playwright';
import fs from 'node:fs';
const OUT = '/Users/paolo/stardust/2026-08/sparebank1-redesign/stardust/prototypes/round-01-danske-ramp/refs/danske/';
const browser = await chromium.launch();
const out = {};
for (const vw of [1440, 390]) {
  const ctx = await browser.newContext({ viewport: { width: vw, height: vw === 1440 ? 900 : 844 }, locale: 'da-DK', isMobile: vw === 390, hasTouch: vw === 390 });
  const page = await ctx.newPage();
  await page.goto('https://danskebank.dk/privat', { waitUntil: 'domcontentloaded', timeout: 90000 });
  await page.waitForTimeout(2500);
  try { await page.click('#button-accept-all', { timeout: 5000 }); } catch {}
  await page.evaluate(() => { document.querySelectorAll('.cookie-consent-banner-modal, .spinner').forEach(n => n.remove()); document.documentElement.style.scrollBehavior = 'auto'; });
  await page.waitForTimeout(800);
  const probe = () => page.evaluate(() => { const h = document.querySelector('header.nav'); const m = h.querySelector('.menus'); const mb = h.querySelector('.menu-main-bar'); const p = h.parentElement; return { scrollY, headerTop: Math.round(h.getBoundingClientRect().top), headerBottom: Math.round(h.getBoundingClientRect().bottom), headerH: Math.round(h.getBoundingClientRect().height), menusTop: Math.round(m.getBoundingClientRect().top), mainBarTop: Math.round(mb.getBoundingClientRect().top), mainBarBottom: Math.round(mb.getBoundingClientRect().bottom), headerPos: getComputedStyle(h).position, headerCssTop: getComputedStyle(h).top, headerTransform: getComputedStyle(h).transform, menusTransform: getComputedStyle(m).transform, menusPos: getComputedStyle(m).position, menusCssTop: getComputedStyle(m).top, menusShadow: getComputedStyle(m).boxShadow, mainBarShadow: getComputedStyle(mb).boxShadow, mainBarBorderB: getComputedStyle(mb).borderBottomWidth + ' ' + getComputedStyle(mb).borderBottomColor, headerClass: h.className, menusClass: m.className, bodyClass: document.body.className, htmlClass: document.documentElement.className, parent: p.tagName + '.' + p.className, parentPos: getComputedStyle(p).position, parentOverflow: getComputedStyle(p).overflow, bodyOverflow: getComputedStyle(document.body).overflow + '/' + getComputedStyle(document.body).overflowX, htmlOverflow: getComputedStyle(document.documentElement).overflow + '/' + getComputedStyle(document.documentElement).overflowX, transition: getComputedStyle(h).transition }; });
  const seq = [];
  seq.push({ step: 'top', ...(await probe()) });
  for (const y of [50, 150, 300, 600, 1200]) { await page.evaluate((y) => scrollTo(0, y), y); await page.waitForTimeout(500); seq.push({ step: 'down', ...(await probe()) }); }
  for (const y of [1100, 900, 700]) { await page.evaluate((y) => scrollTo(0, y), y); await page.waitForTimeout(500); seq.push({ step: 'up', ...(await probe()) }); }
  // wheel-based scroll to simulate real user (JS scroll listeners may need wheel)
  await page.mouse.move(vw / 2, 400);
  await page.mouse.wheel(0, 400); await page.waitForTimeout(600); seq.push({ step: 'wheel-down', ...(await probe()) });
  await page.mouse.wheel(0, -200); await page.waitForTimeout(600); seq.push({ step: 'wheel-up', ...(await probe()) });
  await page.screenshot({ path: OUT + `header-scrolled-up-${vw}.png`, clip: { x: 0, y: 0, width: vw, height: 160 } });
  await page.mouse.wheel(0, 600); await page.waitForTimeout(600); seq.push({ step: 'wheel-down2', ...(await probe()) });
  await page.screenshot({ path: OUT + `header-scrolled-800-${vw}.png`, clip: { x: 0, y: 0, width: vw, height: 160 } });
  out[`v${vw}`] = { sequence: seq };
  console.log(vw, JSON.stringify(seq.map(s => `${s.step}@${s.scrollY}: header ${s.headerTop}..${s.headerBottom} mainBar ${s.mainBarTop}..${s.mainBarBottom} pos ${s.headerPos} top ${s.headerCssTop} tf ${s.headerTransform}/${s.menusTransform} menusPos ${s.menusPos} cls [${s.headerClass}] [${s.menusClass}] body[${s.bodyClass}] shadow ${s.menusShadow}|${s.mainBarShadow} border ${s.mainBarBorderB}`), null, 1));
  console.log('parent', seq[0].parent, seq[0].parentPos, seq[0].parentOverflow, 'body ov', seq[0].bodyOverflow, 'html ov', seq[0].htmlOverflow, 'transition', seq[0].transition);

  if (vw === 390) {
    await page.evaluate(() => scrollTo(0, 0)); await page.waitForTimeout(400);
    await page.click('.menu-mobile-toggle'); await page.waitForTimeout(1200);
    const menu = await page.evaluate(() => {
      const R = (n) => Math.round(n * 100) / 100; const rect = (el) => { const r = el.getBoundingClientRect(); return { x: R(r.left), y: R(r.top), w: R(r.width), h: R(r.height) }; }; const vis = (e) => { const r = e.getBoundingClientRect(); return r.width > 0 && r.height > 0 && getComputedStyle(e).visibility !== 'hidden'; }; const sel = (el) => { let s = el.tagName.toLowerCase(); if (el.id) s += '#' + el.id; if (typeof el.className === 'string' && el.className.trim()) s += '.' + el.className.trim().split(/\s+/).slice(0, 4).join('.'); return s; };
      const h = document.querySelector('header.nav');
      const all = [...h.querySelectorAll('*')].filter(vis).filter(e => !e.closest('.cover'));
      const outline = all.filter(e => { const r = e.getBoundingClientRect(); return r.height >= 14 && r.width >= 20; }).slice(0, 220).map(e => { const c = getComputedStyle(e); return [sel(e).slice(0, 60), rect(e).x, rect(e).y, rect(e).w, rect(e).h, e.children.length === 0 ? (e.innerText || '').trim().replace(/\s+/g, ' ').slice(0, 30) : '', c.backgroundColor !== 'rgba(0, 0, 0, 0)' ? 'bg:' + c.backgroundColor : '', c.borderBottomWidth !== '0px' ? 'bb:' + c.borderBottomWidth + ' ' + c.borderBottomColor : '', c.borderTopLeftRadius !== '0px' ? 'r:' + c.borderTopLeftRadius : '', c.position !== 'static' ? c.position : ''].join('|'); });
      const toggle = h.querySelector('.menu-mobile-toggle');
      return { headerClass: h.className, bodyClass: document.body.className, htmlClass: document.documentElement.className, toggleText: (toggle.innerText || '').trim(), toggleRect: rect(toggle), toggleAria: toggle.getAttribute('aria-expanded'), outline };
    });
    out.v390.mobileMenuOpen = menu;
    console.log('MENU OPEN', menu.headerClass, '|', menu.bodyClass, '|', menu.toggleText, JSON.stringify(menu.toggleRect), menu.toggleAria);
    console.log(menu.outline.join('\n'));
    await page.screenshot({ path: OUT + 'header-390-menu-open.png' });
  }
  await ctx.close();
}
await browser.close();
fs.writeFileSync(OUT + '_sticky-mobile.json', JSON.stringify(out, null, 1));
