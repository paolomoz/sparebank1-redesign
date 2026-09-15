import { chromium } from 'playwright';
import fs from 'node:fs';
const OUT = 'stardust/prototypes/round-01-danske-ramp/refs/ramp';
fs.mkdirSync(OUT, { recursive: true });
const UA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36';
const browser = await chromium.launch();
const result = { url: 'https://ramp.com/', capturedAt: new Date().toISOString(), viewports: {}, cssTokens: null, buttons: null, focus: null };

async function openPage(width) {
  const ctx = await browser.newContext({ viewport: { width, height: width < 600 ? 844 : 900 }, deviceScaleFactor: 2, userAgent: UA, locale: 'en-US', reducedMotion: 'no-preference' });
  const page = await ctx.newPage();
  await page.goto('https://ramp.com/', { waitUntil: 'domcontentloaded', timeout: 120000 });
  await page.waitForTimeout(4000);
  const dismissed = [];
  for (const s of ['#hs-eu-confirmation-button', '#hs-eu-cookie-confirmation button', '.fides-accept-all-button', '#fides-banner button.fides-accept-all-button', 'button:has-text("Accept all")', 'button:has-text("Accept")']) {
    const b = page.locator(s).first();
    if (await b.count() && await b.isVisible().catch(() => false)) { await b.click().catch(() => {}); dismissed.push(s); await page.waitForTimeout(600); }
  }
  await page.evaluate(() => document.fonts.ready);
  // trigger lazy content: scroll through
  await page.evaluate(async () => { const h = document.documentElement.scrollHeight; for (let y = 0; y < h; y += 700) { scrollTo(0, y); await new Promise(r => setTimeout(r, 120)); } scrollTo(0, 0); });
  await page.waitForTimeout(1500);
  return { ctx, page, dismissed };
}

