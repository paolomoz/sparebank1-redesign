import { chromium } from 'playwright';
const b=await chromium.launch();
for (const slug of ['nb-bank-om-oss-nyheter-html','nb-bank-om-oss-nyheter-bankkort-laget-av-resirkulert-plast-html']) {
  const p=await b.newPage({viewport:{width:360,height:844}}); await p.goto(`http://localhost:8820/${slug}-proposed.html`,{waitUntil:'networkidle'}); await p.evaluate(async()=>{for(let y=0;y<document.documentElement.scrollHeight;y+=800){scrollTo(0,y);await new Promise(r=>setTimeout(r,30));}}); await p.waitForTimeout(500);
  const r=await p.evaluate(()=>{const g=s=>{const e=document.querySelector(s); if(!e) return null; const cs=getComputedStyle(e); return {h:Math.round(e.getBoundingClientRect().height),pt:cs.paddingTop,pb:cs.paddingBottom,mt:cs.marginTop,fs:cs.fontSize,lh:cs.lineHeight,gap:cs.rowGap};};
    return {footer:g('footer'),site:g('.site-footer'),grid:g('.footer-grid'),cols:g('.footer-cols'),col:g('.footer-col'),colUl:g('.footer-col ul'),li:g('.footer-col li'),legal:g('.footer-legal'),links:g('.legal-links'),addr:g('.address'),logo:g('.footer-logo')};});
  console.log(slug); console.log(JSON.stringify(r)); await p.close();
}
await b.close();
