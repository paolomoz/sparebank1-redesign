import { chromium } from 'playwright';
import fs from 'node:fs';
const OUT = 'stardust/prototypes/round-01-danske-ramp/refs/ramp';
const UA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36';
const src = fs.readFileSync('.tmp-ramp/measure.mjs', 'utf8');
const BUTTON_TARGETS = eval(src.match(/const BUTTON_TARGETS = (\[[\s\S]*?\n\]);/)[1]);
const BTN_STYLE = eval(src.match(/const BTN_STYLE = `([\s\S]*?)`;\n/)[1].replace(/\\\\/g, '\\'));
const browser = await chromium.launch();
const result = JSON.parse(fs.readFileSync(`${OUT}/measurements.json`, 'utf8'));

async function openPage(width) {
  const ctx = await browser.newContext({ viewport: { width, height: width < 600 ? 844 : 900 }, deviceScaleFactor: 2, userAgent: UA, locale: 'en-US' });
  const page = await ctx.newPage();
  await page.goto('https://ramp.com/', { waitUntil: 'domcontentloaded', timeout: 120000 });
  await page.waitForTimeout(4000);
  for (const s of ['#hs-eu-confirmation-button', '.fides-accept-all-button', 'button:has-text("Accept all")', 'button:has-text("Accept")']) { const b = page.locator(s).first(); if (await b.count() && await b.isVisible().catch(() => false)) { await b.click().catch(() => {}); await page.waitForTimeout(600); } }
  await page.evaluate(() => document.fonts.ready);
  await page.evaluate(async () => { const h = document.documentElement.scrollHeight; for (let y = 0; y < h; y += 700) { scrollTo(0, y); await new Promise(r => setTimeout(r, 100)); } scrollTo(0, 0); });
  await page.waitForTimeout(1200);
  return { ctx, page };
}