const MEASURE = `(() => {
  const q = (sel, i = 0) => { const els = [...document.querySelectorAll(sel)].filter(e => { const b = e.getBoundingClientRect(); return b.width > 0 && b.height > 0; }); return els[i] || null; };
  const byText = (sel, txt, pred) => [...document.querySelectorAll(sel)].find(e => e.getBoundingClientRect().width > 0 && (e.textContent || '').trim().replace(/\\s+/g,' ').startsWith(txt) && (!pred || pred(e))) || null;
  const cnv = document.createElement('canvas'); cnv.width = cnv.height = 1; const cx = cnv.getContext('2d');
  const rgb = (c) => { try { cx.clearRect(0,0,1,1); cx.fillStyle = '#fff'; cx.fillRect(0,0,1,1); cx.fillStyle = c; cx.fillRect(0,0,1,1); const d = cx.getImageData(0,0,1,1).data; const a = (c.match(/\\/\\s*([\\d.]+)\\)/) || [,'1'])[1]; return 'rgb(' + d[0] + ',' + d[1] + ',' + d[2] + ')' + (a !== '1' ? ' @alpha ' + a + ' (over white)' : ''); } catch (e) { return c; } };
  const chWidth = (el) => { const cs = getComputedStyle(el); const s = document.createElement('span'); s.textContent = '0'; s.style.cssText = 'position:absolute;visibility:hidden;white-space:nowrap;font:' + cs.font + ';letter-spacing:' + cs.letterSpacing; document.body.appendChild(s); const w = s.getBoundingClientRect().width; s.remove(); return w; };
  const R = (n) => Math.round(n * 100) / 100;
  const rect = (el) => { const b = el.getBoundingClientRect(); return { x: R(b.x), y: R(b.y + scrollY), w: R(b.width), h: R(b.height) }; };
  const nextGap = (el) => { let n = el.nextElementSibling; while (n && n.getBoundingClientRect().height === 0) n = n.nextElementSibling; if (!n) return null; return { nextTag: n.tagName.toLowerCase(), nextClass: [...n.classList].slice(0,4).join(' '), gapPx: R(n.getBoundingClientRect().top - el.getBoundingClientRect().bottom) }; };
  const type = (el, role) => { if (!el) return { role, missing: true }; const cs = getComputedStyle(el); const fs = parseFloat(cs.fontSize); const lh = parseFloat(cs.lineHeight); const ls = cs.letterSpacing === 'normal' ? 0 : parseFloat(cs.letterSpacing); const ch = chWidth(el); const r = rect(el); const mw = cs.maxWidth; const mwPx = mw.endsWith('px') ? parseFloat(mw) : null; return { role, tag: el.tagName.toLowerCase(), classes: [...el.classList].join(' ').slice(0, 220), text: (el.textContent || '').trim().replace(/\\s+/g,' ').slice(0, 80), fontFamily: cs.fontFamily, fontSize: fs, fontWeight: cs.fontWeight, lineHeight: lh, lineHeightRatio: R(lh / fs), letterSpacingPx: ls, letterSpacingEm: R(ls / fs * 1000) / 1000, textTransform: cs.textTransform, textAlign: cs.textAlign, color: cs.color, colorRGB: rgb(cs.color), maxWidth: mw, maxWidthPx: mwPx, maxWidthCh: mwPx ? R(mwPx / ch) : null, renderedWidthPx: r.w, renderedWidthCh: R(r.w / ch), chWidthPx: R(ch), marginTop: cs.marginTop, marginBottom: cs.marginBottom, rect: r, next: nextGap(el), fontFeatureSettings: cs.fontFeatureSettings }; };

  const T = {};
  T.h1_hero = type(q('main h1'), 'h1 (headline-xl)');
  T.lead_hero = type(q('main h1 ~ div.body-l') || q('div.body-l'), 'lead / hero subcopy (body-l)');
  T.eyebrow_hero_outer = type(q('main span.uppercase'), 'eyebrow (hero, outer span)');
  T.eyebrow_hero_inner = type(q('main span.uppercase span'), 'eyebrow (hero, inner text span)');
  T.h2_headline_l = type(q('h2.headline-l'), 'h2 (headline-l)');
  T.h2_headline_m = type(q('h2.headline-m'), 'h2 (headline-m)');
  T.h2_headline_s = type(q('h2.headline-s'), 'h2 (headline-s)');
  T.h3_card_headline_xs = type(q('h3.headline-xs'), 'h3 card title (headline-xs)');
  T.stat_number_headline_xl = type(byText('p.headline-xl', '$'), 'stat number (headline-xl as p)');
  T.stat_label_body_m = type(q('p.body-m.text-hushedReverse') || byText('p', 'saved on'), 'stat label (body-m, muted on dark)');
  T.body_xl = type(q('p.body-xl'), 'body-xl (card/CTA title)');
  T.body_m_intro = type(byText('p.body-m', 'Start with') || q('p.body-m.text-hushed'), 'section intro (body-m, muted)');
  T.body_m_primary = type(q('p.body-m.text-primary') || byText('p.body-m', 'Tyler'), 'body (body-m, dark)');
  T.body_m_quote = type(q('p.body-m.before\\\\:absolute'), 'testimonial quote (body-m)');
  T.body_s_muted = type(q('p.body-s.text-hushed'), 'small / caption (body-s, muted)');
  T.body_s_dark = type(q('p.body-s.truncate'), 'small (body-s, dark, testimonial name)');
  T.body_xs = type(q('p.body-xs'), 'caption / legal (body-xs)');
  T.nav_menu_item = type(q('header button.h-11'), 'nav menu trigger (button)');
  T.nav_link = type(q('header a.h-11') || q('header a.inline-flex'), 'nav link (a)');
  T.announcement = type(q('header p.body-s'), 'announcement bar (body-s on dark)');
  T.footer_link = type(q('footer a.body-s'), 'footer link (body-s)');
  T.footer_heading = type(q('footer p.body-s:not(a *)') || q('footer [class*=headline]') || q('footer h4') || q('footer h3') || q('footer h2'), 'footer column heading');
  T.footer_p_first = type(q('footer p'), 'footer first p');
  T.text_link_arrow = type(byText('a', 'Read the report'), 'text link with arrow (Read the report)');
  T.mono_check = (() => { const el = [...document.querySelectorAll('*')].find(e => /Mono/i.test(getComputedStyle(e).fontFamily) && e.getBoundingClientRect().width > 0 && e.children.length === 0); return el ? type(el, 'mono usage') : { role: 'mono usage', missing: true }; })();

  // paragraph spacing: consecutive p siblings
  const paraGaps = []; document.querySelectorAll('p').forEach(p => { const n = p.nextElementSibling; if (n && n.tagName === 'P' && p.getBoundingClientRect().width > 0) paraGaps.push({ a: [...p.classList].slice(0,3).join(' '), b: [...n.classList].slice(0,3).join(' '), gapPx: R(n.getBoundingClientRect().top - p.getBoundingClientRect().bottom), aMarginBottom: getComputedStyle(p).marginBottom, bMarginTop: getComputedStyle(n).marginTop }); });
  // h2 -> following content gap
  const h2Gaps = [...document.querelectorAll ? [] : document.querySelectorAll('h2')].filter(h => h.getBoundingClientRect().width > 0).map(h => ({ text: h.textContent.trim().slice(0, 40), classes: [...h.classList].slice(0,4).join(' '), marginBottom: getComputedStyle(h).marginBottom, next: nextGap(h), parentGap: getComputedStyle(h.parentElement).rowGap, parentDisplay: getComputedStyle(h.parentElement).display }));

  // containers
  const cont = (el, label) => { if (!el) return { label, missing: true }; const cs = getComputedStyle(el); return { label, tag: el.tagName.toLowerCase(), classes: [...el.classList].join(' ').slice(0, 200), rect: rect(el), maxWidth: cs.maxWidth, paddingLeft: cs.paddingLeft, paddingRight: cs.paddingRight, marginLeft: cs.marginLeft, marginRight: cs.marginRight, contentWidth: R(el.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight)) }; };
  const C = {};
  C.viewport = { innerWidth, innerHeight, docHeight: document.documentElement.scrollHeight, scrollbar: innerWidth - document.documentElement.clientWidth };
  C.headerBar = cont(q('header div.max-w-screen-2xl'), 'header inner container');
  C.header = cont(q('header'), 'header'); C.header.height = rect(q('header')).h; C.navHeightVar = getComputedStyle(document.documentElement).getPropertyValue('--nav-height'); C.navBannerVar = getComputedStyle(document.documentElement).getPropertyValue('--nav-banner-height');
  C.heroSection = cont(q('main section'), 'hero section (outer)');
  C.heroContainer = cont(q('main section div.max-w-screen-2xl'), 'hero container');
  C.heroInner = cont(q('main section div.max-w-screen-2xl > div'), 'hero inner (py)'); C.heroInner.paddingTop = getComputedStyle(q('main section div.max-w-screen-2xl > div')).paddingTop; C.heroInner.paddingBottom = getComputedStyle(q('main section div.max-w-screen-2xl > div')).paddingBottom;
  C.heroMedia = cont(q('main section video') || q('main section img'), 'hero media (video/img)');
  C.heroMediaFrame = cont(q('main section div.rounded-xl.overflow-hidden'), 'hero media frame'); if (!C.heroMediaFrame.missing) { const el = q('main section div.rounded-xl.overflow-hidden'); C.heroMediaFrame.borderRadius = getComputedStyle(el).borderRadius; C.heroMediaFrame.border = getComputedStyle(el).border; }
  C.heroBackground = (() => { const c = q('main section canvas'); return c ? { rect: rect(c), note: 'canvas background spans full viewport width (full-bleed background), content contained' } : null; })();
  C.genericContainer = cont(q('main div.max-w-screen-2xl', 1), 'section container (2nd instance)');
  C.innerMax1312 = cont(q('div.max-w-\\\\[1312px\\\\]'), 'inner max-w-[1312px]');
  C.footerContainer = cont(q('footer div.max-w-screen-2xl'), 'footer container');
  C.footerPad = (() => { const el = q('footer > div.flex') || q('footer div.py-20') || q('footer > div'); if (!el) return null; const cs = getComputedStyle(el); return { classes: [...el.classList].join(' ').slice(0,160), paddingTop: cs.paddingTop, paddingBottom: cs.paddingBottom, rect: rect(el) }; })();
  // grids
  const grid = (el, label) => { if (!el) return { label, missing: true }; const cs = getComputedStyle(el); const kids = [...el.children].filter(k => k.getBoundingClientRect().width > 0); return { label, classes: [...el.classList].join(' ').slice(0, 200), display: cs.display, gridTemplateColumns: cs.gridTemplateColumns, columnGap: cs.columnGap, rowGap: cs.rowGap, gap: cs.gap, rect: rect(el), childCount: kids.length, childWidths: kids.slice(0, 8).map(k => R(k.getBoundingClientRect().width)), childXs: kids.slice(0, 8).map(k => R(k.getBoundingClientRect().x)) }; };
  const G = {};
  const card = q('[class*="PlatformCard-module"]'); G.platformCardsRow1 = grid(card && card.parentElement, 'platform cards grid (row 1 parent)'); G.platformCardsOuter = grid(card && card.parentElement && card.parentElement.parentElement, 'platform cards outer');
  G.statsTiles = grid(q('div.grid.gap-px'), 'stats tiles grid');
  const testi = q('p.body-s.truncate'); let tCard = testi; for (let i = 0; i < 6 && tCard && !/li|article/i.test(tCard.tagName); i++) tCard = tCard.parentElement; G.testimonialList = grid(tCard && tCard.parentElement, 'testimonial list'); G.testimonialCard = tCard ? { classes: [...tCard.classList].join(' ').slice(0,200), rect: rect(tCard), padding: getComputedStyle(tCard).padding, borderRadius: getComputedStyle(tCard).borderRadius, border: getComputedStyle(tCard).border } : null;
  G.footerGrid = grid(q('footer div.grid'), 'footer grid');
  const twoCol = q('h2.headline-s.w-full'); let tc = twoCol; for (let i = 0; i < 6 && tc && !(getComputedStyle(tc).display.includes('grid') || getComputedStyle(tc).display.includes('flex') && tc.getBoundingClientRect().width > 1000); i++) tc = tc.parentElement; G.twoColumnSection = grid(tc, 'two-column section (h2 headline-s + media)'); if (twoCol) G.twoColumnSection.textColumn = { h2MaxWidth: getComputedStyle(twoCol).maxWidth, h2Rect: rect(twoCol), textColRect: rect(twoCol.parentElement), textColClasses: [...twoCol.parentElement.classList].join(' ').slice(0,160) };
  const ctaBlock = q('p.body-xl'); G.ctaBanner = ctaBlock ? { textBlock: rect(ctaBlock.parentElement), textBlockClasses: [...ctaBlock.parentElement.classList].join(' ').slice(0,160), textBlockMaxWidth: getComputedStyle(ctaBlock.parentElement).maxWidth, outer: rect(ctaBlock.parentElement.parentElement), outerClasses: [...ctaBlock.parentElement.parentElement.classList].join(' ').slice(0,200), outerPadding: getComputedStyle(ctaBlock.parentElement.parentElement).padding, outerRadius: getComputedStyle(ctaBlock.parentElement.parentElement).borderRadius, outerBg: getComputedStyle(ctaBlock.parentElement.parentElement).backgroundColor } : null;
  G.personalizeBlock = (() => { const h = byText('h2.headline-m', 'See recommendations'); if (!h) return null; return { h2Rect: rect(h), h2MaxWidth: getComputedStyle(h).maxWidth, h2TextAlign: getComputedStyle(h).textAlign, pRect: rect(h.nextElementSibling), pMaxWidth: getComputedStyle(h.nextElementSibling).maxWidth, gapH2toP: R(h.nextElementSibling.getBoundingClientRect().top - h.getBoundingClientRect().bottom) }; })();

  // sections spacing
  const S = {};
  const rootCS = getComputedStyle(document.documentElement);
  S.vars = { spacerL: rootCS.getPropertyValue('--spacer-l').trim(), spacerM: rootCS.getPropertyValue('--spacer-m').trim(), radiusMd: rootCS.getPropertyValue('--radius-md').trim(), radiusXl: rootCS.getPropertyValue('--radius-xl').trim(), spacing: rootCS.getPropertyValue('--spacing').trim(), breakpoint2xl: rootCS.getPropertyValue('--breakpoint-2xl').trim(), textPrimary: rootCS.getPropertyValue('--text-color-primary').trim(), textHushed: rootCS.getPropertyValue('--text-color-hushed').trim() };
  S.sections = [...document.querySelectorAll('main section')].filter(s => s.getBoundingClientRect().height > 50).map(s => { const cs = getComputedStyle(s); return { classes: [...s.classList].join(' ').slice(0, 120), rect: rect(s), marginTop: cs.marginTop, marginBottom: cs.marginBottom, paddingTop: cs.paddingTop, paddingBottom: cs.paddingBottom, bg: cs.backgroundColor }; });
  S.heroPadding = C.heroInner ? { top: C.heroInner.paddingTop, bottom: C.heroInner.paddingBottom } : null;
  S.heroStack = (() => { const h1 = q('main h1'); if (!h1) return null; const eyebrow = q('main span.uppercase'); const lead = h1.nextElementSibling; const form = h1.parentElement.nextElementSibling; const media = form && form.nextElementSibling; const g = (a, b) => a && b ? R(b.getBoundingClientRect().top - a.getBoundingClientRect().bottom) : null; return { eyebrowToH1: g(eyebrow, h1), h1ToLead: g(h1, lead), leadMarginTop: lead && getComputedStyle(lead).marginTop, leadToForm: g(lead, form), formMarginTop: form && getComputedStyle(form).marginTop, formToMedia: g(form, media), mediaMarginTop: media && getComputedStyle(media).marginTop }; })();
  S.paraGaps = paraGaps.slice(0, 12);
  S.h2Gaps = h2Gaps;

  return { typography: T, containers: C, grids: G, spacing: S };
})()`;

