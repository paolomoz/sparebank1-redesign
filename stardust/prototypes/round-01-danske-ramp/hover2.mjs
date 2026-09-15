import { chromium } from 'playwright';
const file = 'file://' + process.cwd() + '/stardust/prototypes/round-01-danske-ramp/home.html';
const out = 'stardust/prototypes/round-01-danske-ramp/shots/';
const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
await p.goto(file, { waitUntil: 'networkidle' });
for (const [sel, name] of [['.product:nth-child(2)', 'h-product'], ['.news-card:nth-child(3)', 'h-news'], ['.index-card', 'h-index']]) {
  const el = p.locator(sel).first(); await el.scrollIntoViewIfNeeded(); await p.waitForTimeout(200);
  const before = await el.boundingBox(); await p.mouse.move(before.x + 40, before.y + 40); await p.waitForTimeout(800);
  const bb = await el.boundingBox(); const gap = 380;
  await p.screenshot({ path: out + name + '.png', clip: { x: Math.max(0, bb.x - gap), y: bb.y - 8, width: bb.width + gap + 8, height: bb.height + 16 } });
}
await b.close();
