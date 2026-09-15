import { chromium } from 'playwright';
const b=await chromium.launch(); const p=await b.newPage({viewport:{width:360,height:844}});
await p.goto('http://localhost:3020/nb/bank/privat',{waitUntil:'networkidle'}); await p.evaluate(async()=>{for(let y=0;y<document.documentElement.scrollHeight;y+=600){scrollTo(0,y);await new Promise(r=>setTimeout(r,40));}}); await p.waitForTimeout(800);
const r=await p.evaluate(()=>{const el=document.querySelector('.cards.news li.card .card-body'); const cs=getComputedStyle(el);
 const rules=[...document.styleSheets].flatMap(s=>{try{return [...s.cssRules].flatMap(r=>r.cssRules?[...r.cssRules].map(x=>({r:x,media:r.conditionText})):[{r}])}catch{return []}}).filter(({r})=>r.selectorText&&el.matches(r.selectorText)&&/padding/.test(r.cssText)).map(({r,media})=>(r.parentStyleSheet.href||'').split('/').slice(-1)[0]+(media?' @'+media:'')+': '+r.cssText.slice(0,120));
 return {padding:cs.padding, li:el.parentElement.className, ul:el.parentElement.parentElement.className, rules};});
console.log(JSON.stringify(r,null,1)); await b.close();
