#!/usr/bin/env node
// Outline of a captured page's rendered DOM (header · bank-choice · main · footer) for verbatim content sourcing.
// Usage: node stardust/scripts/page-content.mjs <slug> [--json]
import fs from 'node:fs';
import { parseHTML } from 'linkedom';
const slug = process.argv[2]; const asJson = process.argv.includes('--json'); const showHidden = process.argv.includes('--hidden');
const html = fs.readFileSync(`stardust/current/pages/${slug}.html`,'utf8');
const { document } = parseHTML(html);
for (const s of document.querySelectorAll('script,style,noscript,template')) s.remove();
const norm = s => (s||'').replace(/\s+/g,' ').trim();
const abs = h => { if(!h) return h; if(h.startsWith('http')||h.startsWith('#')||h.startsWith('mailto:')||h.startsWith('tel:')) return h; return h; };
const hidden = el => { let e=el; while(e && e.getAttribute){ const c=e.getAttribute('class')||''; const st=e.getAttribute('style')||''; if(/\bhide\b|\bhidden\b|visually-hidden|d-none/.test(c) && !/focusable/.test(c)) return true; if(/display:\s*none/.test(st)) return true; if(e.getAttribute('aria-hidden')==='true' && e.tagName!=='IMG') return true; if(e.getAttribute('hidden')!=null) return true; e=e.parentElement;} return false; };
const BLOCK = new Set(['H1','H2','H3','H4','H5','H6','P','LI','FIGCAPTION','TD','TH','DT','DD','BLOCKQUOTE','SUMMARY','LABEL','BUTTON','A','IMG','PICTURE','INPUT','SELECT','TEXTAREA','DETAILS','TABLE','IFRAME','VIDEO','SVG']);
const out=[];
function walk(el, depth){
  for (const n of el.childNodes){
    if (n.nodeType===3){ const t=norm(n.textContent); if(t && !BLOCK.has(el.tagName)) out.push({k:'text',t,p:path(el)}); continue; }
    if (n.nodeType!==1) continue;
    const tag=n.tagName; if(!showHidden && hidden(n)) { if(tag==='DIV'||tag==='SECTION'||tag==='UL'||tag==='NAV') continue; }
    if (tag==='IMG'){ const src=n.getAttribute('data-lazy-src')||n.getAttribute('src')||''; if(!/logo\.svg$/.test(src)||/header/.test(path(n))) out.push({k:'img',src,alt:n.getAttribute('alt')||'',w:n.getAttribute('width'),h:n.getAttribute('height'),ah:n.getAttribute('aria-hidden')==='true',p:path(n)}); continue; }
    if (tag==='SVG'){ out.push({k:'svg',classes:n.getAttribute('class')||'',p:path(n),bytes:n.outerHTML.length}); continue; }
    if (tag==='A'){ const t=norm(n.textContent); const imgs=[...n.querySelectorAll('img')].map(i=>({src:i.getAttribute('data-lazy-src')||i.getAttribute('src'),alt:i.getAttribute('alt')||''})); out.push({k:'a',t,href:n.getAttribute('href'),classes:n.getAttribute('class')||'',imgs,p:path(n),hidden:hidden(n)}); continue; }
    if (tag==='BUTTON'){ out.push({k:'button',t:norm(n.textContent),classes:n.getAttribute('class')||'',aria:n.getAttribute('aria-label')||'',p:path(n),hidden:hidden(n)}); continue; }
    if (/^H[1-6]$/.test(tag)){ out.push({k:tag.toLowerCase(),t:norm(n.textContent),html:norm(n.innerHTML),p:path(n),hidden:hidden(n)}); continue; }
    if (tag==='P'||tag==='LI'||tag==='FIGCAPTION'||tag==='TD'||tag==='TH'||tag==='DT'||tag==='DD'||tag==='BLOCKQUOTE'||tag==='SUMMARY'||tag==='LABEL'){ const links=[...n.querySelectorAll('a')].map(a=>({t:norm(a.textContent),href:a.getAttribute('href')})); out.push({k:tag.toLowerCase(),t:norm(n.textContent),html:norm(n.innerHTML),links,p:path(n),hidden:hidden(n)}); continue; }
    if (tag==='INPUT'||tag==='SELECT'||tag==='TEXTAREA'){ out.push({k:'input',type:n.getAttribute('type'),name:n.getAttribute('name'),placeholder:n.getAttribute('placeholder'),id:n.getAttribute('id'),p:path(n)}); continue; }
    if (tag==='IFRAME'||tag==='VIDEO'){ out.push({k:tag.toLowerCase(),src:n.getAttribute('src')||n.getAttribute('data-src'),title:n.getAttribute('title'),p:path(n)}); continue; }
    if (tag==='TABLE'){ out.push({k:'table',html:norm(n.outerHTML).slice(0,4000),p:path(n)}); continue; }
    walk(n, depth+1);
  }
}
function path(el){ const parts=[]; let e=el; let i=0; while(e && e.tagName && e.tagName!=='BODY' && i<6){ const c=(e.getAttribute('class')||'').split(/\s+/).filter(x=>x&&!/^(parbase|aem-|ffe-grid|clearfix|component-root|js-|id-\d)/.test(x)).slice(0,2).join('.'); parts.unshift(e.tagName.toLowerCase()+(c?'.'+c:'')); e=e.parentElement; i++; } return parts.join(' > '); }
const regions={};
const pick=(name,sel)=>{ const el=document.querySelector(sel); if(!el) return; out.length=0; walk(el,0); regions[name]=[...out]; };
pick('skip','nav.page-nav'); pick('header','header'); pick('bank-choice','.bank-choice'); pick('main','main'); pick('footer','footer');
if (showHidden){ pick('login-choices','#login-choices, .login-choices, .login-modal'); pick('bank-list','.bank-choice__all-banks, .bank-list, .bank-choice-overlay'); pick('contact-panels','#contact-us'); }
// modals rendered outside main (login choices, bank choice overlay)
if (asJson){ console.log(JSON.stringify({slug,title:document.title,regions},null,1)); process.exit(0); }
for (const [r,items] of Object.entries(regions)){
  console.log(`\n=== ${r} (${items.length})`);
  for (const it of items){
    const h = it.hidden?' [hidden]':'';
    if (it.k==='img') console.log(`  IMG ${it.src} | alt="${it.alt}"${it.ah?' aria-hidden':''} | ${it.p}`);
    else if (it.k==='a') console.log(`  A "${it.t}" → ${it.href}${it.imgs.length?` [img ${it.imgs.map(i=>i.src.split('/').pop()).join(',')}]`:''}${h} | ${it.p}`);
    else if (it.k==='button') console.log(`  BTN "${it.t}"${it.aria?` aria=${it.aria}`:''}${h} | ${it.p}`);
    else if (it.k==='svg') console.log(`  SVG .${it.classes} (${it.bytes}b) | ${it.p}`);
    else if (it.k==='input') console.log(`  INPUT ${it.type} name=${it.name} ph="${it.placeholder}" id=${it.id}`);
    else if (it.k==='text') console.log(`  txt "${it.t}" | ${it.p}`);
    else console.log(`  ${it.k.toUpperCase()} "${it.t}"${it.links&&it.links.length?` links:${JSON.stringify(it.links)}`:''}${h} | ${it.p}`);
  }
}
