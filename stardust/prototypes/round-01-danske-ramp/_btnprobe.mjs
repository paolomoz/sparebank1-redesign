import { chromium } from 'playwright';
const b=await chromium.launch();
for (const url of ['http://localhost:8820/nb-bank-privat-kundeservice-html-proposed.html','http://localhost:3020/nb/bank/privat/kundeservice','http://localhost:3020/nb/bank/privat/lan']) {
  const p=await b.newPage({viewport:{width:360,height:844}}); await p.goto(url,{waitUntil:'networkidle'}); await p.waitForTimeout(800);
  const r=await p.evaluate(()=>{const a=[...document.querySelectorAll('header a')].find(x=>/Logg inn/.test(x.textContent)); const bb=a.getBoundingClientRect(); const cs=getComputedStyle(a); return {cls:a.className,x:Math.round(bb.x),w:Math.round(bb.width),h:Math.round(bb.height),font:cs.fontFamily.slice(0,30),fs:cs.fontSize,pad:cs.padding,href:a.getAttribute('href')};});
  console.log(url.split('/').slice(-1)[0], JSON.stringify(r)); await p.close();
}
await b.close();
