import { chromium } from 'playwright';
const b=await chromium.launch();
for (const slug of ['nb-bank-om-oss-nyheter-html','nb-bank-om-oss-nyheter-bankkort-laget-av-resirkulert-plast-html']) {
  const p=await b.newPage({viewport:{width:360,height:844}}); await p.goto(`http://localhost:8820/${slug}-proposed.html`,{waitUntil:'networkidle'}); await p.evaluate(async()=>{for(let y=0;y<document.documentElement.scrollHeight;y+=800){scrollTo(0,y);await new Promise(r=>setTimeout(r,30));}}); await p.waitForTimeout(500);
  const r=await p.evaluate(()=>[...document.querySelectorAll('.footer-col')].map(c=>({h:Math.round(c.getBoundingClientRect().height),h2:Math.round(c.querySelector('h2').getBoundingClientRect().height),lis:[...c.querySelectorAll('li')].map(l=>Math.round(l.getBoundingClientRect().height)),imgs:[...c.querySelectorAll('img')].map(i=>[Math.round(i.getBoundingClientRect().width),Math.round(i.getBoundingClientRect().height),getComputedStyle(i).display])})));
  console.log(slug, JSON.stringify(r)); await p.close();
}
await b.close();
