import { chromium } from 'playwright';
const b=await chromium.launch(); const p=await b.newPage({viewport:{width:1440,height:900}});
await p.goto('http://localhost:3020/nb/bank/privat/lan/boliglan',{waitUntil:'networkidle'}); await p.waitForTimeout(1500);
const r=await p.evaluate(()=>{const ul=document.querySelector('.cards.choices ul'); const li=ul?.querySelector('li'); const cs=ul?getComputedStyle(ul):null; const ls=li?getComputedStyle(li):null;
 const rules=[...document.styleSheets].flatMap(s=>{try{return [...s.cssRules]}catch{return []}}).filter(r=>r.selectorText&&li&&li.matches(r.selectorText)&&/grid-column|display|width/.test(r.cssText)).map(r=>r.parentStyleSheet.href?.split('/').slice(-1)[0]+': '+r.cssText.slice(0,140));
 return {ulClass:ul?.className, display:cs?.display, cols:cs?.gridTemplateColumns?.slice(0,80), gap:cs?.gap, liClass:li?.className, liCol:ls?.gridColumn, liW:li?.getBoundingClientRect().width, rules:rules.slice(0,12)};});
console.log(JSON.stringify(r,null,1)); await b.close();