// Buttons (rest + hover + focus) — done per viewport, screenshots only at 1440
const BUTTON_TARGETS = [
  { key: 'nav-primary', desc: 'Nav primary CTA (dark fill) "Get started"', find: `[...document.querySelectorAll('header a')].find(a => a.textContent.trim() === 'Get started')` },
  { key: 'nav-secondary', desc: 'Nav secondary CTA (brand fill) "See a demo"', find: `[...document.querySelectorAll('header a')].find(a => a.textContent.trim() === 'See a demo')` },
  { key: 'nav-tertiary', desc: 'Nav tertiary (subtle fill) "Sign in"', find: `[...document.querySelectorAll('header a')].find(a => a.textContent.trim() === 'Sign in')` },
  { key: 'nav-menu-item', desc: 'Nav menu trigger "Products"', find: `[...document.querySelectorAll('header button')].find(a => a.textContent.trim() === 'Products')` },
  { key: 'hero-primary-lg', desc: 'Hero large CTA (brand fill, inside email form) "Get started for free"', find: `[...document.querySelectorAll('main button')].find(a => a.textContent.trim() === 'Get started for free')` },
  { key: 'primary', desc: 'Section primary (brand fill) "Switch in days, not months"', find: `[...document.querySelectorAll('main a')].find(a => a.textContent.trim() === 'Switch in days, not months')` },
  { key: 'secondary', desc: 'Section secondary (grey fill) "View Demo"', find: `[...document.querySelectorAll('main a')].find(a => a.textContent.trim() === 'View Demo' && getComputedStyle(a).padding === '16px')` },
  { key: 'primary-dark-lg', desc: 'Large dark fill CTA "View Demo" (CTA banner)', find: `[...document.querySelectorAll('main a')].find(a => a.textContent.trim() === 'View Demo' && getComputedStyle(a).padding === '20px')` },
  { key: 'text-link-arrow', desc: 'Text link with arrow "Read the report"', find: `[...document.querySelectorAll('main a')].find(a => a.textContent.trim().startsWith('Read the report'))` },
  { key: 'card-icon-button', desc: 'Card corner arrow icon box (36px)', find: `document.querySelector('[class*="PlatformCard-module"] div.size-9')` },
  { key: 'card-link', desc: 'Platform card as link (whole card)', find: `document.querySelector('a[class*="PlatformCard-module"]')` },
  { key: 'announcement-link', desc: 'Announcement bar link "Learn more"', find: `[...document.querySelectorAll('header a')].find(a => a.textContent.trim() === 'Learn more')` },
];
const BTN_STYLE = `(el) => { if (!el) return null; const cs = getComputedStyle(el); const b = el.getBoundingClientRect(); const R = n => Math.round(n*100)/100;
  const textNode = [...el.childNodes].find(n => n.nodeType === 3 && n.textContent.trim()) ; let textRect = null; if (textNode) { const rg = document.createRange(); rg.selectNodeContents(textNode); const tb = rg.getBoundingClientRect(); textRect = { top: R(tb.top - b.top), bottom: R(b.bottom - tb.bottom), left: R(tb.left - b.left), right: R(b.right - tb.right), h: R(tb.height), w: R(tb.width) }; }
  const spans = [...el.querySelectorAll('span,div')].filter(s => s.textContent.trim() && !s.querySelector('svg,i')); const innerText = spans[0]; let innerRect = null; if (innerText && !textRect) { const tb = innerText.getBoundingClientRect(); innerRect = { tag: innerText.tagName.toLowerCase(), classes: [...innerText.classList].join(' ').slice(0,160), top: R(tb.top - b.top), bottom: R(b.bottom - tb.bottom), left: R(tb.left - b.left), right: R(b.right - tb.right), h: R(tb.height), w: R(tb.width), lineHeight: getComputedStyle(innerText).lineHeight, fontSize: getComputedStyle(innerText).fontSize }; }
  const icon = el.querySelector('svg, i, [class*=icon], [class*=Icon]'); let iconInfo = null; if (icon) { const ib = icon.getBoundingClientRect(); const ics = getComputedStyle(icon); iconInfo = { tag: icon.tagName.toLowerCase(), classes: [...icon.classList].join(' ').slice(0,120), w: R(ib.width), h: R(ib.height), fontFamily: ics.fontFamily.slice(0,40), fontSize: ics.fontSize, transform: ics.transform, transition: ics.transition.slice(0,120), text: icon.textContent.trim().slice(0,20), gapFromText: textRect ? R(ib.left - (b.left + textRect.left + textRect.w)) : null, position: ib.left > b.left + b.width/2 ? 'right' : 'left' }; }
  const ps = getComputedStyle(el, '::before'); const psA = getComputedStyle(el, '::after');
  return { tag: el.tagName.toLowerCase(), classes: [...el.classList].join(' ').slice(0, 400), text: el.textContent.trim().replace(/\\s+/g,' ').slice(0, 40), rect: { x: R(b.x), y: R(b.y + scrollY), w: R(b.width), h: R(b.height) }, height: R(b.height), width: R(b.width), display: cs.display, alignItems: cs.alignItems, justifyContent: cs.justifyContent, gap: cs.gap, padding: cs.padding, paddingTop: cs.paddingTop, paddingRight: cs.paddingRight, paddingBottom: cs.paddingBottom, paddingLeft: cs.paddingLeft, cssHeight: cs.height, minWidth: cs.minWidth, minHeight: cs.minHeight, fontSize: cs.fontSize, fontWeight: cs.fontWeight, lineHeight: cs.lineHeight, letterSpacing: cs.letterSpacing, textTransform: cs.textTransform, textDecoration: cs.textDecorationLine, whiteSpace: cs.whiteSpace, borderRadius: cs.borderRadius, borderWidth: cs.borderWidth, borderStyle: cs.borderStyle, borderColor: cs.borderColor, backgroundColor: cs.backgroundColor, backgroundImage: cs.backgroundImage.slice(0,120), color: cs.color, boxShadow: cs.boxShadow.slice(0,160), outline: cs.outline, outlineOffset: cs.outlineOffset, opacity: cs.opacity, transform: cs.transform, transition: cs.transition.slice(0, 240), transitionDuration: cs.transitionDuration, transitionProperty: cs.transitionProperty.slice(0,120), transitionTimingFunction: cs.transitionTimingFunction, cursor: cs.cursor, textRect, innerRect, icon: iconInfo, before: ps.content !== 'none' ? { content: ps.content, bg: ps.backgroundColor, w: ps.width, h: ps.height, transform: ps.transform, opacity: ps.opacity, inset: ps.inset, borderRadius: ps.borderRadius } : null, after: psA.content !== 'none' ? { content: psA.content, bg: psA.backgroundColor, w: psA.width, h: psA.height, transform: psA.transform, opacity: psA.opacity, inset: psA.inset } : null }; }`;

