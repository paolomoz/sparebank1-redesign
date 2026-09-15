import { chromium } from 'playwright';
const file = 'file://' + process.cwd() + '/stardust/prototypes/round-01-danske-ramp/home.html';
const out = 'stardust/prototypes/round-01-danske-ramp/shots/';
const b = await chromium.launch();
// 1440: hover states, bank list open, channel open, sticky scroll
let p = await b.newPage({ viewport: { width: 1440, height: 900 } });
await p.goto(file, { waitUntil: 'networkidle' });
await p.hover('.product .arrow'); await p.waitForTimeout(300);
await p.screenshot({ path: out + 's-hover-arrow.png', clip: { x: 40, y: 400, width: 700, height: 420 } });
await p.hover('.campaign .btn'); await p.waitForTimeout(400);
await p.screenshot({ path: out + 's-hover-btn.png', clip: { x: 900, y: 150, width: 500, height: 450 } });
await p.click('#alle-banker summary'); await p.waitForTimeout(300);
await p.screenshot({ path: out + 's-banklist-open-1440.png', fullPage: false });
await p.click('#alle-banker summary');
const ring = p.locator('.channel summary').first(); await ring.scrollIntoViewIfNeeded(); await ring.click(); await p.waitForTimeout(300);
await p.evaluate(() => scrollBy(0, 200)); await p.waitForTimeout(200);
await p.screenshot({ path: out + 's-channel-open-1440.png', fullPage: false });
await p.evaluate(() => scrollTo(0, 0)); await p.waitForTimeout(400);
await p.evaluate(() => scrollTo(0, 900)); await p.waitForTimeout(500);
const t1 = await p.evaluate(() => getComputedStyle(document.querySelector('.site-header')).transform);
await p.evaluate(() => scrollTo(0, 700)); await p.waitForTimeout(500);
const t2 = await p.evaluate(() => getComputedStyle(document.querySelector('.site-header')).transform);
await p.screenshot({ path: out + 's-sticky-scrolled-up-1440.png', fullPage: false, clip: { x: 0, y: 0, width: 1440, height: 160 } });
console.log('sticky: after scroll-down', t1, '| after scroll-up', t2);
// widths: 1280 and 1024 header
for (const w of [1280, 1100, 1024, 768]) { await p.setViewportSize({ width: w, height: 900 }); await p.evaluate(() => scrollTo(0, 0)); await p.waitForTimeout(300); await p.screenshot({ path: out + `s-header-${w}.png`, clip: { x: 0, y: 0, width: w, height: 620 } }); }
await p.close();
// 390: menu open
p = await b.newPage({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true });
await p.goto(file, { waitUntil: 'networkidle' });
await p.click('.menu-toggle'); await p.waitForTimeout(300);
await p.screenshot({ path: out + 's-menu-open-390.png', fullPage: false });
const overflow = await p.evaluate(() => document.documentElement.scrollWidth > innerWidth);
console.log('390 horizontal overflow:', overflow);
await b.close();
