import { chromium } from 'playwright';
import fs from 'node:fs';
const OUT = '/Users/paolo/stardust/2026-08/sparebank1-redesign/stardust/prototypes/round-01-danske-ramp/refs/danske/';
const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, locale: 'da-DK', isMobile: true, hasTouch: true });
const page = await ctx.newPage();
await page.goto('https://danskebank.dk/privat', { waitUntil: 'domcontentloaded', timeout: 90000 });
await page.waitForTimeout(2500);
try { await page.click('#button-accept-all', { timeout: 5000 }); } catch {}
await page.evaluate(() => { document.querySelectorAll('.cookie-consent-banner-modal, .spinner').forEach(n => n.remove()); document.documentElement.style.scrollBehavior = 'auto'; });
const h = await page.evaluate(() => document.documentElement.scrollHeight);
for (let y = 0; y < h; y += 600) { await page.evaluate((y) => scrollTo(0, y), y); await page.waitForTimeout(100); }
await page.evaluate(() => scrollTo(0, 0)); await page.waitForTimeout(1200);
// --- retake 390 element shots with header hidden (avoid sticky overlay) ---
await page.addStyleTag({ content: 'header.nav{visibility:hidden !important} aside.desktop-tools{display:none !important}' });
await page.locator('footer.footer').screenshot({ path: OUT + 'footer-390.png' });
await page.locator('.footer-cta').screenshot({ path: OUT + 'footer-cta-390.png' });
const gridRows = await page.locator('main .section-inner > .row').filter({ has: page.locator('.card') }).all();
let bi = 1; for (const gr of gridRows) { const sec = gr.locator('xpath=ancestor::*[contains(@class,"section ")][1]').first(); try { await sec.scrollIntoViewIfNeeded(); await page.waitForTimeout(250); await sec.screenshot({ path: OUT + `bento-${bi}-390.png` }); } catch (e) { console.log('fail', bi, e.message); } bi++; }
const c1 = page.locator('.card:visible').filter({ has: page.locator('.card-image') }).first(); await c1.scrollIntoViewIfNeeded(); await page.waitForTimeout(250); await c1.screenshot({ path: OUT + 'card-1-390.png' });
await page.evaluate(() => { document.querySelector('header.nav').style.visibility = ''; }); await page.evaluate(() => document.querySelectorAll('style').forEach(s => { if (s.textContent.includes('header.nav{visibility:hidden')) s.remove(); }));
await page.evaluate(() => scrollTo(0, 0)); await page.waitForTimeout(600);
// --- open the mobile menu and find the panel anywhere ---
await page.click('.menu-mobile-toggle'); await page.waitForTimeout(1500);
const menu = await page.evaluate(() => {
  const R = (n) => Math.round(n * 100) / 100; const rect = (el) => { const r = el.getBoundingClientRect(); return { x: R(r.left), y: R(r.top), w: R(r.width), h: R(r.height) }; };
  const vis = (e) => { const r = e.getBoundingClientRect(); const c = getComputedStyle(e); return r.width > 0 && r.height > 0 && c.visibility !== 'hidden' && c.display !== 'none' && r.bottom > 0 && r.top < innerHeight; };
  const sel = (el) => { let s = el.tagName.toLowerCase(); if (el.id) s += '#' + el.id; if (typeof el.className === 'string' && el.className.trim()) s += '.' + el.className.trim().split(/\s+/).slice(0, 4).join('.'); return s; };
  const inHeader = (e) => !!e.closest('header.nav');
  // candidates: fixed/absolute panels covering the viewport
  const panels = [...document.querySelectorAll('body *')].filter(vis).filter(e => { const c = getComputedStyle(e); const r = e.getBoundingClientRect(); return (c.position === 'fixed' || c.position === 'absolute') && r.width >= 300 && r.height >= 300 && !e.closest('.cookie-consent-banner-modal'); }).map(e => ({ selector: sel(e), rect: rect(e), position: getComputedStyle(e).position, bg: getComputedStyle(e).backgroundColor, z: getComputedStyle(e).zIndex, inHeader: inHeader(e), parentChain: (() => { const out = []; let p = e.parentElement; while (p && out.length < 5) { out.push(sel(p).slice(0, 40)); p = p.parentElement; } return out.join(' < '); })() }));
  // all visible interactive elements in viewport (excluding page main/footer content)
  const links = [...document.querySelectorAll('a, button, input, summary')].filter(vis).filter(e => !e.closest('main, footer, .footer-cta, .cookie-consent-banner-modal')).map(e => { const c = getComputedStyle(e); const li = e.closest('li'); return { selector: sel(e).slice(0, 70), text: (e.innerText || e.getAttribute('placeholder') || e.getAttribute('aria-label') || '').trim().replace(/\s+/g, ' ').slice(0, 40), rect: rect(e), liRect: li ? rect(li) : null, fontSize: c.fontSize, fontWeight: c.fontWeight, color: c.color, bg: c.backgroundColor, radius: c.borderTopLeftRadius, border: c.borderTopWidth + ' ' + c.borderTopColor, liBorderB: li ? getComputedStyle(li).borderBottomWidth + ' ' + getComputedStyle(li).borderBottomColor : null, liBorderT: li ? getComputedStyle(li).borderTopWidth + ' ' + getComputedStyle(li).borderTopColor : null, padL: c.paddingLeft, padT: c.paddingTop, textTransform: c.textTransform, hasSvg: !!e.querySelector('svg'), svgRects: [...e.querySelectorAll('svg')].map(s => rect(s)), inHeader: inHeader(e) }; });
  const toggle = document.querySelector('.menu-mobile-toggle');
  const icon = toggle.querySelector('.icon');
  const iconInfo = { rect: rect(icon), children: [...icon.querySelectorAll('svg')].map(s => ({ rect: rect(s), transform: getComputedStyle(s).transform, opacity: getComputedStyle(s).opacity })) };
  // background layers behind menu
  const bgs = [...document.querySelectorAll('body *')].filter(vis).filter(e => { const c = getComputedStyle(e); const r = e.getBoundingClientRect(); return c.backgroundColor !== 'rgba(0, 0, 0, 0)' && r.width >= 340 && !e.closest('main, footer, .footer-cta, .cookie-consent-banner-modal'); }).slice(0, 30).map(e => ({ selector: sel(e).slice(0, 60), rect: rect(e), bg: getComputedStyle(e).backgroundColor, radius: getComputedStyle(e).borderTopLeftRadius, pos: getComputedStyle(e).position, inHeader: inHeader(e) }));
  return { headerClass: document.querySelector('header.nav').className, bodyClass: document.body.className, htmlClass: document.documentElement.className, htmlOverflow: getComputedStyle(document.documentElement).overflow, bodyOverflow: getComputedStyle(document.body).overflow, toggleClass: toggle.className, toggleAria: toggle.getAttribute('aria-expanded'), iconInfo, panels, bgs, links, scrollY };
});
fs.writeFileSync(OUT + '_mobile-menu.json', JSON.stringify(menu, null, 1));
console.log('classes', menu.headerClass, '|', menu.bodyClass, '|', menu.htmlClass, '| ov', menu.htmlOverflow, menu.bodyOverflow, '| toggle', menu.toggleClass, menu.toggleAria);
console.log('icon', JSON.stringify(menu.iconInfo));
console.log('PANELS'); menu.panels.forEach(p => console.log(' ', JSON.stringify(p)));
console.log('BGS'); menu.bgs.forEach(p => console.log(' ', JSON.stringify(p)));
console.log('LINKS', menu.links.length); menu.links.forEach(l => console.log(' ', [l.selector, l.text, JSON.stringify(l.rect), l.liRect ? 'li:' + JSON.stringify(l.liRect) : '', l.fontSize, l.fontWeight, l.textTransform, 'bg:' + l.bg, 'r:' + l.radius, 'b:' + l.border, l.liBorderB ? 'liB:' + l.liBorderB : '', l.liBorderT ? 'liT:' + l.liBorderT : '', 'padL:' + l.padL, l.hasSvg ? 'svg:' + JSON.stringify(l.svgRects) : '', l.inHeader ? 'HDR' : 'OUT'].join(' | ')));
await page.screenshot({ path: OUT + 'header-390-menu-open.png' });
await browser.close();
