import { chromium } from 'playwright';
const b=await chromium.launch(); const p=await b.newPage({viewport:{width:360,height:844}});
await p.goto('http://localhost:3020/nb/bank/privat',{waitUntil:'networkidle'}); await p.waitForTimeout(1200);
const r=await p.evaluate(()=>{const f=document.querySelector('.hero .hero-media'); const cs=getComputedStyle(f); const img=f.querySelector('img'); const ic=getComputedStyle(img); const g=getComputedStyle(f.parentElement);
 return {fig:{h:f.getBoundingClientRect().height,ar:cs.aspectRatio,minH:cs.minHeight,alignSelf:cs.alignSelf,pos:cs.position,display:cs.display,order:cs.order,gridRow:cs.gridRow},img:{h:img.getBoundingClientRect().height,pos:ic.position,height:ic.height,ar:ic.aspectRatio},grid:{rows:g.gridTemplateRows,alignItems:g.alignItems}};});
console.log(JSON.stringify(r)); await b.close();