async function measureButtons(page, width, shots) {
  const out = {};
  for (const t of BUTTON_TARGETS) {
    const handle = await page.evaluateHandle(`(${t.find}) || null`);
    const el = handle.asElement();
    if (!el) { out[t.key] = { desc: t.desc, missing: true }; continue; }
    await el.scrollIntoViewIfNeeded().catch(() => {});
    // move header out of the way for measurement: scroll so element is mid-viewport
    await page.evaluate((e) => { const b = e.getBoundingClientRect(); if (b.top < 140 && !e.closest('header')) scrollBy(0, b.top - 300); }, el);
    await page.mouse.move(5, 5); await page.waitForTimeout(400);
    const rest = await el.evaluate(BTN_STYLE);
    // pair info
    const pair = await el.evaluate((e) => { const p = e.parentElement; const sib = [...p.children].filter(c => c !== e && (c.tagName === 'A' || c.tagName === 'BUTTON') && c.getBoundingClientRect().width > 0); if (!sib.length) return null; const cs = getComputedStyle(p); const a = e.getBoundingClientRect(), b = sib[0].getBoundingClientRect(); return { parentClasses: [...p.classList].join(' ').slice(0,160), parentDisplay: cs.display, parentGap: cs.gap, parentAlignItems: cs.alignItems, siblingText: sib[0].textContent.trim().slice(0,30), horizontalGapPx: Math.round((b.left > a.left ? b.left - a.right : a.left - b.right) * 100) / 100, sameTop: Math.abs(a.top - b.top) < 1, heightA: a.height, heightB: b.height }; });
    let shotRest = null, shotHover = null;
    if (shots) {
      const bb = await el.boundingBox();
      if (bb) { const pad = 24; shotRest = `${OUT}/button-${t.key}.png`; await page.screenshot({ path: shotRest, clip: { x: Math.max(0, bb.x - pad), y: Math.max(0, bb.y - pad), width: bb.width + pad * 2, height: bb.height + pad * 2 } }); }
    }
    await el.hover({ force: true }).catch(() => {});
    await page.waitForTimeout(700);
    const hover = await el.evaluate(BTN_STYLE);
    if (shots) { const bb = await el.boundingBox(); if (bb) { const pad = 24; shotHover = `${OUT}/button-${t.key}-hover.png`; await page.screenshot({ path: shotHover, clip: { x: Math.max(0, bb.x - pad), y: Math.max(0, bb.y - pad), width: bb.width + pad * 2, height: bb.height + pad * 2 } }); } }
    // active (mousedown)
    let active = null;
    try { const bb = await el.boundingBox(); if (bb) { await page.mouse.move(bb.x + bb.width / 2, bb.y + bb.height / 2); await page.mouse.down(); await page.waitForTimeout(250); active = await el.evaluate(BTN_STYLE); await page.mouse.move(5, 5); await page.mouse.up(); } } catch (e) { active = { error: e.message }; }
    await page.mouse.move(5, 5); await page.waitForTimeout(500);
    // programmatic focus + focus-visible check
    const focus = await el.evaluate((e) => { e.focus({ preventScroll: true }); const cs = getComputedStyle(e); const r = { matchesFocusVisible: e.matches(':focus-visible'), outline: cs.outline, outlineOffset: cs.outlineOffset, boxShadow: cs.boxShadow.slice(0, 200), borderColor: cs.borderColor }; e.blur(); return r; });
    const diff = {}; for (const k of ['backgroundColor','color','borderColor','boxShadow','transform','opacity','textDecoration','backgroundImage','outline']) if (rest && hover && rest[k] !== hover[k]) diff[k] = { rest: rest[k], hover: hover[k] };
    if (rest && hover && rest.icon && hover.icon && rest.icon.transform !== hover.icon.transform) diff.iconTransform = { rest: rest.icon.transform, hover: hover.icon.transform };
    if (rest && hover && JSON.stringify(rest.before) !== JSON.stringify(hover.before)) diff.before = { rest: rest.before, hover: hover.before };
    const activeDiff = {}; if (active && !active.error) for (const k of ['backgroundColor','color','transform','opacity','boxShadow']) if (hover[k] !== active[k]) activeDiff[k] = { hover: hover[k], active: active[k] };
    out[t.key] = { desc: t.desc, rest, hover, hoverDiff: diff, active: activeDiff, focus, pair, screenshots: { rest: shotRest, hover: shotHover } };
    await handle.dispose();
  }
  // keyboard focus ring: Tab into nav
  let kb = null;
  try {
    await page.evaluate(() => scrollTo(0, 0)); await page.mouse.click(720, 600); // click empty area in hero
    for (let i = 0; i < 25; i++) { await page.keyboard.press('Tab'); const info = await page.evaluate(() => { const e = document.activeElement; if (!e) return null; const cs = getComputedStyle(e); return { tag: e.tagName.toLowerCase(), text: e.textContent.trim().slice(0, 30), classes: [...e.classList].join(' ').slice(0, 160), focusVisible: e.matches(':focus-visible'), outline: cs.outline, outlineColor: cs.outlineColor, outlineWidth: cs.outlineWidth, outlineStyle: cs.outlineStyle, outlineOffset: cs.outlineOffset, boxShadow: cs.boxShadow.slice(0, 200), borderRadius: cs.borderRadius }; }); if (info && ['Get started', 'See a demo', 'Sign in', 'Get started for free'].includes(info.text)) { kb = { tabs: i + 1, ...info }; if (shots) { const h = await page.evaluateHandle(() => document.activeElement); const bb = await h.asElement().boundingBox(); if (bb) await page.screenshot({ path: `${OUT}/button-focus-ring.png`, clip: { x: bb.x - 24, y: bb.y - 24, width: bb.width + 48, height: bb.height + 48 } }); } break; } }
  } catch (e) { kb = { error: e.message }; }
  // focus-visible CSS rules present in stylesheets
  const focusRules = await page.evaluate(() => { const r = []; const dump = (rules) => { for (const rule of rules) { try { if (rule.cssRules && rule.type !== 1) { dump(rule.cssRules); continue; } const s = rule.selectorText || ''; if (/focus-visible|focus\b/.test(s) && s.length < 160 && /outline|ring|shadow|border/.test(rule.style.cssText)) r.push(s + ' { ' + rule.style.cssText.slice(0, 200) + ' }'); } catch (e) {} } }; for (const ss of document.styleSheets) { try { dump(ss.cssRules); } catch (e) {} } return [...new Set(r)].slice(0, 40); });
  return { variants: out, keyboardFocus: kb, focusCssRules: focusRules };
}