for (const width of [1440, 390]) {
  const { ctx, page } = await openPage(width);
  const out = {};
  for (const t of BUTTON_TARGETS) {
    const handle = await page.evaluateHandle(`(${t.find}) || null`);
    const el = handle.asElement();
    if (!el) { out[t.key] = { desc: t.desc, missing: true }; continue; }
    const visible = await el.evaluate(e => { const b = e.getBoundingClientRect(); return b.width > 0 && b.height > 0; });
    if (!visible) { out[t.key] = { desc: t.desc, hiddenAtThisViewport: true }; continue; }
    await el.scrollIntoViewIfNeeded().catch(() => {});
    await page.evaluate((e) => { const b = e.getBoundingClientRect(); if (b.top < 140 && !e.closest('header')) scrollBy(0, b.top - 300); }, el);
    await page.mouse.move(5, 5); await page.waitForTimeout(500);
    const rest = await el.evaluate(BTN_STYLE);
    const pair = await el.evaluate((e) => { const p = e.parentElement; const sib = [...p.children].filter(c => c !== e && (c.tagName === 'A' || c.tagName === 'BUTTON') && c.getBoundingClientRect().width > 0); if (!sib.length) return null; const cs = getComputedStyle(p); const a = e.getBoundingClientRect(), b = sib[0].getBoundingClientRect(); return { parentClasses: [...p.classList].join(' ').slice(0,160), parentDisplay: cs.display, parentFlexDirection: cs.flexDirection, parentGap: cs.gap, parentAlignItems: cs.alignItems, siblingText: sib[0].textContent.trim().slice(0,30), horizontalGapPx: Math.round((b.left > a.left ? b.left - a.right : a.left - b.right) * 100) / 100, verticalGapPx: Math.round((b.top > a.top ? b.top - a.bottom : a.top - b.bottom) * 100) / 100, sameTop: Math.abs(a.top - b.top) < 1, heightA: a.height, heightB: b.height, widthA: a.width, widthB: b.width }; });
    await el.hover({ force: true }).catch(() => {});
    await page.waitForTimeout(800);
    const hover = await el.evaluate(BTN_STYLE);
    let active = null;
    try { const bb = await el.boundingBox(); if (bb) { await page.mouse.move(bb.x + bb.width / 2, bb.y + bb.height / 2); await page.mouse.down(); await page.waitForTimeout(350); active = await el.evaluate(BTN_STYLE); await page.mouse.move(5, 5); await page.mouse.up(); } } catch (e) { active = { error: e.message }; }
    await page.mouse.move(5, 5); await page.waitForTimeout(600);
    const diff = {}; for (const k of ['backgroundColor','color','borderColor','boxShadow','transform','opacity','textDecoration','backgroundImage','outline','filter']) if (rest[k] !== hover[k]) diff[k] = { rest: rest[k], hover: hover[k] };
    if (rest.icon && hover.icon && rest.icon.transform !== hover.icon.transform) diff.iconTransform = { rest: rest.icon.transform, hover: hover.icon.transform };
    if (JSON.stringify(rest.before) !== JSON.stringify(hover.before)) diff.before = { rest: rest.before, hover: hover.before };
    if (JSON.stringify(rest.after) !== JSON.stringify(hover.after)) diff.after = { rest: rest.after, hover: hover.after };
    const activeDiff = {}; if (active && !active.error) for (const k of ['backgroundColor','color','transform','opacity','boxShadow']) if (hover[k] !== active[k]) activeDiff[k] = { hover: hover[k], active: active[k] };
    out[t.key] = { desc: t.desc, rest, hover, hoverDiff: diff, activeDiffVsHover: activeDiff, pair };
    await handle.dispose();
  }
  // keyboard focus ring (settled)
  let kb = [];
  try {
    await page.evaluate(() => scrollTo(0, 0)); await page.mouse.click(width / 2, width < 600 ? 700 : 700);
    for (let i = 0; i < 30; i++) { await page.keyboard.press('Tab'); await page.waitForTimeout(450); const info = await page.evaluate(() => { const e = document.activeElement; if (!e || e === document.body) return null; const cs = getComputedStyle(e); return { tag: e.tagName.toLowerCase(), text: e.textContent.trim().slice(0, 30), classes: [...e.classList].join(' ').slice(0, 200), focusVisible: e.matches(':focus-visible'), outline: cs.outline, outlineOffset: cs.outlineOffset, boxShadow: cs.boxShadow.slice(0, 260), borderColor: cs.borderColor, borderRadius: cs.borderRadius }; }); if (info && (info.tag === 'a' || info.tag === 'button')) { kb.push({ tab: i + 1, ...info }); if (['Get started', 'Get started for free', 'See a demo', 'Switch in days, not months'].includes(info.text) && width === 1440) { const h = await page.evaluateHandle(() => document.activeElement); const bb = await h.asElement().boundingBox(); if (bb) await page.screenshot({ path: `${OUT}/button-focus-ring.png`, clip: { x: bb.x - 24, y: bb.y - 24, width: bb.width + 48, height: bb.height + 48 } }); } if (kb.length >= 8) break; } }
  } catch (e) { kb.push({ error: e.message }); }
  // footer details
  const footer = await page.evaluate(() => {
    const R = n => Math.round(n * 100) / 100; const rect = el => { const b = el.getBoundingClientRect(); return { x: R(b.x), y: R(b.y + scrollY), w: R(b.width), h: R(b.height) }; };
    const f = document.querySelector('footer'); if (!f) return null;
    const padEl = f.querySelector('[class*="py-"]'); const cs = padEl && getComputedStyle(padEl);
    const grid = f.querySelector('div.grid'); const col = grid && grid.children[0];
    const heads = [...f.querySelectorAll('div.grid > div > *:first-child, div.grid > div > * > *:first-child')].filter(e => e.getBoundingClientRect().width > 0).slice(0, 4).map(e => { const c = getComputedStyle(e); return { tag: e.tagName.toLowerCase(), classes: [...e.classList].join(' ').slice(0, 160), text: e.textContent.trim().slice(0, 40), fontSize: c.fontSize, lineHeight: c.lineHeight, fontWeight: c.fontWeight, color: c.color, textTransform: c.textTransform, letterSpacing: c.letterSpacing, marginBottom: c.marginBottom, rect: rect(e) }; });
    const links = [...f.querySelectorAll('a')].filter(a => a.getBoundingClientRect().width > 0);
    const li = links[0]; const li2 = links[1];
    const small = [...f.querySelectorAll('p, span, div')].filter(e => e.children.length === 0 && e.textContent.trim().length > 20 && e.getBoundingClientRect().width > 0 && parseFloat(getComputedStyle(e).fontSize) <= 13).slice(0, 3).map(e => { const c = getComputedStyle(e); return { tag: e.tagName.toLowerCase(), classes: [...e.classList].join(' ').slice(0, 120), text: e.textContent.trim().slice(0, 50), fontSize: c.fontSize, lineHeight: c.lineHeight, color: c.color }; });
    return { padClasses: padEl && [...padEl.classList].join(' ').slice(0, 160), paddingTop: cs && cs.paddingTop, paddingBottom: cs && cs.paddingBottom, bg: cs && cs.backgroundColor, rect: rect(f), grid: grid && { classes: [...grid.classList].join(' ').slice(0, 160), gridTemplateColumns: getComputedStyle(grid).gridTemplateColumns, gap: getComputedStyle(grid).gap, rect: rect(grid), colWidths: [...grid.children].slice(0, 8).map(c => R(c.getBoundingClientRect().width)) }, firstColumnChildren: col && [...col.children].slice(0, 4).map(c => ({ tag: c.tagName.toLowerCase(), classes: [...c.classList].join(' ').slice(0, 120), text: c.textContent.trim().slice(0, 40) })), headings: heads, linkCount: links.length, linkGap: li && li2 ? R(li2.getBoundingClientRect().top - li.getBoundingClientRect().bottom) : null, linkLineBox: li && { h: R(li.getBoundingClientRect().height), lineHeight: getComputedStyle(li).lineHeight, display: getComputedStyle(li).display, marginBottom: getComputedStyle(li).marginBottom, parentGap: getComputedStyle(li.parentElement).gap, parentDisplay: getComputedStyle(li.parentElement).display }, smallText: small };
  });
  // footer crop
  try { const h = await page.evaluateHandle(`document.querySelector('footer div.grid')`); const el = h.asElement(); if (el) { await el.scrollIntoViewIfNeeded(); await page.waitForTimeout(600); const bb = await el.boundingBox(); const vp = page.viewportSize(); if (bb) await page.screenshot({ path: `${OUT}/type-footer-links-${width}.png`, clip: { x: 0, y: Math.max(0, bb.y - 24), width: vp.width, height: Math.min(vp.height - Math.max(0, bb.y - 24), Math.min(bb.height, 520) + 48) } }); } } catch (e) { console.log('footer crop', e.message); }
  // 1440 extra: type crop for nav link + text-link arrow with hover
  if (width === 1440) {
    try { const h = await page.evaluateHandle(`[...document.querySelectorAll('main a')].find(a => a.textContent.trim().startsWith('Read the report'))`); const el = h.asElement(); if (el) { await el.scrollIntoViewIfNeeded(); await page.evaluate(e => scrollBy(0, e.getBoundingClientRect().top - 300), el); await page.waitForTimeout(500); const bb = await el.boundingBox(); await page.screenshot({ path: `${OUT}/type-h2-headline-s-with-textlink-1440.png`, clip: { x: bb.x - 24, y: bb.y - 160, width: 760, height: bb.height + 200 } }); } } catch (e) { console.log('textlink crop', e.message); }
  }
  result.viewports[width].buttons = { variants: out, keyboardFocusSequence: kb, focusCssRules: result.viewports[width].buttons.focusCssRules };
  result.viewports[width].footer = footer;
  console.log(width, 'buttons ok:', Object.values(out).filter(v => v.rest).length, 'kb:', kb.length, 'footer:', footer && footer.paddingTop);
  await ctx.close();
}
fs.writeFileSync(`${OUT}/measurements.json`, JSON.stringify(result, null, 2));
console.log('updated');
await browser.close();
