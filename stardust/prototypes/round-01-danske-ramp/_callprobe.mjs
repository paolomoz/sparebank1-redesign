import { chromium } from 'playwright';
const b=await chromium.launch();
for (const url of ['http://localhost:8820/nb-bank-privat-lan-html-proposed.html','http://localhost:3020/nb/bank/privat/lan']) {
  const p=await b.newPage({viewport:{width:360,height:844}}); await p.goto(url,{waitUntil:'networkidle'}); await p.evaluate(async()=>{for(let y=0;y<document.documentElement.scrollHeight;y+=800){scrollTo(0,y);await new Promise(r=>setTimeout(r,30));}}); await p.waitForTimeout(400);
  const r=await p.evaluate(()=>{const c=[...document.querySelectorAll('.callout')].find(x=>x.textContent.includes('Samtykke Altinn')&&!x.querySelector('.callout')); const cs=getComputedStyle(c); const svg=c.querySelector('svg'); const t=c.querySelector('.callout-text'); const a=c.querySelector('a.btn, a.button'); const as=getComputedStyle(a);
    return {pad:cs.padding,gap:cs.gap,display:cs.display,svg:svg?[Math.round(svg.getBoundingClientRect().width),getComputedStyle(svg).display]:null,textW:Math.round(t.getBoundingClientRect().width),textX:Math.round(t.getBoundingClientRect().x),aW:Math.round(a.getBoundingClientRect().width),aH:Math.round(a.getBoundingClientRect().height),ws:as.whiteSpace,fs:as.fontSize,pad_a:as.padding};});
  console.log(url); console.log(JSON.stringify(r)); await p.close();
}
await b.close();