async function crop(page, handle, path, pad = 24, extra = {}) {
  const el = handle.asElement ? handle.asElement() : handle; if (!el) return null;
  await el.scrollIntoViewIfNeeded().catch(() => {});
  await page.evaluate((e) => { const b = e.getBoundingClientRect(); scrollBy(0, b.top - Math.max(120, innerHeight * 0.3)); }, el);
  await page.waitForTimeout(500);
  const bb = await el.boundingBox(); if (!bb) return null;
  const vp = page.viewportSize();
  const x = Math.max(0, bb.x - pad), y = Math.max(0, bb.y - pad);
  const w = Math.min(vp.width - x, (extra.width || bb.width) + pad * 2), h = Math.min(vp.height - y, (extra.height || bb.height) + pad * 2);
  await page.screenshot({ path, clip: { x, y, width: w, height: h } });
  return path;
}

for (const width of [1440, 1280, 1024, 390]) {
  console.log('viewport', width);
  const { ctx, page, dismissed } = await openPage(width);
  const m = await page.evaluate(MEASURE.replace('document.querelectorAll ? [] : ', ''));
  m.cookieDismissed = dismissed;
  const shots = width === 1440 || width === 390;
  const files = [];
  if (shots) {
    await page.evaluate(() => scrollTo(0, 0)); await page.waitForTimeout(800);
    const hero = `${OUT}/hero-${width}.png`; await page.screenshot({ path: hero }); files.push(hero);
    // type crops
    const crops = [
      ['type-hero-h1-subcopy', `document.querySelector('main h1').parentElement`],
      ['type-eyebrow-label', `document.querySelector('main span.uppercase')`],
      ['type-section-h2-intro', `(() => { const h = [...document.querySelectorAll('h2.headline-m')].find(h => h.textContent.includes('See recommendations')); return h ? h.parentElement : document.querySelector('h2.headline-m').parentElement; })()`],
      ['type-h2-headline-l', `document.querySelector('h2.headline-l')`],
      ['type-h2-headline-s-block', `document.querySelector('h2.headline-s').parentElement`],
      ['type-card-title-body', `(() => { const p = document.querySelector('p.body-s.truncate'); let c = p; for (let i=0;i<6 && c && !/LI|ARTICLE/.test(c.tagName); i++) c = c.parentElement; return c; })()`],
      ['type-cta-title-body', `document.querySelector('p.body-xl') && document.querySelector('p.body-xl').parentElement.parentElement`],
      ['type-platform-card-title', `document.querySelector('[class*="PlatformCard-module"] h3').parentElement`],
      ['type-stat-tile', `document.querySelector('[class*="featured"]')`],
      ['type-footer-links', `document.querySelector('footer div.grid > div')`],
    ];
    for (const [name, expr] of crops) { try { const h = await page.evaluateHandle(`(${expr}) || null`); if (h.asElement()) { const p = await crop(page, h, `${OUT}/${name}-${width}.png`); if (p) files.push(p); } } catch (e) { console.log('crop fail', name, e.message); } }
    // button pair crop
    try { const h = await page.evaluateHandle(`(() => { const a = [...document.querySelectorAll('main a')].find(a => a.textContent.trim() === 'Switch in days, not months'); return a ? a.parentElement : null; })()`); if (h.asElement()) { const p = await crop(page, h, `${OUT}/button-pair-${width}.png`, 24); if (p) files.push(p); } } catch (e) { console.log('pair crop fail', e.message); }
    try { const h = await page.evaluateHandle(`document.querySelector('header div.max-w-screen-2xl')`); if (h.asElement()) { await page.evaluate(() => scrollTo(0, 0)); await page.waitForTimeout(400); const bb = await h.asElement().boundingBox(); await page.screenshot({ path: `${OUT}/button-nav-group-${width}.png`, clip: { x: 0, y: 0, width: width, height: bb.y + bb.height + 8 } }); files.push(`${OUT}/button-nav-group-${width}.png`); } } catch (e) { console.log('nav crop fail', e.message); }
    // full page
    await page.evaluate(() => scrollTo(0, 0)); await page.waitForTimeout(800);
    const full = `${OUT}/full-${width}.png`; await page.screenshot({ path: full, fullPage: true }); files.push(full);
  }
  const btn = await measureButtons(page, width, width === 1440);
  m.buttons = btn;
  m.files = files;
  result.viewports[width] = m;
  await ctx.close();
}

