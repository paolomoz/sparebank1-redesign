import { chromium } from 'playwright';
const b=await chromium.launch(); const p=await b.newPage({viewport:{width:1440,height:900}});
const errs=[]; p.on('console',m=>{ if(m.type()==='error') errs.push(m.text().slice(0,200)); }); p.on('pageerror',e=>errs.push('PAGEERROR '+String(e).slice(0,300)));
await p.goto('http://localhost:3020/nb/bank/privat/lan/boliglan',{waitUntil:'networkidle'}); await p.waitForTimeout(1500);
const r=await p.evaluate(()=>{const c=document.querySelector('.columns.promo'); return {cls:c?.className, status:c?.dataset.blockStatus, html:c?.outerHTML.slice(0,700)};});
console.log(JSON.stringify(r,null,1)); console.log('errors:', errs); await b.close();
