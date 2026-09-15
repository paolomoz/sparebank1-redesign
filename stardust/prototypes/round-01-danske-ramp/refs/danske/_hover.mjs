import { chromium } from 'playwright';
import fs from 'node:fs';
const OUT = '/Users/paolo/stardust/2026-08/sparebank1-redesign/stardust/prototypes/round-01-danske-ramp/refs/danske/';
const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, locale: 'da-DK' });
const page = await ctx.newPage();
await page.goto('https://danskebank.dk/privat', { waitUntil: 'domcontentloaded', timeout: 90000 });
await page.waitForTimeout(2500);
try { await page.click('#button-accept-all', { timeout: 5000 }); } catch {}
await page.evaluate(() => { document.querySelectorAll('.cookie-consent-banner-modal, .spinner').forEach(n => n.remove()); document.documentElement.style.scrollBehavior = 'auto'; });
await page.waitForTimeout(800);
const props = ['color','text-decoration-line','text-decoration-color','text-underline-offset','background-color','border-bottom-width','border-bottom-color','transform','opacity','box-shadow'];
const snap = (loc) => loc.evaluate((e, props) => { const g = (el, ps) => { const s = getComputedStyle(el, ps || null); const o = {}; for (const p of props) o[p] = s.getPropertyValue(p); return o; }; return { self: g(e), after: { ...g(e, '::after'), transform: getComputedStyle(e, '::after').transform, left: getComputedStyle(e, '::after').left, marginLeft: getComputedStyle(e, '::after').marginLeft }, span: e.querySelector('span') ? g(e.querySelector('span')) : null, li: e.closest('li') ? g(e.closest('li')) : null }; }, props);
const diff = (a, b) => { const out = {}; for (const k of Object.keys(a)) { if (!a[k]) continue; for (const p of Object.keys(a[k])) if (a[k][p] !== b[k]?.[p]) (out[k] ||= {})[p] = [a[k][p], b[k][p]]; } return out; };
const res = {};
const targets = [
  ['arrowLink_card', page.locator('.card a.icon.arrow-right:visible').first()],
  ['navItem', page.locator('.main-menu__list > li > a:visible').first()],
  ['settingsTab_inactive', page.locator('.settings-menu > li:not(.is-active) > a:visible').first()],
  ['footerLink', page.locator('footer.footer ul.link-list a:visible').first()],
  ['footerSummary', page.locator('footer.footer summary:visible').first()],
  ['loginButton', page.locator('button.button.cta.show-for-medium').first()],
  ['ctaSecondaryButton', page.locator('.footer-cta a.button.secondary').first()],
];
for (const [name, loc] of targets) {
  try { await loc.scrollIntoViewIfNeeded(); await page.waitForTimeout(200); await page.mouse.move(5, 5); await page.waitForTimeout(300); const b = await snap(loc); await loc.hover(); await page.waitForTimeout(600); const a = await snap(loc); res[name] = { text: (await loc.innerText()).trim().slice(0, 40), diff: diff(b, a), before: b.self, after: a.self }; console.log(name, res[name].text, JSON.stringify(res[name].diff)); if (name === 'arrowLink_card') { const card = loc.locator('xpath=ancestor::div[contains(@class,"card ") or @class="card"][1]'); await card.screenshot({ path: OUT + 'card-2-text-hover.png' }); } } catch (e) { console.log(name, 'ERR', e.message.slice(0, 100)); }
}
// nav item open state (hover reveals mega menu?)
await page.mouse.move(5, 5); await page.evaluate(() => scrollTo(0, 0)); await page.waitForTimeout(300);
await page.locator('.main-menu__list > li > a:visible').first().hover(); await page.waitForTimeout(1000);
res.navHoverOpensPanel = await page.evaluate(() => { const panels = [...document.querySelectorAll('header.nav *')].filter(e => { const r = e.getBoundingClientRect(); const c = getComputedStyle(e); return r.height > 150 && r.width > 600 && r.top >= 100 && c.visibility !== 'hidden' && c.opacity !== '0' && c.display !== 'none'; }).slice(0, 5).map(e => ({ sel: e.tagName.toLowerCase() + '.' + String(e.className).trim().split(/\s+/).slice(0, 3).join('.'), rect: e.getBoundingClientRect().toJSON(), bg: getComputedStyle(e).backgroundColor, radius: getComputedStyle(e).borderBottomLeftRadius, shadow: getComputedStyle(e).boxShadow })); const cover = document.querySelector('header.nav .cover'); return { panels, coverOpacity: getComputedStyle(cover).opacity, coverBg: getComputedStyle(cover).backgroundColor }; });
console.log('navHoverOpensPanel', JSON.stringify(res.navHoverOpensPanel));
await page.screenshot({ path: OUT + 'header-1440-nav-hover.png', clip: { x: 0, y: 0, width: 1440, height: Math.min(900, 120 + (res.navHoverOpensPanel.panels[0]?.rect.height || 0) + 40) } });
await browser.close();
const m = JSON.parse(fs.readFileSync(OUT + 'measurements.json', 'utf8')); m.v1440.hoverExtra = res; fs.writeFileSync(OUT + 'measurements.json', JSON.stringify(m, null, 1));
console.log('saved');