// css tokens (from first viewport's stylesheet; independent of width)
{
  const { ctx, page } = await openPage(1440);
  result.cssTokens = await page.evaluate(() => {
    const r = {};
    const want = /^\.(headline-(xl|l|m|s|xs)|body-(xl|l|m|s|xs)|spacer-[a-z-]+|leading-trim|container|max-w-screen-2xl|rounded-(md|lg|xl|sm)|text-hushed|text-primary|tracking-wider|uppercase)$/;
    const dump = (rules, mq) => { for (const rule of rules) { try { if (rule.type === 4) { dump(rule.cssRules, (mq ? mq + ' and ' : '') + rule.conditionText); continue; } if (rule.selectorText && want.test(rule.selectorText)) { (r[rule.selectorText] ||= []).push({ media: mq || null, css: rule.style.cssText }); } if (rule.cssRules && rule.type !== 4) dump(rule.cssRules, mq); } catch (e) {} } };
    for (const ss of document.styleSheets) { try { dump(ss.cssRules, ''); } catch (e) {} }
    const root = getComputedStyle(document.documentElement);
    r.rootVars = {}; for (const v of ['--spacer-l','--spacer-m','--radius-md','--radius-lg','--radius-xl','--radius-sm','--spacing','--breakpoint-2xl','--breakpoint-xl','--breakpoint-lg','--breakpoint-md','--text-color-primary','--text-color-hushed','--nav-height','--nav-banner-height','--lausanne-ascent','--lausanne-descent','--lausanne-units-per-em','--font-sans','--font-mono','--color-primary','--yellow','--grayLight']) r.rootVars[v] = root.getPropertyValue(v).trim();
    r.fontsLoaded = [...document.fonts].map(f => `${f.family} ${f.weight} ${f.style} ${f.status}`).filter((v, i, a) => a.indexOf(v) === i);
    r.htmlFontSize = root.fontSize; r.bodyFont = getComputedStyle(document.body).font; r.htmlClass = document.documentElement.className; r.fontFeatureSettings = getComputedStyle(document.body).fontFeatureSettings; r.textRendering = getComputedStyle(document.body).textRendering; r.webkitFontSmoothing = getComputedStyle(document.body).webkitFontSmoothing;
    return r;
  });
  await ctx.close();
}

fs.writeFileSync(`${OUT}/measurements.json`, JSON.stringify(result, null, 2));
console.log('written', `${OUT}/measurements.json`);
await browser.close();
