import { chromium } from 'playwright';
const b=await chromium.launch();
for (const url of ['http://localhost:8820/nb-bank-privat-html-proposed.html','http://localhost:3020/nb/bank/privat']) {
  const p=await b.newPage({viewport:{width:1440,height:900}}); await p.goto(url,{waitUntil:'networkidle'}); await p.evaluate(async()=>{for(let y=0;y<document.documentElement.scrollHeight;y+=600){scrollTo(0,y);await new Promise(r=>setTimeout(r,50));}}); await p.waitForTimeout(800);
  const r=await p.evaluate(()=>{const g=s=>{const e=document.querySelector(s); if(!e) return null; const b=e.getBoundingClientRect(); const cs=getComputedStyle(e); return {top:Math.round(b.top+scrollY),h:Math.round(b.height),w:Math.round(b.width),pt:cs.paddingTop,pb:cs.paddingBottom,mt:cs.marginTop,disp:cs.display,cols:cs.gridTemplateColumns.slice(0,60)};};
    return {contact:g('.contact'),contactHead:g('.contact-head'),channels:g('.channels'),channel:g('.channel'),siteFooter:g('.site-footer'),grid:g('.footer-grid'),cols:g('.footer-cols'),col:g('.footer-col'),legal:g('.footer-legal'),logo:g('.footer-logo')};});
  console.log(url); console.log(JSON.stringify(r)); await p.close();
}
await b.close();
