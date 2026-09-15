import { chromium } from 'playwright';
const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36', locale: 'en-US' });
const page = await ctx.newPage();
await page.goto('https://ramp.com/', { waitUntil: 'domcontentloaded', timeout: 90000 });
await page.waitForTimeout(5000);
const out = await page.evaluate(() => {
  const r = [];
  // CSSOM token rules
  const want = /\.(headline-(xl|l|m|s|xs|xxl|2xl)|body-(xl|l|m|s|xs)|spacer-[a-z-]+|leading-trim|eyebrow|label-[a-z]+|mono-[a-z]+|text-hushed|text-primary|container|max-w-screen-2xl|px-16|rounded-md)(?![\w-])/;
  const dump = (rules, mq) => { for (const rule of rules) { try {
    if (rule.type === 4) { dump(rule.cssRules, (mq?mq+' AND ':'') + rule.conditionText); continue; }
    if (rule.type === 12 || rule.type === 1) { const sel = rule.selectorText || ''; if (want.test(sel) && sel.length < 120) r.push(`${mq ? '@media '+mq+' ' : ''}${sel} { ${rule.style.cssText.slice(0,300)} }`); }
    if (rule.cssRules && rule.type !== 4) dump(rule.cssRules, mq);
  } catch(e){} } };
  for (const ss of document.styleSheets) { try { dump(ss.cssRules, ''); } catch(e) { r.push('CORS sheet: ' + ss.href); } }
  r.push('--- :root vars (font/size related)');
  for (const ss of document.styleSheets) { try { for (const rule of ss.cssRules) { if (rule.selectorText === ':root' || rule.selectorText === ':root, :host' || (rule.selectorText||'').startsWith(':root')) { const t = rule.style.cssText; r.push(t.slice(0, 4000)); } } } catch(e){} }
  r.push('--- eyebrow element');
  const all = [...document.querySelectorAll('*')];
  const desc = el => { const cs = getComputedStyle(el); const b = el.getBoundingClientRect(); return `${el.tagName.toLowerCase()} cls="${[...el.classList].join(' ').slice(0,160)}" | ${cs.fontSize}/${cs.lineHeight} ${cs.fontWeight} ls=${cs.letterSpacing} tt=${cs.textTransform} ff=${cs.fontFamily.slice(0,60)} col=${cs.color} | x=${Math.round(b.x)} w=${Math.round(b.width)} y=${Math.round(b.y+scrollY)} h=${Math.round(b.height)} | mt=${cs.marginTop} mb=${cs.marginBottom} | "${(el.textContent||'').trim().slice(0,50).replace(/\s+/g,' ')}"`; };
  all.filter(e => e.children.length===0 && /PROCESSED BY RAMP|AGENTS AT WORK|RECEIPTS PROCESSED/.test(e.textContent||'')).slice(0,3).forEach(e => { r.push(desc(e)); r.push('  parent: ' + desc(e.parentElement)); });
  r.push('--- hero section children');
  const hero = document.querySelector('main section');
  const tree = (el, depth, max) => { if (depth>max) return; [...el.children].forEach(c => { const b=c.getBoundingClientRect(); if (b.width===0) return; r.push('  '.repeat(depth) + desc(c).slice(0,260)); tree(c, depth+1, max); }); };
  tree(hero, 0, 5);
  r.push('--- card inner (first PlatformCard)');
  const card = document.querySelector('[class*="PlatformCard-module"]');
  if (card) tree(card, 0, 5);
  r.push('--- stats section (second child of main > div) top');
  const s2 = document.querySelector('main > div > section');
  if (s2) tree(s2, 0, 3);
  r.push('--- header');
  const header = document.querySelector('header') || document.querySelector('nav');
  if (header) { r.push(desc(header)); tree(header, 0, 3); }
  r.push('--- footer container');
  const footer = document.querySelector('footer'); if (footer) { r.push(desc(footer)); tree(footer, 0, 2); }
  return r.join('\n');
});
console.log(out);
await browser.close();
