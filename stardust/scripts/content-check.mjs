#!/usr/bin/env node
// Verbatim-content gate: every visible heading / paragraph / link (text + href) / image src / FAQ item of the captured page
// must appear in the proposed prototype. Usage: node stardust/scripts/content-check.mjs <slug> [--regions header,bank-choice,main,footer]
import fs from 'node:fs'; import path from 'node:path'; import { parseHTML } from 'linkedom';
const slug=process.argv[2]; const regArg=(process.argv.find(a=>a.startsWith('--regions='))||'').split('=')[1];
const argv=process.argv; const optv=(k)=>{const i=argv.indexOf(k); return i>0?argv[i+1]:null;}; const FILE=optv('--file')||`stardust/prototypes/${slug}-proposed.html`; const OUTF=optv('--out')||`stardust/validation/${slug}/content-check.json`;
const regions=regArg?regArg.split(','):['header','bank-choice','main','footer'];
const norm=s=>(s||'').replace(/\s+/g,' ').replace(/ /g,' ').trim();
const cap=parseHTML(fs.readFileSync(`stardust/current/pages/${slug}.html`,'utf8')).document;
const pro=parseHTML(fs.readFileSync(FILE,'utf8')).document;
for(const s of cap.querySelectorAll('script,style,noscript,template')) s.remove();
const hidden=el=>{let e=el; while(e&&e.getAttribute){const c=e.getAttribute('class')||''; const st=e.getAttribute('style')||''; const isPanelTemplate=/-template$/.test(e.id||''); if(!isPanelTemplate && /(^|\s)(hide|hidden|d-none|ffe-collapse--hidden)(\s|$)/.test(c)) return true; if(e.getAttribute('role')==='alert') return true; if(/display:\s*none/.test(st)) return true; if(e.hasAttribute('hidden')) return true; e=e.parentElement;} return false;};
const authUi=el=>!!el.closest('.login-buttons, .user-buttons, .logout-btn, #login-choices');
const dynamicUi=el=>!!el.closest('.contact-bankpicker, .postal-input, .js-postal-input, .office-search-form, .find-us, [id^=find-us]');
const proText=norm(pro.body.textContent); const proHtml=pro.documentElement.outerHTML;
const rel=h=>h.replace(/^https:\/\/www\.sparebank1\.no(?=\/)/,'').replace(/^\/content\/sites\/sb1(?=\/)/,'');
const PM=(()=>{try{const st=JSON.parse(fs.readFileSync('stardust/state.json','utf8')); return (st.migrate?.pageMap)||st.pages.map(p=>{const sp=new URL(p.url).pathname; return {slug:p.slug,sourceUrl:sp,outputPath:sp.replace(/^\//,'')};});}catch{return [];}})();
const me=PM.find(x=>x.slug===slug); const relToSite=h=>{ if(!me||!/^\.\.?\//.test(h)) return h; const abs='/'+path.posix.normalize(path.posix.join(path.posix.dirname(me.outputPath),h.split(/(?=[?#])/)[0])); return abs; }; const proHrefs=new Set([...pro.querySelectorAll('a[href]')].flatMap(a=>{const h=a.getAttribute('data-unresolved-href')||a.getAttribute('href'); /* an unresolved AEM link template / authoring placeholder is kept verbatim in data-unresolved-href (the href bounces to the source page) */ const site=relToSite(h); const search=h.replace(/^https:\/\/www\.sparebank1\.no\/nb\/bank\/[a-z-]+\/kundeservice\.html(?=\?search=)/,''); return [rel(h),rel(site),rel(site).replace(/\.html$/,''),rel(site)+'.html',search];})); // the bundle routes ?search= to the live search page (dynamics #20 interim) — same target
const proSrcs=new Set([...pro.querySelectorAll('img[src]')].map(i=>i.getAttribute('src').replace(/^https:\/\/www\.sparebank1\.no/,'')));
const miss={text:[],href:[],img:[]}; let checked={text:0,href:0,img:0};
const sel={header:'header','bank-choice':'.bank-choice--inline',main:'main',footer:'footer'};
for(const r of regions){ const root=cap.querySelector(sel[r]); if(!root) continue;
  for(const el of root.querySelectorAll('h1,h2,h3,h4,h5,h6,p,li,dt,dd,figcaption,summary,label,span.card__tag,span.card__date')){
    if(authUi(el)) continue; if(hidden(el)&&r!=='footer') continue; if(r==='footer'&&(hidden(el)||dynamicUi(el))) continue; if(el.querySelector('p,li,h2,h3,h4')) continue; const t=norm(el.textContent); if(!t||t.length<2) continue; if(/^(Til toppen|Vennligst vent|Meny)$/.test(t)) continue;
    checked.text++; if(!proText.includes(t)){ // allow captured uppercase→sentence case for nav labels
      const alt=t.length<24 && proText.toLowerCase().includes(t.toLowerCase()); if(!alt) miss.text.push({r,t:t.slice(0,90)}); }
  }
  for(const a of root.querySelectorAll('a[href]')){ const h=a.getAttribute('href'); if(!h||h==='#/'||h==='#'||h.startsWith('javascript')) continue; if(authUi(a)) continue; if(hidden(a)&&r!=='footer'&&r!=='bank-choice') continue; checked.href++; const rh=rel(h); if(!proHrefs.has(rh)&&!proHrefs.has(rh.toLowerCase())&&!proHrefs.has(rh.split(/[?#]/)[0])) miss.href.push({r,h,t:norm(a.textContent).slice(0,40)}); }
  for(const i of root.querySelectorAll('img')){ const s=i.getAttribute('data-lazy-src')||i.getAttribute('src'); if(!s||/logo[a-z0-9-]*\.svg|chevron\.svg|material-icons/.test(s)) continue; if(hidden(i)) continue; checked.img++; if(!proSrcs.has(s)) miss.img.push({r,s:s.split('/').pop()}); }
}
const n=miss.text.length+miss.href.length+miss.img.length;
console.log(`${slug}: content-check ${n?'FAIL':'PASS'} — checked text ${checked.text}, hrefs ${checked.href}, imgs ${checked.img}; missing text ${miss.text.length}, hrefs ${miss.href.length}, imgs ${miss.img.length}`);
for(const m of miss.text) console.log('  TEXT ',m.r,JSON.stringify(m.t)); for(const m of miss.href) console.log('  HREF ',m.r,m.h,'|',m.t); for(const m of miss.img) console.log('  IMG  ',m.r,m.s);
fs.mkdirSync(path.dirname(OUTF),{recursive:true}); fs.writeFileSync(OUTF,JSON.stringify({slug,file:FILE,checked,miss},null,1));
process.exit(n?1:0);
