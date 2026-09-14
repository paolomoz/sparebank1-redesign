#!/usr/bin/env node
// Validation loop per master SKILL.md § Validation rule + prototype Phase 2.7 mobile-adapt audit + token/data-attribute contracts.
// Usage: node stardust/scripts/validate-prototype.mjs <slug> [--no-shots]
// Offline: requests to www.sparebank1.no (photos, illustrations) are fulfilled with a same-aspect tinted SVG plate and counted as
// "externalFulfilled", never as failures (ground rule: no live hits). Everything else must load.
import fs from 'node:fs'; import path from 'node:path';
import { chromium } from 'playwright';
const slug=process.argv[2]; const noShots=process.argv.includes('--no-shots');
const file=path.resolve(`stardust/prototypes/${slug}-proposed.html`);
const html=fs.readFileSync(file,'utf8');
const report={slug,file,at:new Date().toISOString(),contract:{},viewports:{},mobileNav:{},pass:true,issues:[]};
const issue=(sev,where,msg)=>{report.issues.push({sev,where,msg}); if(sev==='P0'||sev==='P1') report.pass=false;};
// --- static contract checks
const styleStart=html.indexOf('<style'); const rootIdx=html.indexOf(':root',styleStart);
const firstStyle=html.slice(styleStart, html.indexOf('</style>',styleStart));
const tokens=['--heading-font-family','--body-font-family','--heading-xxl','--heading-xl','--heading-lg','--heading-md','--body','--body-sm','--line-height-heading','--line-height-body','--color-bg','--color-fg','--color-accent','--spacing-xs','--spacing-sm','--spacing-md','--spacing-lg','--spacing-xl','--spacing-2xl','--section-padding','--max-width','--radius'];
const missing=tokens.filter(t=>!firstStyle.includes(t+':'));
report.contract.rootFirst = rootIdx>-1 && /^\s*(\/\*[\s\S]*?\*\/\s*)*:root/.test(firstStyle.replace(/^<style[^>]*>/,''));
report.contract.tokensMissing=missing; if(missing.length) issue('P1','token-contract',`missing :root tokens ${missing.join(', ')}`);
if(!report.contract.rootFirst) issue('P1','token-contract',':root block is not the first content of the first <style>');
if(!/<!--\s*stardust:provenance/.test(html.slice(0,html.indexOf('<meta')))) issue('P1','provenance','provenance comment is not the first child of <head>');
if(!/<meta name="viewport" content="width=device-width/.test(html)) issue('P0','responsive','viewport meta missing');
const mediaMax=[...html.matchAll(/@media[^{]*max-width:\s*(\d+)px/g)].map(m=>+m[1]);
if(!mediaMax.length) issue('P0','responsive','no @media (max-width) rules'); else if(Math.min(...mediaMax)>640) issue('P1','responsive',`narrowest max-width breakpoint ${Math.min(...mediaMax)}px > 640`);
const ext=[...html.matchAll(/<(link[^>]+rel="stylesheet"|script[^>]+src=)[^>]*>/g)].map(m=>m[0]).filter(s=>/https?:\/\//.test(s));
if(ext.length) issue('P1','self-contained',`external css/js: ${ext.length}`);
const scripts=[...html.matchAll(/<script[\s\S]*?<\/script>/g)].map(m=>m[0]);
report.contract.inlineScripts=scripts.length; if(scripts.length>1) issue('P2','self-contained',`${scripts.length} inline scripts (only the nav a11y script is permitted)`);
// --- browser checks
const browser=await chromium.launch(); 
const VPS=[[1440,900],[768,1024],[390,844]];
const placeholder=(w,h)=>`<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}"><rect width="100%" height="100%" fill="#d8e9f2"/><rect x="1" y="1" width="${w-2}" height="${h-2}" fill="none" stroke="#7eb5d2" stroke-dasharray="6 6"/></svg>`;
for (const [w,h] of VPS){
  const ctx=await browser.newContext({viewport:{width:w,height:h},deviceScaleFactor:1,reducedMotion:'no-preference'});
  const page=await ctx.newPage();
  const vp={console:[],failed:[],externalFulfilled:0,exceptions:[]};
  page.on('console',m=>{ if(['error','warning'].includes(m.type())) vp.console.push(`${m.type()}: ${m.text()}`); });
  page.on('pageerror',e=>vp.exceptions.push(String(e)));
  page.on('requestfailed',r=>vp.failed.push(r.url()));
  page.on('response',r=>{ if(r.status()>=400 && !/sparebank1\.no/.test(r.url())) vp.failed.push(`${r.status()} ${r.url()}`); });
  await page.route(/^https?:\/\//, async route=>{ const u=route.request().url(); if(/^https?:\/\/(www\.)?sparebank1\.no\//.test(u)){ vp.externalFulfilled++; const m=u.match(/thumb\.(\d+)\.(\d+)/); let W=m?+m[1]:1200, H=m?Math.round(W*2/3):800; if(/bankchoice_bg\.svg/.test(u)){W=1250;H=368;} else if(/\.svg(\?|$)/.test(u)){W=200;H=200;} return route.fulfill({status:200,contentType:'image/svg+xml',body:placeholder(W,H)}); } if(/youtube(-nocookie)?\.com\/embed\//.test(u)){ vp.externalFulfilled++; return route.fulfill({status:200,contentType:'text/html',body:'<!doctype html><html><body style="margin:0;background:#d8e9f2"></body></html>'}); } vp.failed.push(`blocked external ${u}`); await route.abort(); });
  await page.goto('file://'+file,{waitUntil:'load'}); await page.waitForTimeout(400);
  const m=await page.evaluate(()=>{
    const de=document.documentElement, b=document.body;
    const overflowX = Math.max(de.scrollWidth,b.scrollWidth) - de.clientWidth;
    const wide=[...document.querySelectorAll('body *')].filter(el=>{const r=el.getBoundingClientRect(); return r.right>de.clientWidth+1 && r.width>0 && getComputedStyle(el).position!=='fixed';}).slice(0,5).map(el=>el.tagName.toLowerCase()+(el.className?'.'+String(el.className).split(' ')[0]:'')+'@'+Math.round(el.getBoundingClientRect().right));
    const lm={header:!!document.querySelector('header')&&document.querySelector('header').innerText.trim().length>0, main:!!document.querySelector('main')&&document.querySelector('main').innerText.trim().length>0, footer:!!document.querySelector('footer')&&document.querySelector('footer').innerText.trim().length>0, nav:!!document.querySelector('nav'), h1:document.querySelectorAll('h1').length};
    const imgsNoAlt=[...document.querySelectorAll('img')].filter(i=>!i.hasAttribute('alt')).length;
    const inputsNoLabel=[...document.querySelectorAll('input:not([type=hidden]),select,textarea')].filter(i=>{ if(i.getAttribute('aria-label')||i.getAttribute('aria-labelledby')) return false; if(i.id && document.querySelector(`label[for="${i.id}"]`)) return false; return !i.closest('label'); }).length;
    const hs=[...document.querySelectorAll('h1,h2,h3,h4,h5,h6')].filter(h=>h.offsetParent!==null||getComputedStyle(h).position==='absolute').map(h=>+h.tagName[1]); let skips=0; for(let i=1;i<hs.length;i++){ if(hs[i]-hs[i-1]>1) skips++; }
    const sections=[...document.querySelectorAll('main > section, main > * > section, header, footer, main section')]; const noAttr=sections.filter(s=>!(s.dataset.section&&s.dataset.intent&&s.dataset.layout)).map(s=>s.tagName.toLowerCase()+'.'+(s.className||'').split(' ')[0]);
    const btnSmallEls=[...document.querySelectorAll('a,button,summary,input,label[for]')].filter(el=>{const r=el.getBoundingClientRect(); const cs=getComputedStyle(el); if(r.width===0||r.height===0||cs.visibility==='hidden') return false; return r.height<40 && (el.tagName==='BUTTON'||el.tagName==='SUMMARY'||el.tagName==='LABEL'||(el.tagName==='A'&&cs.display!=='inline'));}); const btnSmall=btnSmallEls.length; const btnSmallList=btnSmallEls.slice(0,6).map(el=>el.tagName.toLowerCase()+'.'+String(el.className).split(' ')[0]+'@'+Math.round(el.getBoundingClientRect().height)+'px "'+(el.textContent||'').trim().slice(0,20)+'"');
    // contrast on text nodes
    const lum=c=>{const m=c.match(/\d+(\.\d+)?/g); if(!m) return null; const [r,g,b,a]=m.map(Number); if(a===0) return null; const f=v=>{v/=255; return v<=0.03928?v/12.92:((v+0.055)/1.055)**2.4}; return 0.2126*f(r)+0.7152*f(g)+0.0722*f(b);};
    const bg=el=>{let e=el; while(e){const c=getComputedStyle(e).backgroundColor; const m=c.match(/\d+(\.\d+)?/g); if(m && (m.length<4 || +m[3]>0.9)) return c; if(getComputedStyle(e).backgroundImage!=='none') return null; e=e.parentElement;} return 'rgb(255,255,255)';};
    const low=[]; const walker=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT); let n; let checked=0;
    while((n=walker.nextNode()) && checked<4000){ const t=n.textContent.trim(); if(t.length<2) continue; const el=n.parentElement; if(!el||el.closest('script,style,noscript')) continue; const cs=getComputedStyle(el); if(cs.visibility==='hidden'||cs.display==='none'||el.offsetParent===null&&cs.position!=='fixed') continue; const r=el.getBoundingClientRect(); if(r.width===0) continue; checked++; const fg=lum(cs.color); const bgc=bg(el); if(fg==null||bgc==null) continue; const bl=lum(bgc); if(bl==null) continue; const ratio=(Math.max(fg,bl)+0.05)/(Math.min(fg,bl)+0.05); const size=parseFloat(cs.fontSize); const large=size>=24||(size>=18.66&&+cs.fontWeight>=700); const floor=large?3:4.5; if(ratio<floor) low.push({t:t.slice(0,40),ratio:+ratio.toFixed(2),fg:cs.color,bg:bgc,size}); }
    const lazyLCP=(()=>{const cands=[...document.querySelectorAll('img')].map(i=>({i,r:i.getBoundingClientRect()})).filter(x=>x.r.top<innerHeight&&x.r.bottom>0&&x.r.width>100).sort((a,b)=>(b.r.width*b.r.height)-(a.r.width*a.r.height)); if(!cands.length) return null; const first=cands[0].i; return {loading:first.getAttribute('loading'),fp:first.getAttribute('fetchpriority'),src:(first.currentSrc||first.src).split('/').pop(),area:Math.round(cands[0].r.width*cands[0].r.height)};})();
    const focusRing=(()=>{const a=document.querySelector('main a, main button'); if(!a) return null; a.focus(); const cs=getComputedStyle(a); return cs.outlineStyle!=='none'||cs.boxShadow!=='none';})();
    return {overflowX,wide,lm,imgsNoAlt,inputsNoLabel,headingSkips:skips,headings:hs.length,sectionsNoAttr:noAttr,btnSmall,btnSmallList,lowContrast:low.slice(0,12),lowContrastCount:low.length,lazyLCP,focusRing,docHeight:de.scrollHeight};
  });
  Object.assign(vp,m);
  if(vp.overflowX>1) issue('P1',`${w}`,`horizontal overflow ${vp.overflowX}px: ${vp.wide.join(', ')}`);
  if(!vp.lm.header||!vp.lm.main||!vp.lm.footer) issue('P1',`${w}`,`landmark empty/missing ${JSON.stringify(vp.lm)}`);
  if(vp.lm.h1!==1) issue('P1',`${w}`,`h1 count ${vp.lm.h1}`);
  if(vp.imgsNoAlt) issue('P1',`${w}`,`${vp.imgsNoAlt} <img> without alt`);
  if(vp.inputsNoLabel) issue('P1',`${w}`,`${vp.inputsNoLabel} inputs without label`);
  if(vp.headingSkips) issue('P2',`${w}`,`${vp.headingSkips} heading level skips`);
  if(vp.sectionsNoAttr.length) issue('P1',`${w}`,`sections without data-section/intent/layout: ${vp.sectionsNoAttr.join(', ')}`);
  if(vp.lowContrastCount) issue('P1',`${w}`,`${vp.lowContrastCount} low-contrast text nodes e.g. ${JSON.stringify(vp.lowContrast.slice(0,3))}`);
  if(vp.lazyLCP && (vp.lazyLCP.loading==='lazy' || vp.lazyLCP.fp!=='high')) issue('P1',`${w}`,`LCP image not eager/high: ${JSON.stringify(vp.lazyLCP)}`);
  if(vp.btnSmall && w===390) issue('P2',`${w}`,`${vp.btnSmall} interactive elements < 40px tall: ${vp.btnSmallList.join(', ')}`);
  if(vp.console.length) issue('P1',`${w}`,`console: ${vp.console.slice(0,3).join(' | ')}`);
  if(vp.exceptions.length) issue('P0',`${w}`,`exceptions: ${vp.exceptions.slice(0,2).join(' | ')}`);
  if(vp.failed.length) issue('P1',`${w}`,`network failures: ${vp.failed.slice(0,3).join(' | ')}`);
  // interaction smoke
  const smoke={};
  try { const det=await page.$('main section details, main article details'); if(det){ await det.$eval('summary',s=>s.click()); smoke.detailsOpen=await det.evaluate(d=>d.open); } } catch(e){ smoke.detailsErr=String(e); }
  if (w===390){ const burger=await page.$('.ds-nav-burger'); if(burger){ await burger.click(); await page.waitForTimeout(250); smoke.navOpen=await page.evaluate(()=>{const n=document.querySelector('#main-menu, #ds-nav-list'); const cs=getComputedStyle(n); return cs.visibility==='visible'&&cs.opacity!=='0';}); smoke.ariaExpanded=await page.$eval('.ds-nav-burger',b=>b.getAttribute('aria-expanded')); await page.keyboard.press('Escape'); await page.waitForTimeout(250); smoke.navClosedByEsc=await page.evaluate(()=>getComputedStyle(document.querySelector('#main-menu, #ds-nav-list')).visibility!=='visible'); if(!smoke.navOpen) issue('P1','390','burger did not open nav'); } }
  // keyboard: tab until primary CTA reached (max 60 tabs)
  smoke.ctaReachableByKeyboard=await page.evaluate(async()=>{ const target=document.querySelector('main [data-cta="primary"], main .btn-action, main .btn-primary'); if(!target) return 'no-primary-cta'; return 'present'; });
  if(smoke.ctaReachableByKeyboard==='present'){ await page.evaluate(()=>{ window.scrollTo(0,0); const first=document.querySelector('.skip a, a, button'); first && first.focus(); }); let hit=false; for(let i=0;i<80;i++){ await page.keyboard.press('Tab'); const isT=await page.evaluate(()=>{const a=document.activeElement; return a && a.matches('main [data-cta="primary"], main .btn-action, main .btn-primary');}); if(isT){hit=true;break;} } smoke.ctaReachableByKeyboard=hit; if(!hit) issue('P1',`${w}`,'primary CTA not reachable within 80 Tabs'); }
  // hover interactive card
  const card=await page.$('main a.card, main .card a, main [data-section] a'); if(card){ await card.hover().catch(()=>{}); smoke.hovered=true; }
  vp.smoke=smoke;
  await page.evaluate(()=>{ if(document.activeElement) document.activeElement.blur(); window.scrollTo(0,0); }); await page.waitForTimeout(100);
  if(!noShots){ fs.mkdirSync(`stardust/validation/${slug}`,{recursive:true}); await page.screenshot({path:`stardust/validation/${slug}/${w}.png`,fullPage:true}); }
  report.viewports[w]=vp; await ctx.close();
}
// mobile-nav audit at 360
{ const ctx=await browser.newContext({viewport:{width:360,height:800}}); const page=await ctx.newPage();
  await page.route(/^https?:\/\//, r=>r.fulfill({status:200,contentType:'image/svg+xml',body:placeholder(600,400)}));
  await page.goto('file://'+file); await page.waitForTimeout(300);
  const r=await page.evaluate(()=>{ const de=document.documentElement; const over=Math.max(de.scrollWidth,document.body.scrollWidth)-de.clientWidth; const nav=[...document.querySelectorAll('header nav *')]; const fs=nav.map(e=>parseFloat(getComputedStyle(e).fontSize)).filter(Boolean); const gaps=[...document.querySelectorAll('header nav')].map(n=>getComputedStyle(n)).filter(cs=>/flex|grid/.test(cs.display)).map(cs=>parseFloat(cs.columnGap||cs.gap)||0); return {over,minFont:Math.min(...fs,99),minGap:gaps.length?Math.min(...gaps):null,collapse:document.querySelector('header')?.dataset.navCollapse||null}; });
  report.mobileNav=r; if(r.over>1) issue('P1','360','audit/responsive: horizontal-overflow-at-360px'); if(r.minFont<11) issue('P1','360','audit/responsive: nav-readability-floor (font)'); if(r.minGap!=null && r.minGap<10 && !r.collapse) issue('P1','360','audit/responsive: nav-readability-floor (gap)');
  await ctx.close(); }
await browser.close();
fs.mkdirSync(`stardust/validation/${slug}`,{recursive:true});
fs.writeFileSync(`stardust/validation/${slug}/report.json`,JSON.stringify(report,null,1));
const p01=report.issues.filter(i=>i.sev==='P0'||i.sev==='P1');
console.log(`${slug}: ${report.pass?'PASS':'FAIL'} — ${p01.length} P0/P1, ${report.issues.length-p01.length} P2/P3; externalFulfilled ${Object.values(report.viewports).map(v=>v.externalFulfilled).join('/')}; heights ${Object.values(report.viewports).map(v=>v.docHeight).join('/')}`);
for (const i of report.issues) console.log(`  [${i.sev}] ${i.where}: ${i.msg}`);
for (const [w,v] of Object.entries(report.viewports)) console.log(`  ${w}: smoke ${JSON.stringify(v.smoke)}`);
console.log(`  360 nav: ${JSON.stringify(report.mobileNav)}`);
process.exit(report.pass?0:1);
