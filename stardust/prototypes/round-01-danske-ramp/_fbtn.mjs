import { chromium } from 'playwright';
const b=await chromium.launch(); const p=await b.newPage({viewport:{width:360,height:844}});
await p.goto('http://localhost:3020/nb/bank/privat',{waitUntil:'networkidle'}); await p.evaluate(async()=>{for(let y=0;y<document.documentElement.scrollHeight;y+=600){scrollTo(0,y);await new Promise(r=>setTimeout(r,40));}}); await p.waitForTimeout(600);
const r=await p.evaluate(()=>{const a=document.querySelector('footer .contact-head a'); const cs=getComputedStyle(a); const pp=a.parentElement; return {cls:a.className, w:a.getBoundingClientRect().width, display:cs.display, width:cs.width, parent:pp.tagName+'.'+pp.className, parentDisplay:getComputedStyle(pp).display, parentW:pp.getBoundingClientRect().width, headDisplay:getComputedStyle(pp.parentElement).display};});
console.log(JSON.stringify(r)); await b.close();
